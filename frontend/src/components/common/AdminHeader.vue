<script setup>
import fingertipsIcon from '@/assets/fingertips.png';
</script>

<template>
  <header class="bg-white shadow p-4 flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <img :src="fingertipsIcon" alt="Fingertips Icon" class="w-16 h-16">
      <span class="text-xl font-semibold text-gray-700">Fingertips</span>
    </div>
  </header>
</template>


<style scoped>
input::placeholder {
  color: #9CA3AF;
}
</style>
