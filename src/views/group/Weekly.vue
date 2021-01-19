<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>{{ groupName }} Weekly Info</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">GetFit Or Die Tryin'</ion-title>
				</ion-toolbar>
			</ion-header>

			<div id="container">
				<section>
					<header><h4>This Week</h4></header>
					<p>Goals Met: {{ (thisWeek && thisWeek.hasOwnProperty('goalsMet')) ? thisWeek.goalsMet : 0 }}/{{ group.weekly_goals }}</p>
				</section>
				<section v-if="lastWeek && lastWeek.hasOwnProperty('goalsMet')">
					<header><h4>Last Week</h4></header>
					<p>Goals Met: {{ lastWeek.goalsMet }}/{{ group.weekly_goals }}</p>
				</section>
				<section>
					<header><h4>Overall</h4></header>
					<p>Goals Met: {{ totalGoals.met }}</p>
					<p>Goals Missed: {{ totalGoals.missed }}</p>
				</section>
				<section>
					<ion-button @click="() => getActivity()" color="success">Refresh
						<ion-icon v-if="!loading" slot="end" :icon="refreshOutline"/>
						<ion-spinner v-if="loading"></ion-spinner>
					</ion-button>
				</section>
				<!--        <section v-if="!hasAccess">-->
				<!--          <ion-button @click="requestAccess" color="success">Allow HealthKit Access</ion-button>-->
				<!--        </section>-->
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, IonSpinner, toastController } from '@ionic/vue';
import { refreshOutline } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import { Group, User, UserAggregateStat, UserAggregateStats } from '@/types';
import axios from 'axios';
import { getSampleDataResponse, queryActivitySummary } from '@/services/get-health-data';
import { format, sub, startOfWeek, min, parseISO } from 'date-fns';

const { Device } = Plugins;

const AGGREGATE_KEY_FORMAT = 'yyyyLLdd';

interface GoalTotals {
	met: number;
	missed: number;
}

export default defineComponent({
	name: 'Weekly',

	setup() {
		const user = inject('user');
		const activeGroup: Group | null = inject('activeGroup', null);
		const activeGroupId = inject('activeGroupId');

		return {
			refreshOutline,
			user,
			activeGroup,
			activeGroupId,
		};
	},

	data(): {
		stats: any[];
		hasAccess: boolean;
		accessGranted: boolean;
		aggregate: UserAggregateStats;
		user?: User;
		loading: boolean | null;
		[ key: string ]: unknown;
	} {
		return {
			dataName: '',
			stats: [],
			aggregate: {},
			hasAccess: false,
			accessGranted: false,
			showAppleSignIn: false,
			loading: null,
		};
	},

	computed: {

		group(): Group | object {
			return this.activeGroup ?? {};
		},

		groupName() {
			// @ts-ignore
			return this.activeGroup?.group_name ?? 'Loading...';
		},

		calories() {
			let calories = 0;
			this.stats.forEach((data: any) => {
				calories += data.value;
			});

			return calories;
		},

		thisWeek(): UserAggregateStat | object {
			const thisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
			const key = format(thisWeek, AGGREGATE_KEY_FORMAT);

			return this.aggregate[key] ?? {};
		},

		lastWeek(): UserAggregateStat | object {
			const lastWeek = startOfWeek(sub(new Date(), { days: 7 }), { weekStartsOn: 1 });
			const key = format(lastWeek, AGGREGATE_KEY_FORMAT);

			return this.aggregate[key] ?? {};
		},

		totalGoals(): GoalTotals {
			const totals = { met: 0, missed: 0 };
			Object.values(this.aggregate).forEach(stat => {
				totals.met += stat.goalsMet;
				totals.missed += stat.goalsMissed;
			});

			return totals;
		}

	},

	mounted() {
		this.getActivity(true);

		console.log('iso?', parseISO(new Date().toISOString()).toISOString());
	},

	methods: {

		async loadAggregate(force = false) {
			if (this.loading === true && !force) return;

			this.loading = true;
			try {
				const { data } = await axios.get(`/user/stats/${this.activeGroupId}`);
				this.aggregate = data.aggregate;
			} catch (e) {
			}

			this.loading = false;
		},

		async getActivity(initial = false) {
			if (this.loading) return;

			this.loading = true;
			const device = await Device.getInfo();
			let stats: any;
			if (device.platform == 'ios') {
				try {
					const queryResult = await queryActivitySummary(
						// @ts-ignore
						this.activeGroup?.start_date,
						min([
							// @ts-ignore
							parseISO(this.activeGroup?.end_date), new Date()
						]).toISOString()
					);

					stats = queryResult.resultData;
				} catch (e) {
					console.log('GET ACTIVITY ERROR', e.message);
				}
			} else {
				const { resultData } = getSampleDataResponse();
				stats = resultData;
				if (!initial) {
					this.showToast();
				}
			}

			if (stats) {
				this.stats = stats;

				await axios.post('/users/stats', { stats: this.stats });
				await this.loadAggregate(true);
			} else {
				console.log('cannot request data');
			}
		},

		async showToast(msg = 'Stats reloaded') {
			const toast = await toastController
				.create({
					message: msg,
					duration: 2000
				})
			return toast.present();
		},

	},

	components: {
		// IonCard,
		// IonCardContent,
		IonIcon,
		IonButton,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonPage,
		IonSpinner
	},
});

</script>
