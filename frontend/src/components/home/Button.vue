<script setup>
const props = defineProps({
  imgSrc: {
    type: String,
    required: true
  },
  routerTo: {
    type: Object,
    required: true
  },
  textAbove: {
    type: String,
    required: true
  },
  textBelow: {
    type: String,
    required: true
  }
});
</script>

<template>
  <RouterLink class="bg-transparent hover:bg-customNavy blue font-bold hover:text-white py-14 border shadow-lg hover:border-transparent rounded whitespace-normal w-52 h-50 flex flex-col items-center justify-center"
              :to=routerTo>
    <div>{{ textAbove }}</div>
    <div>{{ textBelow }}</div>
    <img :src="imgSrc" alt="icon" class="h-8 w-auto mt-4" />
  </RouterLink>
</template>

<style scoped>

</style>
