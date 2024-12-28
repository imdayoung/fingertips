<script setup>
import { reactive, ref } from 'vue';
import apiInstance from '@/util/axios-instance';

const member = reactive({
  memberName: '',
  memberId: '',
  email: '',
});

const error = ref('');
const successMessage = ref('');
const isVerificationSent = ref(false);
const loading = ref(false);

const checkFieldsInDB = async () => {
  try {
    const nameResponse = await apiInstance.get(`/member/memberName/${encodeURIComponent(member.memberName)}`);
    if (!nameResponse.data.data) {
      error.value = '존재하지 않는 이름입니다.';
      return false;
    }

    const idResponse = await apiInstance.get(`/member/check-memberId/${encodeURIComponent(member.memberId)}`);
    if (!idResponse.data.data) {
      error.value = '존재하지 않는 아이디입니다.';
      return false;
    }

    const emailResponse = await apiInstance.get(`/member/email/duplicate`, {
      params: { email: member.email }
    });
    if (!emailResponse.data.exists) {
      error.value = '존재하지 않는 이메일입니다.';
      return false;
    }
    return true;
  } catch (err) {
    error.value = '서버 오류가 발생했습니다. 다시 시도해 주세요.';
    return false;
  }
};

const validateFields = () => {
  if (!member.memberName || !member.memberId || !member.email) {
    error.value = '이름, 아이디, 이메일을 모두 입력해 주세요.';
    return false;
  }
  return true;
};

const sendNewPassword = async () => {
  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    alert('입력하신 이메일로 새 비밀번호가 전송되었습니다.');
    const response = await apiInstance.post(`/member/email/newpassword`, {
      memberName: member.memberName,
      memberId: member.memberId,
      email: member.email,
    });

    if (response.data.success) {
      successMessage.value = '새 비밀번호가 이메일로 전송되었습니다. \n이메일을 확인 후 로그인을 진행해주세요.';
      isVerificationSent.value = true;
    } else {
      error.value = '새 비밀번호 전송에 실패했습니다. 다시 시도해 주세요.';
    }
  } catch (err) {
    error.value = '비밀번호 전송 실패';
  } finally {
    loading.value = false;
  }
};

  const findPassword = async () => {
    if (!validateFields()) {
      return;
    }

    
    const isValidUser = await checkFieldsInDB();
    if (!isValidUser) {
      return;
    }

    await sendNewPassword();
};
</script>

<template>
  <div class="flex flex-col items-center w-1/2 my-24">
      <form @submit.prevent="findPassword" v-if="!isVerificationSent" class="bg-white p-8 shadow-md rounded-lg w-full">
        <div class="mb-6">
          <input
            type="text"
            v-model="member.memberName"
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이름"
          />
        </div>
        <div class="mb-6">
          <input
            type="text"
            v-model="member.memberId"
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="아이디"
          />
        </div>
        <div class="mb-6">
          <input
            type="email"
            v-model="member.email"
            class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일"
          />
        </div>
        
        <button
          type="submit"
          class="w-full py-4 bg-customNavy text-white font-semibold rounded-lg hover:bg-customHover"
          :disabled="loading"
        >
          새 비밀번호 받기
        </button>
        <div v-if="error" class="whitespace-nowrap text-black-500 text-center mb-2 mt-4">{{ error }}</div>
        <div v-if="successMessage" class="text-green-500 text-center mb-2 mt-4" style="white-space: pre-line;">{{ successMessage }}</div>
      </form>

      <div v-if="isVerificationSent" class="bg-white p-8 shadow-md rounded-lg w-full text-center">
        <p class="text-lg text-green-500" style="white-space: pre-line;">{{ successMessage }}</p>
      </div>
    </div>
</template>

<style scoped>

</style>
