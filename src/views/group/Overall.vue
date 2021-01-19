<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Leaderboard</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">Leaderboard</ion-title>
				</ion-toolbar>
			</ion-header>

			<section v-if="group && group.users && group.users.length">
				<group-user-aggregate-row v-for="user in group.users" :key="`user-${ user.id }`" :user="user"></group-user-aggregate-row>
			</section>

			<section>
				<ion-button @click="refresh" color="primary">Update
					<ion-icon v-if="!loading" slot="end" :icon="refreshOutline"/>
					<ion-spinner v-if="loading"></ion-spinner>
				</ion-button>
			</section>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">

import { alertController, IonContent, IonButton, IonIcon, IonSpinner, IonHeader, IonPage, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import axios from 'axios';
import { refreshOutline } from 'ionicons/icons';
import { Group, GroupDetails } from '@/types';
import { defineComponent, inject } from 'vue';
import GroupUserAggregateRow from './components/GroupUserAggregateRow.vue';

export default defineComponent({
	name: 'Overall',

	setup() {
		const activeGroup: Group | null = inject('activeGroup', null);
		const activeGroupId = inject('activeGroupId');

		return {
			refreshOutline,
			activeGroup,
			activeGroupId,
		};
	},

	data(): {
		loading: boolean;
		group: GroupDetails | null;
	} {
		return {
			loading: true,
			group: null,
		};
	},

	mounted() {
		this.loadGroup();
	},

	methods: {

		async refresh() {
			try {
				await this.loadGroup();
				this.showToast();
			} catch (e) {
				this.presentAlert('Unable to load group leaderboard. Please try again later');
			}
		},

		async loadGroup(retry = 0) {
			if (!this.activeGroup) {
				if (retry < 3) {
					setTimeout(() => this.loadGroup(retry + 1), 500);
				} else {
					this.presentAlert('Unable to load group leaderboard. Please try again later');
				}
				return;
			}

			this.loading = true;

			try {
				console.log('activeGroup', this.activeGroup);
				const { data } = await axios.get(`/groups/${this.activeGroupId ?? 'unknown'}`);
				this.group = data;
				console.log('group users', this.group?.users);
			} catch (e) {
				console.log(e);
				this.presentAlert('Unable to load group data: ' + e.message);
			}

			this.loading = false;
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

		async showToast(msg = 'Leaderboard reloaded') {
			const toast = await toastController
				.create({
					message: msg,
					duration: 2000
				})
			return toast.present();
		},

	},

	components: {
		IonHeader, IonToolbar, IonTitle, IonContent, IonPage, GroupUserAggregateRow, IonButton, IonIcon, IonSpinner,
	},
});

</script>
