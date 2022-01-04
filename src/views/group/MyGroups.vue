<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>My Groups</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-list>
				<ion-item v-for="group in (groups ?? [])" :key="`group-${ group.id }`">
					<ion-label @click="() => selectGroup(group)">
						<h2>{{  group.group_name }}</h2>
						<h3>{{ group.active_calories }} active, {{ group.active_minutes }} mins, {{ group.weekly_goals }}x weekly</h3>
						<h3>{{ isActive(group) ? 'Active' : 'Not Active' }}</h3>
						<p>{{ date(group.start_date) }} to {{ date(group.end_date) }}</p>
					</ion-label>
				</ion-item>
			</ion-list>

			<section>
				<ion-button @click="() => joinGroup()" color="success">Join Group
					<ion-icon slot="end" :icon="addOutline"/>
				</ion-button>
			</section>

		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonTitle, IonLabel, IonItem, IonList, IonButton } from '@ionic/vue';
import { addOutline } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import { Group } from '@/types';
import moment from 'moment';

export default defineComponent({
	name: 'MyGroups',

	inject: ['activeGroup'],

	setup() {
		console.log('in my groups setup');
		const setActiveGroup: ((id: number) => void) | undefined = inject<(id: number) => void>('setActiveGroup');
		const groups: Group[] | undefined  = inject<Group[]>('groups');
		return {
			addOutline,
			setActiveGroup,
			groups,
		};
	},

	mounted() {
		console.log('my groups mounted');
	},

	methods: {

		joinGroup() {
			this.$router.push('/groups/join');
		},

		selectGroup(group: Group) {
			this.setActiveGroup?.(group.id);
			this.$router.push('/group/weekly');
		},

		date(date: string): string {
			return moment(date).format('MMM D, YYYY')
		},

		isActive(group: Group) {
			return moment().isBetween(moment(group.start_date), moment(group.end_date));
		},

	},

	components: { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonTitle, IonLabel, IonItem, IonList, IonButton },
});
</script>
