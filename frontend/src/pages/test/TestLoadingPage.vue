<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const testStore = useTestStore();
const authStore = useAuthStore();

const calculateResult = () => {
  let resultValue = 0;

  if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
    resultValue = 1;
  } else if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
    resultValue = 2;
  } else if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
    resultValue = 3;
  } else if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
    resultValue = 4;
  } else if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
    resultValue = 5;
  } else if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
    resultValue = 6;
  } else if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
    resultValue = 7;
  } else if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
    resultValue = 8;
  }

  setTimeout(() => {
    router.push({ name: "testResult", params: { resultId: resultValue } });
  }, 1500);
};

onMounted(() => {
  calculateResult();
  if (testStore.birthYear == "") {
    const info = testStore.getSurveyInfo();
    testStore.setBirthYear(info.birthYear);
    testStore.setGender(info.gender);
  }
});
</script>

<template>
  <div class="flex flex-col justify-center items-center py-52 bg-gray-50">
    <h1 class="text-2xl gong-gothic-font font-bold mb-4">결과를 계산 중입니다...</h1>
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loader {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
}

.loader::before,
.loader::after {
  content: "";
  grid-area: 1/1;
  --c: no-repeat radial-gradient(farthest-side, #25b09b 92%, #0000);
  background: var(--c) 50% 0, var(--c) 50% 100%, var(--c) 100% 50%, var(--c) 0 50%;
  background-size: 12px 12px;
  animation: l12 1s infinite;
}

.loader::before {
  margin: 4px;
  filter: hue-rotate(45deg);
  background-size: 8px 8px;
  animation-timing-function: linear;
}

@keyframes l12 {
  100% {
    transform: rotate(0.5turn);
  }
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
