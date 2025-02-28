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
        <button class="elevator-panel-btn elevator-panel-btn--action" @click="store.handleCloseDoor">
          CLOSE
        </button>
      </div>
      <div class="elevator-panel-content">
        <button class="elevator-panel-btn elevator-panel-btn--action" @click="store.handleOpenDoor(3000)">
          OPEN
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, onUnmounted } from 'vue';
import useElevatorStore from '@/stores/elevator';
import ElevatorScreen from '@/components/ElevatorScreen.vue';

const store = useElevatorStore();
const {
  totalFloors,
  currentFloor,
  isMoving,
  targetFloors,
} = storeToRefs(store);

const clickedFloors = ref<Set<number>>(new Set());

const floorClick = (index: number) => {
  if (index == currentFloor.value && isMoving.value == false) {
    store.handleOpenDoor(3000);
    return;
  }
  if (clickedFloors.value.has(index)) {
    return;
  }
  clickedFloors.value.add(index);
  targetFloors.value.push(index);
};

const timer = ref();

timer.value = setInterval(
  () => store.updateElevatorStatus(
    () => clickedFloors.value.delete(currentFloor.value)
  ), 2200);

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
