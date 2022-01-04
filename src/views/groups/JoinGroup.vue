<template>
	<ion-page>
		<ion-content color="primary" padding>
			<form @submit.prevent="join">
				<ion-grid>
					<ion-row color="primary" justify-content-center>
						<ion-col align-self-center size-md="6" size-lg="5" size-xs="12">
							<div text-center>
								<h3>Join Group</h3>
							</div>
							<div padding>
								<ion-item>
									<ion-input name="invite_code" placeholder="Invite Code" v-model="form.invite_code" required></ion-input>
								</ion-item>
							</div>
							<div padding>
								<ion-button size="large" type="submit" expand="block" :disabled="loading" color="light">Join Group</ion-button>
								<a class="ion-color ion-color-dark" v-if="groups?.length > 0" href="/groups">Cancel</a>
							</div>
						</ion-col>
					</ion-row>
				</ion-grid>
			</form>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">

import { defineComponent, inject } from 'vue';
import { IonButton, IonGrid, IonRow, IonCol, IonItem, IonInput, IonContent, IonPage, alertController } from '@ionic/vue';

import axios from 'axios';
import { getErrorMessage } from '@/utils/apiErrors';
import { useRouter } from 'vue-router';
import { Group } from '@/types';

export default defineComponent({

	name: 'JoinGroup',

	inject: ['setActiveGroup', 'setUserGroups'],

	setup() {
		const router = useRouter();
		const groups: Group[] | undefined = inject<Group[]>('groups');
		return { router, groups };
	},

	data(): {
		form: {
			invite_code: string;
		};
		loading: boolean;
		setActiveGroup?: (id: number) => void;
		setUserGroups?: (data: Group[]) => void;
	} {
		return {
			form: {
				invite_code: '',
			},
			loading: false,
		};
	},

	methods: {

		async join() {
			if (this.loading) return;

			this.loading = true;

			try {
				const { data } = await axios.post('/groups', this.form);
				await this.setUserGroups?.([
					data,
					...(this.groups ?? []),
				]);
				this.setActiveGroup?.(data.id);
				this.$nextTick(() => {
					this.$router.push('/group/weekly');
				});
			} catch(e) {
				this.presentAlert('Unable to join group: ' + getErrorMessage(e));
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

	},

	components: {
		IonGrid,
		IonRow,
		IonCol,
		IonItem,
		IonInput,
		IonButton,
		IonContent,
		IonPage,
	},

});

</script>
