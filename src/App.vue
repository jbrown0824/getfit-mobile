<template>
	<ion-app>
		<ion-router-outlet v-if="!loading" />
	</ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, loadingController } from '@ionic/vue';
import { computed, defineComponent } from 'vue';
import { AppState, Plugins } from '@capacitor/core';
import { AuthUser, Group, User, UserStore } from '@/types';
import StorageHelper from '@/storage/Storage';
import debounce from 'lodash-es/debounce';
import axios from 'axios';
import find from 'lodash-es/find';

const { App, Device } = Plugins;

async function load() {
	return await Promise.all([
		StorageHelper.get('authUser'),
		StorageHelper.get('user'),
		StorageHelper.get('groups'),
		StorageHelper.get('activeGroupId'),
	]);
}

const loader = debounce(load, 5000, { leading: true });

export default defineComponent({

	name: 'App',

	data(): UserStore & {
		loading: boolean;
	} {
		return {
			authUser: null,
			user: null,
			groups: [],
			activeGroupId: null,
			platform: null,
			lastCheckedAt: null,
			loading: true,
		};
	},

	provide() {
		return {
			activeGroupId: computed(() => this.activeGroupId),
			activeGroup: computed(() => {
				const g = find(this.groups, ({ id }) => id === this.activeGroupId);
				console.log('coputed g?', g, this.activeGroupId);
				return g;
			}),
			authUser: computed(() => this.authUser),
			user: computed(() => this.user),
			groups: computed(() => this.groups),
			loadFromStorage: this.loadFromStorage,
			setAuthUser: this.setAuthUser,
			setUser: this.setUser,
			setUserGroups: this.setUserGroups,
			setActiveGroup: this.setActiveGroup,
		};
	},

	mounted() {
		this.init();

		App.addListener('appStateChange', (state: AppState) => {
			// state.isActive contains the active state
			console.log('App state changed. Is active?', state.isActive);
			if (state.isActive && this.$route.name !== 'login') {
				console.log('returned to app will check storage');
				this.loadFromStorage();
			}
		});

		axios.interceptors.request.use(async (config) => {
			config.baseURL = this.platform === 'ios' ? 'http://getfit.heatherandjeffbrown.com' : 'http://getfit-slack-bot.fox';
			if (this.authUser) {
				config.headers[ 'x-user' ] = this.authUser.user;
			}

			return config;
		});

	},

	methods: {

		async init() {
			const loading = await loadingController
				.create({
					cssClass: 'my-custom-class',
					message: 'Please wait...',
				});

			await loading.present();

			await Promise.all([
				this.loadFromStorage(),
				this.loadPlatform(),
			]);
			console.log('befoureMount Completed');
			this.loading = false;
			loading.dismiss();
		},

		async loadPlatform() {
			const device = await Device.getInfo();
			console.log('platform set to', device.platform);
			this.platform = device.platform;
		},

		setActiveGroup(activeGroupId: number) {
			StorageHelper.set('activeGroupId', activeGroupId);
			this.activeGroupId = activeGroupId;
		},

		async loadFromStorage() {
			console.log('loading from storage');
			// @ts-ignore
			const [authUser, user, groups, activeGroupId]: [AuthUser | null, User | null, Group[] | null, null | number] = await loader();

			this.activeGroupId = activeGroupId;

			console.log('activeGroupId', activeGroupId);

			const dispatches: Promise<any>[] = [];

			if (authUser) {
				dispatches.push(this.setAuthUser(authUser));
			}

			if (user) {
				dispatches.push(this.setUser(user));
			}

			if (groups) {
				dispatches.push(this.setUserGroups(groups));
			}

			await Promise.all(dispatches);
		},

		async setAuthUser(authUser: AuthUser) {
			const user = await StorageHelper.get('authUser');
			if (!user || !user.email || user.user !== authUser.user) {
				StorageHelper.set('authUser', authUser);
			}

			this.authUser = authUser;
		},

		async setUser(user: User) {
			StorageHelper.set('user', user);

			this.user = user;
		},

		async setUserGroups(groups: Group[]) {
			console.log('setting user groups', groups);
			StorageHelper.set('groups', groups);

			this.groups = groups;
		},

	},

	components: {
		IonApp,
		IonRouterOutlet,
	},
});
</script>
