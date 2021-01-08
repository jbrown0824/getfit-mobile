<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>About Me</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">GetFit Or Die Tryin'</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-card v-if="!user">
				<ion-card-content>
					<ion-button expand="full" @click="openAppleSignIn()" v-if="showAppleSignIn">
						<ion-icon name="logo-apple" slot="start"></ion-icon>
						Sign in with Apple
					</ion-button>
				</ion-card-content>
			</ion-card>


			<div v-if="user" id="container">
				<section>
					<header>Today's Calories: {{ calories }}</header>
				</section>
				<section>
					<ion-button @click="queryHKitSampleType('activeEnergyBurned')" color="success">Refresh
						<ion-icon slot="end" :icon="refreshOutline"/>
					</ion-button>
					<pre>{{ data }}</pre>
				</section>
				<!--        <section v-if="!hasAccess">-->
				<!--          <ion-button @click="requestAccess" color="success">Allow HealthKit Access</ion-button>-->
				<!--        </section>-->
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { refreshOutline } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import { ResponseSignInWithApplePlugin } from '@capacitor-community/apple-sign-in';
import StorageHelper from '../storage/Storage';
const { CapacitorHealthkit, Device, SignInWithApple } = Plugins;

interface Tab1Data {
	user: null | object;
	[key: string]: any;
}

export default defineComponent({
	name: 'Tab1',

	setup() {
		return {
			refreshOutline,
		};
	},

	data(): Tab1Data {
		return {
			dataName: '',
			data: {
				resultData: [],
			},
			hasAccess: false,
			accessGranted: false,
			showAppleSignIn: false,
			user: null,
			error: '',
		};
	},

	computed: {

		calories() {
			let calories = 0;
			this.data.resultData.forEach((data: any) => {
				calories += data.value;
			});

			return calories;
		},

	},

	mounted() {
		CapacitorHealthkit.isAvailable(() => {
			this.hasAccess = true;
		}, () => {
			this.hasAccess = false;
		});

		this.checkAuth();
	},

	methods: {

		async requestAccess() {
			if (this.accessGranted) return console.log('already granted access');
			console.log('requestnig access');
			const result = await CapacitorHealthkit.requestAuthorization({
				all: ["calories", "stairs", "activity"],
				read: ['steps', 'stairs', 'distance', 'duration', 'calories', 'activity'], // ask for Read Only permission
				write: [],
			}, (...args: any[]) => {
				console.log('request access success', args);
				this.hasAccess = true;
				this.accessGranted = true;
			}, (...args: any[]) => {
				console.log('request access failure', args);
				this.hasAccess = false;
			});

			console.log('request access result', result);
		},

		async checkAuth() {
			console.log('will check auth');
			const device = await Device.getInfo();

			this.user = await StorageHelper.get('user');
			if (this.user) {
				// Authed
				console.log('has user', this.user);
			} else {
				this.showAppleSignIn = device.platform === 'ios';
				console.log('show Apple Sign In');
			}
		},

		async openAppleSignIn() {
			console.log('calling openAppleSIgnIn');

			try {
				console.log('attempting auth');
				const res: ResponseSignInWithApplePlugin = await SignInWithApple.Authorize()
				console.log('authorized??', res);
				if (res.response && res.response.identityToken) {
					this.user = res.response;
					StorageHelper.set('user', this.user);
				} else {
					console.log('Unable to Process Sign In', res, 'response: ', res.response);
					this.error = 'Unable to Process Sign In';
				}
			} catch (e) {
				console.log('Apple Sign In Failed', e);
				this.error = 'Unable to Sign In: ' + e.message;
			}
		},

		async queryHKitSampleType(sampleName: string) {
			await this.requestAccess();
			// sample name, start date (string), end Date (date), limit (0 to infinite)
			// let start = "2019/07/01" // YY/MM/DD
			// this.dataName = sampleName;
			// const startDate = new Date();
			// startDate.setHours(0, 0, 0, 0);
			//
			// const endDate = new Date();
			// this.data = await CapacitorHealthkit.queryHKitSampleType({
			// 	sampleName,
			// 	startDate,
			// 	endDate,
			// 	limit: 0
			// });

			this.data = await CapacitorHealthkit.queryHKActivitySummary();

			console.log('activity summary?', this.data);

		},

	},

	components: {
		IonCard,
		IonCardContent,
		IonIcon,
		IonButton,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonPage,
	}
});

</script>
