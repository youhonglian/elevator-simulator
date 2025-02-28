<template>
  <div class="floor-panel-container">
    <div v-for="n in totalFloors" :key="n" class="floor-panel-control" :style="{ height: `${floorHeight}px` }">
      <div class="floor-panel-label">
        F{{ n }}
      </div>
      <div class="floor-panel-content">
        <div class="floor-panel-operator">
          <button :class="{
            'floor-panel-operator-btn--active': exteralUpFloors.has(n)
          }" class="floor-panel-operator-btn up-btn" :disabled="isBtnDisabled(n, Direction.UP)"
            @click="handleExternalRequest(n, Direction.UP)">
            ▲
          </button>
          <button :class="[
            'floor-panel-operator-btn down-btn',
            {
              'floor-panel-operator-btn--active': exteralDownFloors.has(n)
            }]" :disabled="isBtnDisabled(n, Direction.DOWN)" @click="handleExternalRequest(n, Direction.DOWN)">
            ▼
          </button>
        </div>

        <div class="floor-panel-screen">
          <elevator-screen />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Direction } from '@/types/index';
import useElevatorStore from '@/stores/elevator';
import type { RequestDirection } from '@/types/index';
import ElevatorScreen from '@/components/ElevatorScreen.vue';

const store = useElevatorStore();
const { totalFloors, floorHeight, exteralUpFloors, exteralDownFloors } = storeToRefs(store);

const isBtnDisabled = (floor: number, direction: RequestDirection) => {
  if (floor === 1 && direction === Direction.DOWN) {
    return true;
  }

  if (floor === totalFloors.value && direction === Direction.UP) {
    return true;
  }

  return false;
};

const handleExternalRequest = (floor: number, direction: RequestDirection) => {
  if (isBtnDisabled(floor, direction)) {
    return;
  }

  if (direction === Direction.UP) {
    exteralUpFloors.value.add(floor);
  }

  if (direction === Direction.DOWN) {
    exteralDownFloors.value.add(floor);
  }

  store.addExternalRequest({
    floor: floor,
    direction: direction,
  });
};

</script>

<style lang="scss" scoped>
.floor-panel {
  &-container {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    border-radius: 4px;
    border: 1px solid #E4E7ED;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
  }

  &-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 120px 10px 20px;

    &:not(:first-child) {
      border-bottom: 1px solid #E4E7ED;
    }
  }

  &-label {
    margin-right: 10px;
    font-size: 12px;
  }

  &-content {
    display: flex;
    align-items: center;
  }

  &-operator {
    margin-right: 10px;

    &-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      color: #2196F3;

      &--active {
        border-color: #F27828;
        color: #F27828;
      }

      &:disabled {
        color: rgba(0, 0, 0, 0.25);
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        text-shadow: none;
        box-shadow: none;
      }

      &+& {
        margin-left: 10px;
      }
    }
  }

  &-screen {
    padding: 0 5px;
    background-color: #D5F0FF;
    text-align: center;
    box-shadow: 0px 0px 3px #79C4F1;
  }
}
</style>
