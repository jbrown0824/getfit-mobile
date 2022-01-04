<template>
	<ion-page>
		<ion-tabs>
			<ion-tab-bar slot="bottom">
				<ion-tab-button href="/group/weekly" tab="weekly">
					<ion-icon :icon="calendarOutline"/>
					<ion-label>Weekly</ion-label>
				</ion-tab-button>

				<ion-tab-button href="/group/overall" tab="overall">
					<ion-icon :icon="peopleOutline"/>
					<ion-label>Leaders</ion-label>
				</ion-tab-button>

				<ion-tab-button href="/group/info" tab="info">
					<ion-icon :icon="informationCircleOutline"/>
					<ion-label>Info</ion-label>
				</ion-tab-button>

				<ion-tab-button href="/groups/mine" tab="mine">
					<ion-icon :icon="gridOutline"/>
					<ion-label>Groups</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-page>
</template>

<script lang="ts">
import {
	IonIcon,
	IonLabel,
	IonPage,
	IonTabBar,
	IonTabButton,
	IonTabs,
} from '@ionic/vue';
import { calendarOutline, informationCircleOutline, peopleOutline, gridOutline } from 'ionicons/icons';

export default {
	name: 'Tabs',
	components: {
		IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage,
	},
	setup() {
		return {
			calendarOutline,
			informationCircleOutline,
			peopleOutline,
			gridOutline
		};
	},
};
</script>
