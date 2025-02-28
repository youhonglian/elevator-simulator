import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Direction } from '@/types'
import useElevatorStore from '@/stores/elevator'
import { createTestingPinia } from '@pinia/testing'
import FloorPanel from '@/views/floor/FloorPanel.vue'

describe('FloorPanel', () => {
  it('render the number of floors', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })

    const store = useElevatorStore(pinia)

    store.currentFloor = 3
    store.totalFloors = 20

    const wrapper = mount(FloorPanel, {
      global: { plugins: [pinia] },
    })

    const floors = wrapper.findAll('.floor-panel-control')
    expect(floors).toHaveLength(20)
    expect(floors[0].find('.floor-panel-label').text()).toBe('F1')
    expect(floors[2].find('.floor-panel-label').text()).toBe('F3')
  })

  describe('button disabled status', () => {
    it('should be disabled the top-level uplink button ', () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const wrapper = mount(FloorPanel, {
        global: { plugins: [pinia] },
      })
      const topFloorButton = wrapper.findAll('.floor-panel-control')[9]
      const upButton = topFloorButton.find('.up-btn')
      expect((upButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('should be disabled the underlying downlink button ', () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const wrapper = mount(FloorPanel, {
        global: { plugins: [pinia] },
      })
      const bottomFloorButton = wrapper.findAll('.floor-panel-control')[0]
      const downButton = bottomFloorButton.find('.down-btn')
      expect((downButton.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('should be available with normal floor buttons ', () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const wrapper = mount(FloorPanel, {
        global: { plugins: [pinia] },
      })
      const middleFloor = wrapper.findAll('.floor-panel-control')[2]
      const upButton = middleFloor.find('.up-btn')
      const downButton = middleFloor.find('.down-btn')
      expect((upButton.element as HTMLButtonElement).disabled).toBe(false)
      expect((downButton.element as HTMLButtonElement).disabled).toBe(false)
    })
  })

  describe('button interaction', () => {
    it('should trigger an external request when clicking a valid button', async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const store = useElevatorStore(pinia)
      const wrapper = mount(FloorPanel, {
        global: { plugins: [pinia] },
      })
      const middleFloor = wrapper.findAll('.floor-panel-control')[2]

      await middleFloor.find('.up-btn').trigger('click')
      expect(store.exteralUpFloors.has(3)).toBe(true)
      expect(store.addExternalRequest).toHaveBeenCalledWith({
        floor: 3,
        direction: Direction.UP,
      })

      await middleFloor.find('.down-btn').trigger('click')
      expect(store.exteralDownFloors.has(3)).toBe(true)
      expect(store.addExternalRequest).toHaveBeenCalledWith({
        floor: 3,
        direction: Direction.DOWN,
      })
    })
  })

  it('should not trigger a request when clicking the disable button', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const store = useElevatorStore(pinia)

    const wrapper = mount(FloorPanel, {
      global: { plugins: [pinia] },
    })
    const topFloorButton = wrapper.findAll('.floor-panel-control')[9]
    const upButton = topFloorButton.find('.up-btn')

    await upButton.trigger('click')
    expect(store.addExternalRequest).not.toHaveBeenCalled()
  })

  it('should be included the elevator screen component', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    })
    const wrapper = mount(FloorPanel, {
      global: { plugins: [pinia] },
    })
    expect(wrapper.findComponent({ name: 'ElevatorScreen' }).exists()).toBe(true)
  })
})
