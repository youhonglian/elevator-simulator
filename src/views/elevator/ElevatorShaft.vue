<template>
  <div class="elevator-container">
    <div class="elevator" :style="elevatorStyle">
      <div :class="[
        'elevator-door',
        {
          'elevator-door--opened': isDoorOpen,
          'elevator-door--close': !isDoorOpen,
        }]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import useElevatorStore from '@/stores/elevator';

const store = useElevatorStore();
const {
  totalFloors,
  floorHeight,
  simulationSpeed,
  currentFloor,
  isDoorOpen,
} = storeToRefs(store);

const getElevatorStyle = (currentFloor: number) => ({
  transform: `translateY(${(totalFloors.value - currentFloor) * floorHeight.value}px)`,
  transition: `transform ${simulationSpeed.value}s linear`
});

const elevatorStyle = ref({});

watch(() => currentFloor.value, (v) => {
  elevatorStyle.value = getElevatorStyle(v);
}, {
  immediate: true,
});

const elevatorHeightStyle = computed(() => ({
  height: `${floorHeight.value}px`
}));
</script>

<style lang="scss" scoped>
@keyframes slideInLeft {
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideOutLeft {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}

.elevator-container {
  background: rgb(229, 226, 226);
  width: 100px;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  right: 0;
  border-radius: 0 4px 4px 0;

  .elevator {
    width: 40px;
    height: v-bind('elevatorHeightStyle.height');
    background: white;
    border: 3px solid #333;
    border-top-width: 10px;
    overflow: hidden;

    &-door {
      width: 100%;
      height: 100%;
      position: relative;
      background: silver;
      transition: all 1s;

      &--opened {
        background: white;
        animation: slideOutLeft 1s forwards;
      }

      &--close {
        background: silver;
        animation: slideInLeft 1s forwards;
      }
    }
  }
}
</style>
