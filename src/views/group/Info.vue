<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Group Info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Group Info?</ion-title>
        </ion-toolbar>
      </ion-header>

        <pre>{{ activeGroup?.value }}</pre>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

export default {
  name: 'Group Info',

  inject: ['activeGroup'],

  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
}
</script>
