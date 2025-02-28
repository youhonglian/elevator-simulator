<script setup lang="ts">
import FloorPanel from '@/views/floor/FloorPanel.vue';
import ElevatorShaft from '@/views/elevator/ElevatorShaft.vue';
import ElevatorPanel from '@/views/elevator/ElevatorPanel.vue';

</script>

<template>
  <div class="app-container">
    <div class="app-content">
      <floor-panel />
      <elevator-shaft />
      <!-- <template v-for="ele in elevators" :key="ele.id">
        <elevator-shaft :elevator="ele" />
      </template> -->
    </div>
    <elevator-panel />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
}

.app-content {
  display: flex;
  position: relative;
  width: 400px;
  margin-right: 100px;
}
</style>
