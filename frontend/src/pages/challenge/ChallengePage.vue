<script setup>
import MyChallengeList from "@/components/challenge/MyChallengeList.vue";
import PeerChallenge from "@/components/challenge/PeerChallenge.vue";

import { onMounted } from "vue";
import { useChallengeStore } from "@/stores/challenge";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;

const challengeStore = useChallengeStore();

onMounted(() => {
  challengeStore.getChallengeList();
});
</script>

<template>
  <div
    class="mx-[15%] grid grid-cols-1 lg:grid-cols-6 gap-20 font-pretendard-regular"
  >
    <PeerChallenge class="lg:col-span-2 max-h-180" />
    <MyChallengeList class="lg:col-span-4" />
  </div>
</template>

<style scoped>
.max-h-180 {
  max-height: 45rem;
}
</style>
