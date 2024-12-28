<script setup>
import { useAuthStore } from '@/stores/auth';
import apiInstance from '@/util/axios-instance';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const toGoogleLogin = async () => {
  try {
    const response = await apiInstance.get('/member/login/google');

    if (response.data.success) {
      window.location.href = response.data.data;
    } else {
      console.error('Google 로그인 실패:', response.data.error);
    }
  } catch (error) {
    console.error('Google 로그인 중 오류 발생:', error.response ? error.response.data : error.message);
  }
};
</script>

<template>
  <button @click="toGoogleLogin">
    <img src="@/assets/google.png" alt="Google Login Button" />
  </button>
</template>
