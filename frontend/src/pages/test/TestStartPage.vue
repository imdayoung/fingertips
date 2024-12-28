<script setup>
import { useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";
import { useAuthStore } from "@/stores/auth";
import ShareButton from "@/components/common/ShareButton.vue";
import KakaoShareButton from "@/components/common/KakaoShareButton.vue";

const router = useRouter();
const testStore = useTestStore();
const authStore = useAuthStore();

const startTest = async () => {
  testStore.resetScore();
  testStore.resetInfo();
  testStore.fetchTypes();

  localStorage.removeItem('impulseScore');
  localStorage.removeItem('plannedScore');
  localStorage.removeItem('costEffective');
  localStorage.removeItem('goodForSatisfaction');
  localStorage.removeItem('material');
  localStorage.removeItem('experiential');
  localStorage.removeItem('resultImage');
  localStorage.removeItem('resultName');

  if (authStore.member.memberId) {
    const info = await testStore.getSurveyInfo();
    testStore.setBirthYear(info.birthYear);
    testStore.setGender(info.gender);
    if (testStore.getAdditionalSurveyInfo()) {
      router.push({ name: "testQuestion", params: { number: 1 } });
    } else {
      router.push({ name: "testSurvey" });
    }
  } else {
    router.push({ name: "testSurvey" });
  }
};
</script>

<template>
  <div class="relative">
    <div class="flex justify-center mt-0">
      <img src="/src/assets/test_start.png" class="w-1/3 h-auto mb-0" />
    </div>

    <div class="flex justify-center">
      <button @click="startTest"
        class="custom-shadow gong-gothic-font bg-white text-gray-500 font-bold py-5 px-6 rounded-xl text-xl transition duration-300 transform hover:scale-105 w-[300px]">
        나의 소비핑 테스트 <br />
        <span class="text-blue-600 text-2xl gong-gothic-font">시작하기</span>
      </button>
    </div>
    <br />
    <div class="flex justify-center">
      <ShareButton class="mt-4" />
    </div>
    <br />
    <br />
    <h1 class="gong-gothic-font flex justify-center">카카오톡으로 공유하기</h1>
    <div class="flex justify-center">
      <KakaoShareButton class="mt-4 custom-button" description="나의 소비 성향 테스트 하러 가기"
        :linkUrl="`http://localhost:8080/test/start`" />
    </div>
  </div>
</template>

<style>
.custom-shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 5, 0.5);
}

@font-face {
  font-family: "GongGothicMedium";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicMedium.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}

.gong-gothic-font {
  font-family: "GongGothicMedium", sans-serif;
}
</style>
