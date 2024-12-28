<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useMemberStore } from '@/stores/member.js';
import { useRouter } from "vue-router";
import GoogleLoginComponent from "@/components/Login/GoogleLoginComponent.vue";

const router = useRouter();
const auth = useAuthStore();
const memberStore = useMemberStore();

const member = reactive({
  memberId: "",
  password: "",
});

const error = ref("");

const login = async () => {
  if (!member.memberId || !member.password) {
    error.value = "아이디와 비밀번호를 모두 입력해주세요.";
    return;
  }
  try {
    const isValidMemberId = await auth.checkMemberId(member.memberId);
    if (!isValidMemberId) {
      error.value = '존재하지 않는 아이디 입니다.';
      return;
    }
    const response = await auth.login(member.memberId, member.password);

    if (response.success) {
      if (response.data.role === 'ROLE_ADMIN') {
        router.push("/admin");
      } else {
        await memberStore.getProfile();
        router.push("/");
      }
    } else {
      error.value = response.error.message;
    }
  } catch (err) {
    error.value = "로그인 중 오류가 발생했습니다.";
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center font-pretendard-regular">
    <div class="mb-10">
      <img src="@/assets/logo.png" alt="로고" />
    </div>

    <form class="w-1/2 xl:w-1/4 mt-8" @submit.prevent="login">
      <div class="relative mb-6">
        <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>

        <input type="text" v-model="member.memberId" id="memberId"
          class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-5"
          placeholder="아이디를 입력해주세요." />
      </div>

      <div class="mb-6">
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <font-awesome-icon :icon="['fas', 'lock']" />
          </div>
          <div class="flex items-center">
            <input type="password" v-model="member.password" id="password"
              class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-5"
              placeholder="비밀번호를 입력해주세요." />

            <div class="tooltip-icon relative inline-block">
              <font-awesome-icon :icon="['fas', 'circle-question']" class="text-2xl text-customNavy ml-2.5" />
              <div
                class="tooltip hidden absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-max bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-no-wrap">
                비밀번호는 영어 대소문자, 숫자, 특수문자를 혼합하여 8자리 이상 작성해주세요
              </div>
            </div>
          </div>
        </div>
        <div v-if="error" class="text-red-500 font-semibold text-lg mt-4 text-center whitespace-nowrap">
          {{ error }}
        </div>
      </div>

      <button type="submit" class="cursor-pointer bg-customNavy text-white text-sm rounded-xl block w-full ps-10 p-5 hover:bg-customHover">
        <router-link to="">로그인</router-link>
      </button>
    </form>

    <div class="my-4 flex space-x-4 text-gray-500">
      <router-link to="find">아이디 / 비밀번호 찾기</router-link>
      <span>|</span>
      <router-link to="join">회원가입</router-link>
    </div>

    <div class="mt-3 w-14">
      <GoogleLoginComponent />
    </div>
  </div>
</template>

<style scoped>
img {
  width: 12rem;
}

.tooltip {
  transition: opacity 0.2s;
  opacity: 0;
}

.tooltip-icon:hover .tooltip {
  opacity: 1;
  visibility: visible;
  display: block;
}
</style>
