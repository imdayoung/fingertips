<script setup>

</script>

<template>
  <div class="footer flex flex-col justify-center items-center mt-16 min-h-72 text-gray-500 text-sm font-pretendard-regular">
    <div class="flex space-x-3 mb-5">
      <img src="/src/assets/notion.png" />
      <img src="/src/assets/slack.png" />
      <img src="/src/assets/github.png" />
    </div>
    
    <div>KB IT's Your Life 5기 깨비핑</div>
    
    <div class="flex items-center space-x-1">
      <font-awesome-icon :icon="['fas', 'phone']" class="text-gray-500 text-xs" />
      <div>02-2205-0108</div>
    </div>
    <div>서울특별시 광진구 능동로 195-16, 5층</div>
    

    <div class="flex space-x-3 mt-5">
      <div>이용 약관</div>
      <div>|</div>
      <div>개인 정보 처리 방침</div>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 1.6rem;
  height: 1.6rem;
}
.footer {
  background-color: #F5F6F7;
}
</style>
