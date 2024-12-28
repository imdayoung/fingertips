<script setup>
import ProgressBar from "@/components/challenge/ProgressBar.vue";
import { useChallengeTop3Store } from "@/stores/challengeTop3";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.js";

const challengeTop3Store = useChallengeTop3Store();
const challengeTop3ByMember = ref([]);
const peerChallenge = ref([]);

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;
const memberName = authStore.member.memberName;

const formatDate = (date) => {
  return date.split("-").join(".");
};

const fetchChallengeTop3 = async () => {
  await challengeTop3Store.getChallengeTop3();
};

const fetchPeerChallenge = async () => {
  await challengeTop3Store.getPeerChallenge();
};

onMounted(async () => {
  await fetchChallengeTop3();
  await fetchPeerChallenge();
  challengeTop3ByMember.value = challengeTop3Store.ChallengeTop3List;
  peerChallenge.value = challengeTop3Store.PeerChallengeList;
});
</script>

<template>
  <div
    class="h-full border border-gray-200 rounded-lg p-12 bg-gray-50 w-1/2 mx-auto"
  >
    <div v-if="challengeTop3ByMember.length === 0">
      <div class="mb-4 text-center font-bold text-sm">
        {{ memberName }}님은 진행 중인 챌린지가 없어요..
      </div>
      <div class="mb-4 text-center font-bold text-md">
        {{ memberName }}님의 또래는 어떤 챌린지를 진행 중 일까요?
      </div>
      <div
        v-for="(peer, index) in peerChallenge"
        :key="index"
        class="w-full border border-gray-300 rounded-lg p-4 mb-4 shadow font-semibold"
      >
        {{ peer.challengeName }} ({{ peer.detailedCategory }})<br />
        {{ formatDate(peer.challengeStartDate) }} ~
        {{ formatDate(peer.challengeEndDate) }}
      </div>
    </div>
    <div v-else>
      <div class="mb-4 text-center font-bold text-xl">
        {{ memberName }}님의 진행중인 챌린지 Check!
      </div>
      <div
        v-for="challenge in challengeTop3ByMember"
        :key="challenge.challengeIdx"
        class="border border-gray-300 rounded-lg p-4 mb-4 shadow font-semibold"
      >
        <h1>{{ challenge.challengeName }}</h1>
        <ProgressBar
          class="mt-6"
          v-if="challenge"
          :limit="challenge.challengeLimit"
          :completed="challenge.cardHistoryCount"
        />
      </div>
    </div>
    <RouterLink
      to="/challenge"
      class="text-right block text-sm underline text-gray-500"
    >
      챌린지 보러 가기
    </RouterLink>
  </div>
</template>
