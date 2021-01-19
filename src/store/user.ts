import { AuthUser, Group, User, UserStore } from '@/types';
import StorageHelper from '@/storage/Storage';
import { ActionContext } from 'vuex';

const user = {
	state: (): UserStore => ({
		authUser: null,
		user: null,
		groups: []
	}),
	getters: {

		isLoggedIn(state: UserStore) {
			return !!(state.authUser && state.authUser.identityToken);
		},
	},

	mutations: {

		SET_AUTH_USER(state: UserStore, authUser: AuthUser) {
			state.authUser = authUser;
		},

		SET_USER(state: UserStore, user: User) {
			state.user = user;
		},

		SET_USER_GROUPS(state: UserStore, groups: Group[]) {
			state.groups = groups;
		},
	},

	actions: {

		async loadFromStorage({ dispatch }:ActionContext<UserStore, any>) {
			const [ authUser, user, groups ] = await Promise.all([
				StorageHelper.get('authUser'),
				StorageHelper.get('user'),
				StorageHelper.get('groups'),
			]);

			const dispatches: Promise<any>[] = [];

			if (authUser) {
				dispatches.push(dispatch('setAuthUser', authUser));
			}

			if (user) {
				dispatches.push(dispatch('setUser', user));
			}

			if (groups) {
				dispatches.push(dispatch('setUserGroups', groups));
			}

			await Promise.all(dispatches);
		},

		async setAuthUser({ commit }: ActionContext<UserStore, any>, authUser: AuthUser) {
			const user = await StorageHelper.get('authUser');
			if (!user || !user.email || user.user !== authUser.user) {
				StorageHelper.set('authUser', authUser);
			}

			commit('SET_AUTH_USER', authUser);
		},

		async setUser({ commit }: ActionContext<UserStore, any>, user: User) {
			StorageHelper.set('user', user);

			commit('SET_USER', user);
		},

		async setUserGroups({ commit }: ActionContext<UserStore, any>, groups: Group[]) {
			StorageHelper.set('groups', groups);

			commit('SET_USER_GROUPS', groups);
		},

	},
}

export default user;
