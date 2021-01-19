import { mount } from '@vue/test-utils'
import Weekly from '@/views/Weekly.vue'

describe('Weekly.vue', () => {
  it('renders tab 1 view', () => {
    const wrapper = mount(Weekly)
    expect(wrapper.text()).toMatch('Tab 1 page')
  })
})
