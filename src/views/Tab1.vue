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

      <div id="container">
        <section>
          <header>Today's Calories: {{ calories }}</header>
        </section>
        <section>
          <ion-button @click="queryHKitSampleType('activeEnergyBurned')" color="success">Refresh <ion-icon slot="end" :icon="refreshOutline" /></ion-button>
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
import { IonPage, IonHeader, IonButton, IonIcon, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { refreshOutline } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
const { CapacitorHealthkit } = Plugins;

export default defineComponent({
  name: 'Tab1',

  setup() {
    return {
      refreshOutline,
    };
  },

  data() {
    return {
      dataName: '',
      data: {
        resultData: [],
      },
      hasAccess: false,
      accessGranted: false,
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
  },

  methods: {

    async requestAccess() {
      if (this.accessGranted) return;
      const result = await CapacitorHealthkit.requestAuthorization({
        all: [''],
        read: ['steps','stairs','distance','duration','calories','activity'], // ask for Read Only permission
        write: [''],
      }, () => {
        this.hasAccess = true;
      }, () => {
        this.hasAccess = false;
      });

      console.log('request access result', result);
      this.accessGranted = true;
    },

    async queryHKitSampleType(sampleName: string) {
      this.requestAccess();
      // sample name, start date (string), end Date (date), limit (0 to infinite)
      // let start = "2019/07/01" // YY/MM/DD
      this.dataName = sampleName;
      const startDate = new Date();
      startDate.setHours(0,0,0,0);

      const endDate = new Date();
      this.data = await CapacitorHealthkit.queryHKitSampleType({
        sampleName,
        startDate,
        endDate,
        limit: 0
      });

    },

  },

  components: {
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
