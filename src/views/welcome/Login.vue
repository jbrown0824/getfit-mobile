<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Welcome To GetFit</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content class="ion-padding">

			<ion-card v-if="showAppleSignIn">
				<ion-card-content>
					<ion-button expand="full" @click="login()">
						<ion-icon name="logo-apple" slot="start"></ion-icon>
						Sign in with Apple
					</ion-button>
				</ion-card-content>
			</ion-card>

			<ion-card v-if="!showAppleSignIn">
				<ion-card-content>
					<h3>Fake Login...</h3>
				</ion-card-content>
			</ion-card>

		</ion-content>
	</ion-page>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { alertController, IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

import { Plugins } from '@capacitor/core';
import { ResponseSignInWithApplePlugin } from '@capacitor-community/apple-sign-in';
import { AuthUser, Group, User } from '@/types';
import { ComputedRef } from '@vue/reactivity';
import axios from 'axios';
import { useRouter } from 'vue-router';

const { Device, SignInWithApple } = Plugins;

export default defineComponent({

	name: 'Login',

	inject: ['authUser', 'setActiveGroup', 'activeGroupId', 'activeGroup', 'setAuthUser', 'setUser', 'setUserGroups', 'loadFromStorage'],

	setup() {
		const router = useRouter();
		return { router };
	},

	data(): {
		showAppleSignIn: boolean;
		authUser?: ComputedRef<AuthUser>;
		activeGroup?: ComputedRef<Group>;
		setAuthUser?: (authUser: AuthUser) => Promise<void>;
		setUser?: (user: User) => Promise<void>;
		setUserGroups?: (groups: Group[]) => Promise<void>;
		setActiveGroup?: (id: number) => void;
		loadFromStorage?: () => Promise<void>;
	} {
		return {
			showAppleSignIn: false,
		};
	},

	mounted() {
		this.checkAuth();
	},

	methods: {

		async checkAuth() {
			console.log('will check auth');
			const device = await Device.getInfo();

			// @ts-ignore
			if (this.authUser?.value && this.activeGroupId) {
				// Authed
				console.log('already has user');
				this.router.push('/group/weekly');
			} else if (device.platform === 'ios') {
				this.showAppleSignIn = true;
				console.log('show Apple Sign In');
			} else {
				// Web Platform - Will use fake user
				this.login();
			}
		},

		async login() {
			console.log('calling login');

			try {
				console.log('attempting auth');
				const res: ResponseSignInWithApplePlugin = await this.getAuthorizedUser();
				console.log('authorized??', res);
				this.handleUserSignIn(res);

			} catch (e) {
				console.log('Apple Sign In Failed', e);
				this.presentAlert('Unable to Sign In: ' + e.message);
			}
		},

		async getAuthorizedUser(): Promise<ResponseSignInWithApplePlugin> {
			if (this.showAppleSignIn) {
				console.log('AUthorizing with Apple');
				return await SignInWithApple.Authorize();
			} else {
				return {
					'response': {
						'familyName': 'Brown',
						'user': '001355.d76b4c4eaedf41d68ed1e09606f80968.0715',
						'givenName': 'Jeff',
						'identityToken': 'eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiaW8ucHJvamVrdGZveC5nZXRmaXQiLCJleHAiOjE2MTAzMzUyNTksImlhdCI6MTYxMDI0ODg1OSwic3ViIjoiMDAxMzU1LmQ3NmI0YzRlYWVkZjQxZDY4ZWQxZTA5NjA2ZjgwOTY4LjA3MTUiLCJjX2hhc2giOiJmVUdXTk5Cay1OUVQ4ZzVPaURCZjlBIiwiZW1haWwiOiI2Y3Y1amkzaG5jQHByaXZhdGVyZWxheS5hcHBsZWlkLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImlzX3ByaXZhdGVfZW1haWwiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNjEwMjQ4ODU5LCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.QpkSueAG6k7g6OWwBE-DJEkapjU8D1LGL2JzYKGShS73827MdsTayfvFn_hu-N1sBmU2Oa-W4-v0ctUQdXyAYYRQCT316obQuwypL_SZGU_5lgKFzB5ELUTSJH9ThR3BXzcPM5ieUwfgMsASRR1npWs7Vuw0NFqMwaMzEn3t9421uaVii04mYZr3SrIw6-bVZYojwZMxx5fcYlw9F1dExo-YEFAqVzTo-ri4uefB8P8F40YS_8dx8uV90ILZwFhWuXIZx2IVpkIl6k3YAP0aIwUK06UaXGaELHmLYkAZWNn6xyezhMGqEqVLRUsFX3pHYQo3GTqOtsvCvcib4bAVQQ',
						'authorizationCode': 'cb71694b5ce184e3597de95b541d366b8.0.rrtvv.ObfpE-7xpMUAJbdVs5xBKw',
						'email': 'jeffreymichaelbrown@gmail.com',
					},
				};
			}
		},

		async handleUserSignIn(res: ResponseSignInWithApplePlugin) {
			console.log("handle User Sign In");
			if (res.response && res.response.identityToken) {
				console.log('setting auth user?');
				this.setAuthUser?.(res.response);

				// Look Up Groups
				console.log('looking up user');
				try {
					const { data } = await axios.post('/users', res.response);
					console.log('got user', data);

					this.setUser?.(data.user);
					this.setUserGroups?.(data.groups);

					// If no Groups, Go to /group/join
					if (!data.groups.length) {
						this.router.push('/groups/join');
					} else {
						this.setActiveGroup?.(data.groups[ 0 ].id);
						this.router.push('/group/weekly');
					}
				} catch (e) {
					console.log('BAD', e.message);
					console.log(e);
				}

				// If group, go to group
			} else {
				console.log('Unable to Process Sign In', res, 'response: ', res.response);
				this.presentAlert('Unable to Process Sign In');
			}
		},

		async presentAlert(message: string) {
			const alert = await alertController
				.create({
					cssClass: 'my-custom-class',
					header: 'Alert',
					message,
					buttons: ['OK'],
				});
			return alert.present();
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
	},

});

</script>
