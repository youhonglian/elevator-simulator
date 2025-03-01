<template>
  <div class="elevator-panel-container">
    <div class="elevator-panel-screen">
      <elevator-screen />
    </div>

    <div class="elevator-panel-control">
      <div v-for="i in totalFloors" :key="i" class="elevator-panel-content">
        <button :disabled="clickedFloors.has(i)" @click="floorClick(i)" :class="[
          'elevator-panel-btn',
          'elevator-panel-floor-btn',
          {
            'elevator-panel-btn--active': clickedFloors.has(i),
          }
        ]">
          {{ i }}
        </button>
      </div>

      <div class="elevator-panel-content">
        <button class="elevator-panel-btn elevator-panel-btn--action" @click="handleClickClose">
          CLOSE
        </button>
      </div>
      <div class="elevator-panel-content">
        <button class="elevator-panel-btn elevator-panel-btn--action" @click="handleClickOpen">
          OPEN
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, onUnmounted } from 'vue';
import { DoorState, RequestSource } from '@/types';
import useElevatorStore from '@/stores/elevator';
import ElevatorScreen from '@/components/ElevatorScreen.vue';
import { callElevator, getElevatorStatus, updateDoorAction } from '@/utils/request';

const store = useElevatorStore();
const {
  totalFloors,
  clickedFloors,
} = storeToRefs(store);

const floorClick = async (floor: number) => {
  await callElevator({ floor, requestType: RequestSource.INTERNAL })
};

const handleClickOpen = async () => {
  await updateDoorAction(DoorState.OPEN)
};

const handleClickClose = async () => {
  await updateDoorAction(DoorState.CLOSE)
};

const timer = ref();

timer.value = setInterval(() => getElevatorStatus(), 1500);

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});

</script>

<style lang="scss" scoped>
.elevator-panel {
  &-container {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    border-radius: 4px;
    border: 1px solid #E4E7ED;
    background-color: #FFFFFF;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-screen {
    font-size: 20px;
    width: 200px;
    margin-bottom: 20px;
    background-color: #D5F0FF;
    text-align: center;
    box-shadow: 0px 0px 3px #79C4F1;
  }

  &-control {
    display: flex;
    flex-wrap: wrap;
    width: 200px;
    overflow: hidden;
  }

  &-content {
    justify-content: center;
    display: flex;
    width: 35px;
    margin-left: 33px;
    margin-right: 30px;
    margin-bottom: 10px;
  }

  &-btn {
    width: 30px;
    line-height: 1;
    height: 32px;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #1890FF;
    border-radius: 6px;
    color: #1890FF;
    background-color: transparent;
    text-align: center;
    box-sizing: border-box;
    transition: all 0.3s;
    outline: 0;

    &:hover {
      background-color: #1890FF;
      color: #FFFFFF;
      border-color: #1890FF;
    }

    &--active {
      border: 1px solid #1890FF;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      color: #FFFFFF;
    }

    &:disabled {
      background-color: #1890FF;
      color: #FFFFFF;
      border-color: rgba(24, 144, 255, 0.4);
      cursor: not-allowed;
    }
  }

  &-btn--action {
    width: 60px;
  }
}
</style>
