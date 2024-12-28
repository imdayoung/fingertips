<script setup>

</script>

<template>
  <div class="relative w-full">
    <img src="@/assets/guestChallenge.png" class="w-full" />
    <div class="absolute top-72 left-0 w-full h-full flex flex-col items-center">
      <div class="text-4xl font-bold mb-4 text-customNavy font-jamsil">로그인 후 사용할 수 있습니다.</div>
      <div class="text-lg underline font-pretendard-regular"><router-link to="/login">로그인하고 챌린지 실천하기</router-link></div>
    </div>
  </div>
</template>

<style scoped>

</style>
