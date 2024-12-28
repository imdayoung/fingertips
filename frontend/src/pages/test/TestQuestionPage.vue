<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import { useTestStore } from "@/stores/test";

const router = useRouter();
const route = useRoute();
const testStore = useTestStore();

const questions = ref([]);
const options = ref([]);

const questionId = computed(() => parseInt(route.params.number, 10));
const currentQuestion = computed(() => testStore.questions[questionId.value - 1]);
const currentOptions = computed(() => testStore.getOptionsByQuestionIdx(questionId.value));
const answers = computed(() => currentOptions.value);

const progress = computed(() => {
  return ((questionId.value - 1) / testStore.questions.length) * 100;
});

const fetchData = async () => {
  questions.value = await testStore.fetchQuestions();
  options.value = await testStore.fetchOptions(questionId.value);
};

onMounted(() => {
  fetchData();
});

watch(questionId, () => {
  fetchData();
});

const selectedAnswers = ref([]);

const nextQuestion = (answerId, answerScore, questionType) => {
  selectedAnswers.value.push(answerId);

  if (questionType === 1) {
    testStore.incrementImpulseScore(answerScore);
    localStorage.setItem('impulseScore', testStore.impulseScore);
  } else if (questionType === 2) {
    testStore.incrementPlannedScore(answerScore);
    localStorage.setItem('plannedScore', testStore.plannedScore);
  } else if (questionType === 3) {
    testStore.incrementCostEffective(answerScore);
    localStorage.setItem('costEffective', testStore.costEffective);
  } else if (questionType === 4) {
    testStore.incrementGoodForSatisfaction(answerScore);
    localStorage.setItem('goodForSatisfaction', testStore.goodForSatisfaction);
  } else if (questionType === 5) {
    testStore.incrementMaterialScore(answerScore);
    localStorage.setItem('material', testStore.material);
  } else if (questionType === 6) {
    testStore.incrementExperientialScore(answerScore);
    localStorage.setItem('experiential', testStore.experiential);
  }

  if (questionId.value < testStore.questions.length) {
    router.push({ name: "testQuestion", params: { number: questionId.value + 1 } });
  } else {
    router.push({ name: "testLoading" });
  }
};
</script>

<template>
  <div class="flex flex-col justify-center items-center py-52 bg-gray-50">
    <div class="relative w-1/2 bg-gray-200 rounded-full h-2 mb-16">
      <div class="h-2 rounded-full" :style="{
        width: `${progress}%`,
        backgroundColor: '#C0EBA6',
      }"></div>

      <img src="@/assets/star.png" class="absolute transform -translate-x-1/2" :style="{
        left: `calc(${progress}% - 3px)`,
        top: '-80px',
        width: '170px',
        height: '175px',
      }" alt="Progress Star" />
    </div>

    <div class="text-center">
      <h1 class="text-3xl font-bold my-6 gong-gothic-font">Q{{ questionId }}.</h1>
      <p class="mb-8 gong-gothic-font text-2xl" v-if="currentQuestion">{{ currentQuestion.questionText }}</p>
      <div class="flex flex-col space-y-7">
        <button v-if="answers.length > 0" v-for="answer in answers" :key="answer.optionIdx"
          @click="nextQuestion(answer.optionIdx, answer.score, answer.typeIdx)"
          class="text-lg bg-white text-indiepink-400 gong-gothic-font py-4 px-6 rounded-xl shadow-md transition duration-300 transform hover:scale-105">
          {{ answer.optionText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
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
