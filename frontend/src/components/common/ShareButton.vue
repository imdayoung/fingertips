<script setup>
function copyURL() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => alert("URL이 복사되었습니다!"))
    .catch(() => alert("복사에 실패했습니다. 다시 시도해주세요."));
}
</script>

<template>
  <div class="flex justify-center gap-4 mt-4 w-[300px]">
    <button @click="copyURL"
      class="custom-shadow text-gray-600 gong-gothic-font py-2 px-1 rounded-full w-1/2 bg-[#e0f2fe] hover:bg-[#FFEAE3] transition-colors duration-200">
      <font-awesome-icon icon="fa-regular fa-copy" /> 링크 복사
    </button>
  </div>
</template>

<style scoped>
@font-face {
  font-family: "GongGothicMedium";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicMedium.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

.gong-gothic-font {
  font-family: "GongGothicMedium", sans-serif;
}

.custom-shadow {
  @apply shadow-md;
}
</style>