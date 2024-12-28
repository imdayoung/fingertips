<script setup>
const props = defineProps({
  maximumUsed: {
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
    <div class="text-md mb-2">
      <div>{{ period }} <span class="text-customBlue font-semibold">가장 많은 지출</span>은</div>
      <div>바로 이 곳에서 사용했어요</div>
    </div>
    <span class="mb-3 font-normal text-gray-700">
      <div class="text-lg">
        <div v-for="(value, key, index) in maximumUsed" :key="index" class="flex items-center space-x-2">
          <div><img :src="getMedal(index)" alt="medal" /></div>
          <div>{{ key }}<span class="font-bold">&nbsp;{{ value.toLocaleString() }}</span>원</div>
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>

img {
  width: 1.3rem;
  height: 1.3rem;
}
</style>
