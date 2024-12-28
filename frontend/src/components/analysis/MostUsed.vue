<script setup>
const props = defineProps({
  mostUsed: {
    type: Object,
    required: true,
  },
  getMedal: {
    type: Function,
    required: true,
  },
  period: {
    type: String
  }
});
</script>

<template>
  <div>
    <div class="mb-2">
      <div>{{ period }} <span class="text-red font-semibold">소비 횟수</span>가</div>
      <div>가장 많은 곳이에요</div>
    </div>
    <span class="mb-3 font-normal text-gray-700">
      <div class="text-lg">
        <div v-for="(value, key, index) in mostUsed" :key="index" class="flex items-center space-x-2">
          <div><img :src="getMedal(index)" alt="medal" /></div>
          <div>{{ key }}<span class="font-bold">&nbsp;{{ value }}</span>회</div>
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.text-red {
  color: #F55151;
}
img {
  width: 1.3rem;
  height: 1.3rem;
}
</style>
