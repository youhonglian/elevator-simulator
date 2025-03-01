import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import useElevatorStore from '@/stores/elevator'
import { createTestingPinia } from '@pinia/testing'
import ElevatorShaft from '@/views/elevator/ElevatorShaft.vue'

describe('ElevatorShaft', () => {
  describe('elevator positioning', () => {
    it('calculate the initial position correctly', () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })

      const wrapper = mount(ElevatorShaft, {
        global: { plugins: [pinia] },
      })

      const elevator = wrapper.find('.elevator')
      expect(elevator.attributes('style')).toContain('transform: translateY(540px)')
    })

    it('updates location in response to floor changes', async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const store = useElevatorStore(pinia)
      store.currentFloor = 10

      const wrapper = mount(ElevatorShaft, {
        global: { plugins: [pinia] },
      })

      const elevator = wrapper.find('.elevator')
      expect(elevator.attributes('style')).toContain('transform: translateY(0px)')
    })

    it('apply transition animation correctly', () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const store = useElevatorStore(pinia)
      store.simulationSpeed = 2

      const wrapper = mount(ElevatorShaft, {
        global: { plugins: [pinia] },
      })

      const elevator = wrapper.find('.elevator')
      expect(elevator.attributes('style')).toContain('transition: transform 2s linear')
    })
  })

  describe('elevator door status', () => {
    it('default off status', () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const store = useElevatorStore(pinia)
      const wrapper = mount(ElevatorShaft, {
        global: { plugins: [pinia] },
      })

      const door = wrapper.find('.elevator-door')

      expect(door.classes()).toContain('elevator-door--close')
      expect(door.classes()).not.toContain('elevator-door--opened')
    })

    it('correctly display the on state', async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const store = useElevatorStore(pinia)
      const wrapper = mount(ElevatorShaft, {
        global: { plugins: [pinia] },
      })
      store.handleOpenDoor(200)

      setTimeout(() => {
        const door = wrapper.find('.elevator-door')

        expect(door.classes()).toContain('elevator-door--opened')
        expect(door.classes()).not.toContain('elevator-door--close')
      }, 1000)
    })
  })

  describe('容器尺寸', () => {
    it('正确应用楼层高度', () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
      })
      const store = useElevatorStore(pinia)
      store.floorHeight = 80
      const wrapper = mount(ElevatorShaft, {
        global: { plugins: [pinia] },
      })

      expect(wrapper.vm.elevatorHeightStyle.height).toEqual('80px')
    })
  })
})
