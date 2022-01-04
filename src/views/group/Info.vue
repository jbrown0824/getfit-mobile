<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Group Info</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<pre>{{ activeGroup?.value }}</pre>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

export default {
	name: 'Group Info',

	inject: ['activeGroup'],

	components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
};
</script>
