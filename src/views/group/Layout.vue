<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="weekly" href="/group/weekly">
          <ion-icon :icon="calendarOutline" />
          <ion-label>Weekly</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="overall" href="/group/overall">
          <ion-icon :icon="peopleOutline" />
          <ion-label>Leaders</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="info" href="/group/info">
          <ion-icon :icon="informationCircleOutline" />
          <ion-label>Info</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage } from '@ionic/vue';
import { calendarOutline, peopleOutline, informationCircleOutline } from 'ionicons/icons';

export default {
  name: 'Tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
  setup() {
    return {
      calendarOutline,
      informationCircleOutline,
      peopleOutline,
    }
  }
}
</script>
