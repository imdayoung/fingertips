<script setup>
import ProgressBar from "./ProgressBar.vue";
import { useChallengeStore } from "@/stores/challenge";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;

const challengeStore = useChallengeStore();

const props = defineProps({
  challenge: Object,
  chartData: Object,
});

const formatDate = (date) => {
  return date.split("-").join(".");
};

const deleteChallenge = async (challengeIdx) => {
  if (confirm("정말로 삭제하시겠습니까?")) {
    await challengeStore.deleteChallenge(challengeIdx);
    await challengeStore.getChallengeList();
  }
};
</script>

<template>
  <div
    :class="[
      'rounded-lg border shadow py-3 px-4',
      challenge.challengeStatus !== '종료'
        ? ''
        : chartData && chartData.challengeLimit < chartData.cardHistoryCount
        ? 'bg-rose-200'
        : 'bg-blue-200',
      challenge.challengeStatus == '진행' &&
      chartData &&
      chartData.challengeLimit < chartData.cardHistoryCount
        ? 'bg-rose-200'
        : '',
    ]"
  >
    <div class="flex justify-between p-1">
      <div
        :class="[
          'rounded-full shadow w-fit py-1 px-3 mb-3 text-xs text-white font-bold',
          challenge.challengeStatus === '진행'
            ? 'bg-sky-300 text-white'
            : challenge.challengeStatus === '예정'
            ? 'bg-rose-400'
            : 'bg-gray-500',
        ]"
      >
        {{ challenge.challengeStatus }}
      </div>
      <button
        class="rounded-full text-sm ml-4"
        @click="deleteChallenge(challenge.challengeIdx)"
      >
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </button>
    </div>

    <div class="flex space-x-5">
      <div class="flex flex-col text-end text-gray-600 space-y-2">
        <div>이름</div>
        <div>카테고리</div>
        <div>소분류</div>
        <div>
          {{ challenge.challengeType == "횟수" ? "제한 횟수" : "제한 금액" }}
        </div>
        <div>기간</div>
      </div>
      <div class="flex-grow space-y-2">
        <div class="font-bold">{{ challenge.challengeName }}</div>
        <div>{{ challenge.categoryName }}</div>
        <div>{{ challenge.detailedCategory }}</div>
        <div>
          {{ challenge.challengeLimit.toLocaleString()
          }}{{ challenge.challengeType == "횟수" ? "회" : "원" }}
        </div>
        <div>
          {{ formatDate(challenge.challengeStartDate) }} -
          {{ formatDate(challenge.challengeEndDate) }}
        </div>
      </div>
    </div>
    <ProgressBar
      class="mt-8 mb-5"
      v-if="chartData"
      :limit="chartData.challengeLimit"
      :completed="chartData.cardHistoryCount"
    />
  </div>
</template>

<style scoped></style>
