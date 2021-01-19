import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module '@vue/runtime-core' {
  // declare your own store states
  import { State } from '@/types';

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
