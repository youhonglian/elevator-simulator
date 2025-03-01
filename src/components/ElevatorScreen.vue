<template>
  <div class="elevator-screen">
    <span :class="[
      'elevator-screen-direction',
      {
        'elevator-screen-direction--active': direction === Direction.UP
      }
    ]">
      ↑
    </span>
    <span :class="[
      'elevator-screen-floor',
      {
        'elevator-screen-floor--active': isDoorOpen
      }
    ]">
      {{ currentFloor }}
    </span>
    <span :class="[
      'elevator-screen-direction',
      {
        'elevator-screen-direction--active': direction === Direction.DOWN
      }
    ]">
      ↓
    </span>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useElevatorStore from '@/stores/elevator';
import { Direction } from '@/types/index';

const store = useElevatorStore();
const {
  direction,
  currentFloor,
  isDoorOpen,
} = storeToRefs(store);

</script>

<style lang="scss" scoped>
.elevator-screen {
  display: inline-flex;
  align-items: center;

  &-floor {
    margin: 0 5px;
  }

  &-direction {
    color: #CCCCCC;
  }

  &-floor--active,
  &-direction--active {
    color: #F27828;
  }
}
</style>
