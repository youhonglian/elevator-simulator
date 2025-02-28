import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ElevatorScreen from '@/components/ElevatorScreen.vue'
import useElevatorStore from '@/stores/elevator'
import { Direction } from '@/types'

describe('ElevatorScreen', () => {
  it('displays the current floor number', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.currentFloor = 3

    const wrapper = mount(ElevatorScreen, {
      global: { plugins: [pinia] },
    })

    expect(wrapper.find('.elevator-screen-floor').text()).toBe('3')
  })

  it('highlights up arrow when direction is UP', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.direction = Direction.UP

    const wrapper = mount(ElevatorScreen, {
      global: { plugins: [pinia] },
    })

    const directions = wrapper.findAll('.elevator-screen-direction')
    expect(directions[0].classes()).toContain('elevator-screen-direction--active')
    expect(directions[1].classes()).not.toContain('elevator-screen-direction--active')
    expect(wrapper.find('.elevator-screen-floor').classes()).not.toContain(
      'elevator-screen-floor--active',
    )
  })

  it('highlights down arrow when direction is DOWN', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.direction = Direction.DOWN

    const wrapper = mount(ElevatorScreen, {
      global: { plugins: [pinia] },
    })

    const directions = wrapper.findAll('.elevator-screen-direction')
    expect(directions[0].classes()).not.toContain('elevator-screen-direction--active')
    expect(directions[1].classes()).toContain('elevator-screen-direction--active')
    expect(wrapper.find('.elevator-screen-floor').classes()).not.toContain(
      'elevator-screen-floor--active',
    )
  })

  it('highlights floor number when direction is STOP', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.direction = Direction.STOP

    const wrapper = mount(ElevatorScreen, {
      global: { plugins: [pinia] },
    })

    const directions = wrapper.findAll('.elevator-screen-direction')
    directions.forEach((direction) => {
      expect(direction.classes()).not.toContain('elevator-screen-direction--active')
    })
    expect(wrapper.find('.elevator-screen-floor').classes()).toContain(
      'elevator-screen-floor--active',
    )
  })
})
