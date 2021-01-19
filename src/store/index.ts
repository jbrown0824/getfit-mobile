import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import user from './user';
import { State } from '@/types';

export const key: InjectionKey<Store<State>> = Symbol()

/** NOT CURRENTLY IN USE **/

export const store = createStore<State>({
	modules: {
		user,
	}
})
export default store;
