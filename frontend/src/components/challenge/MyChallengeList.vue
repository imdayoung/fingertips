<script setup>
import { ref, onMounted } from "vue";
import { useChallengeStore } from "@/stores/challenge";
import ChallengeComponent from "./ChallengeComponent.vue";
import CreateChallenge from "@/components/challenge/CreateChallenge.vue";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;

const challengeStore = useChallengeStore();
const chartData = ref([]);

const showCreateModal = ref(false);

const openCreateChallengeModal = () => {
  showCreateModal.value = true;
};

const closeCreateChallengeModal = () => {
  showCreateModal.value = false;
};

const addNewChallenge = (newChallenge) => {
  challengeStore.addNewChallenge(newChallenge);
};

onMounted(async () => {
  await challengeStore.getChallengeList();
  await challengeStore.getChallengeStatus();
  chartData.value = challengeStore.chartData;
});
</script>

<template>
  <div v-if="challengeStore.challengeList.length > 0">
    <div class="flex items-center justify-between mb-4">
      <div class="text-xl font-bold text-center flex-grow">
        나의 챌린지 목록
      </div>
      <button
        class="px-4 py-2 rounded-full bg-customNavy text-white text-xs hover:bg-customHover"
        @click="openCreateChallengeModal"
      >
        추가
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <ChallengeComponent
        v-for="(challenge, index) in challengeStore.challengeList"
        :key="index"
        :challenge="challenge"
        :chartData="chartData[index]"
      />
    </div>
    <CreateChallenge
      :showModal="showCreateModal"
      @close="closeCreateChallengeModal"
      @challengeAdded="addNewChallenge"
    />
  </div>
  <div v-else>
    <div class="flex flex-col items-center py-60">
      <div class="text-9xl font-black mt-6 mb-8 text-gray-600">텅</div>
      <div class="text-xl text-center">
        <div>등록된 챌린지가 없어요</div>
        <div>챌린지를 등록하고 안정적인 소비 습관을 만들어봐요!</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
