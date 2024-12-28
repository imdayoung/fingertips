<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useMemberStore } from '@/stores/member.js';
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const memberStore = useMemberStore();
const router = useRouter();

const memberId = computed(() => authStore.member.memberId);
const imageUrl = computed(() => memberStore.member.imageUrl);

const logout = async () => {
  await authStore.logout();
  authStore.clearAuthState();
  localStorage.clear(); 
  router.push('/');
};
</script>

<template>
  <nav class="bg-white shadow-md py-4 px-8 rounded-xl max-w-9xl mt-4 mx-auto mb-16 font-pretendard-regular">
    <div class="mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <img src="/src/assets/logo.png" alt="Company Logo" class="w-14" />
      </router-link>

      <div v-if="memberId" class="flex space-x-4">
        <router-link to="/test/start">소비 테스트</router-link>
        <span>|</span>
        <router-link to="/analysis">소비 분석</router-link>
        <span>|</span>
        <router-link to="/challenge">마이 챌린지</router-link>
      </div>

      <div v-if="memberId" class="flex">

        <div class="flex space-x-4">
          <div class="flex space-x-2">
            <img class="w-6 h-6 rounded-full" :src="`https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${imageUrl}`" alt="Profile Image">
            <router-link to="/mypage" class="gray">마이페이지</router-link>
          </div>
          <span class="gray">|</span>
          <button @click="logout" class="w-18 gray rounded-md">로그아웃</button>
        </div>
      </div>

      <div v-else>
        <div class="flex space-x-4">
          <router-link to="/login" class="gray">로그인</router-link>
          <span class="gray">|</span>
          <router-link to="/join" class="gray">회원가입</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
