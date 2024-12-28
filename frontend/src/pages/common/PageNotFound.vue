<script setup>

</script>

<template>
  <div class="mx-[20%] lg:mx-[32%] py-12 flex flex-col justify-center items-center">
    <img src="@/assets/notfound.png" class="w-60" />
    <div class="text-lg font-bold">찾을 수 없는 페이지입니다</div>
    <div class="text-lg font-bold">요청하신 페이지가 사라졌거나 잘못된 경로를 이용하셨어요 :(</div>
    <router-link to="/" class="mt-8 rounded-lg bg-customNavy text-white text-lg py-3 px-6">홈으로 이동</router-link>
  </div>
</template>

<style scoped>

</style>
