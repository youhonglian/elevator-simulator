import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import useElevatorStore from '@/stores/elevator'
import ElevatorScreen from '@/components/ElevatorScreen.vue'
import ElevatorPanel from '@/views/elevator/ElevatorPanel.vue'

describe('ElevatorPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders correct number of floor buttons', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.totalFloors = 3

    const wrapper = mount(ElevatorPanel, {
      global: { plugins: [pinia] },
    })

    const buttons = wrapper.findAll('.elevator-panel-floor-btn')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].text()).toBe('1')
    expect(buttons[2].text()).toBe('3')
  })

  it('disables buttons for clicked floors', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })

    const wrapper = mount(ElevatorPanel, {
      global: { plugins: [pinia] },
    })
    await wrapper.find('.elevator-panel-btn').trigger('click')

    const clickedButton = wrapper.find('.elevator-panel-btn--active')

    setTimeout(() => {
      expect(clickedButton.exists()).toBe(true)
      expect(clickedButton.attributes('disabled')).toBeDefined()
    })
  })

  it('adds floor to target queue when clicked', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)

    const wrapper = mount(ElevatorPanel, {
      global: { plugins: [pinia] },
    })

    const firstBtn = wrapper.findAll('.elevator-panel-btn')[0]

    await firstBtn.trigger('click')

    setTimeout(() => {
      expect(store.targetFloors).toContain(1)
    })
  })

  it('opens door when clicking current floor while stationary', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.currentFloor = 3

    const wrapper = mount(ElevatorPanel, {
      global: { plugins: [pinia] },
    })

    const thirdFloorButton = wrapper.findAll('.elevator-panel-btn')[2]
    await thirdFloorButton.trigger('click')

    expect(store.handleOpenDoor).toHaveBeenCalledWith(3000)
    expect(store.targetFloors).not.toContain(3)
  })

  it('prevents duplicate floor requests', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.currentFloor = 3

    const wrapper = mount(ElevatorPanel, {
      global: { plugins: [pinia] },
    })

    const button = wrapper.find('.elevator-panel-btn')
    await button.trigger('click')
    await button.trigger('click')

    expect(store.targetFloors).toEqual([1])
  })

  it('clears current floor from clicked set after delay', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.currentFloor = 2

    const wrapper = mount(ElevatorPanel, {
      global: { plugins: [pinia] },
    })

    store.currentFloor = 2
    store.targetFloors = [2]

    vi.advanceTimersByTime(2200)

    expect(store.updateElevatorStatus).toHaveBeenCalled()
    expect(wrapper.vm.clickedFloors.has(2)).toBe(false)
  })

  it('cleans up interval timer on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.currentFloor = 2

    const wrapper = mount(ElevatorPanel, {
      global: { plugins: [pinia] },
    })
    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('renders elevator screen component', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)
    store.currentFloor = 2

    const wrapper = mount(ElevatorPanel, {
      global: { plugins: [pinia] },
    })
    expect(wrapper.findComponent(ElevatorScreen).exists()).toBe(true)
  })
})
