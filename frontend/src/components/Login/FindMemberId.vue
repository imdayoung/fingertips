<script setup>
import { reactive, ref } from 'vue';
import apiInstance from '@/util/axios-instance';

const member = reactive({
  memberName: '',
  email: '',
});

const error = ref('');
const successMessageId = ref('');
const successMessageName = ref('');
const successMessage = ref(false);
const loading = ref(false);

const checkEmailDuplicate = async (email) => {
  try {
    const response = await apiInstance.get(`/member/email/duplicate`, {
      params: { email: email }
    });

    if (response && response.data) {
      return response.data.exists;
    } else {
      return false;
    }
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    throw error;
  }
};

const checkNameDuplicate = async (memberName) => {
  try {
    const response = await apiInstance.get(`/member/memberName/${encodeURIComponent(memberName)}`);
    return response.data.data;
  } catch (error) {
    console.error('이름 중복 확인 오류:', error);
    throw error;
  }
};

const validateFields = () => {
  if (!member.memberName || !member.email) {
    error.value = '이름과 이메일을 입력해 주세요.';
    return false;
  }
  return true;
};

const findMemberId = async () => {
  if (!validateFields()) {
    return;
  }

  const isEmailExists = await checkEmailDuplicate(member.email);
  if (!isEmailExists) {
    error.value = '존재하지 않는 이메일입니다.';
    return;
  }

  const isNameExists = await checkNameDuplicate(member.memberName);
  if (!isNameExists) {
    error.value = '존재하지 않는 이름입니다. 확인해 주세요.';
    return;
  }

  loading.value = true;
  error.value = '';
  successMessageName.value = '';
  successMessageId.value = '';

  try {
    const response = await apiInstance.get(`/member/memberId/${encodeURIComponent(member.memberName)}/${encodeURIComponent(member.email)}`);

    const data = response.data.data;

    if (!data.isActive) {
      error.value = '탈퇴한 회원입니다. 다시 회원가입을 해주세요.';
    } else {
      successMessageName.value = `${member.memberName}`;
      successMessageId.value = `${data.memberId}`;
      successMessage.value = true;
    }

    member.memberName = '';
    member.email = '';

  } catch (err) {
    if (err.response) {
      if (err.response.status === 500) {
        error.value = '서버 오류가 발생했습니다. 관리자에게 문의하세요.';
      } else {
        error.value = '서버 오류가 발생했습니다. 다시 시도해 주세요.';
      }
    } else {
      error.value = '서버와의 연결이 불안정합니다. 다시 시도해 주세요.';
    }
  } finally {
    loading.value = false;
  }
};

const resetMessages = () => {
  successMessageName.value = '';
  successMessageId.value = '';
  error.value = '';
  successMessage.value = false;
};
</script>

<template>
  <div class="flex flex-col items-center w-1/2 my-24">
    <form @submit.prevent="findMemberId" class="bg-white p-8 shadow-md rounded-lg w-full">
      <div class="mb-6">
        <input type="text" v-model="member.memberName" @focus="resetMessages"
          class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="이름" />
      </div>
      <div class="mb-6">
        <input type="text" v-model="member.email" @focus="resetMessages"
          class="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="이메일" />
      </div>

      <button type="submit"
        class="w-full py-4 bg-customNavy text-white font-semibold rounded-lg hover:bg-customHover">
        아이디 찾기
      </button>

      <div v-if="successMessage" class="text-black-500 text-center mt-4">
        <span class="font">
          <span class="text-blue-500">{{ successMessageName }}</span>님의 아이디는
          <span class="text-blue-500">{{ successMessageId }}</span>입니다.
        </span>
      </div>

      <div v-if="error === '탈퇴한 회원입니다. 다시 회원가입을 해주세요.'" class="whitespace-nowrap text-center mt-4 mb-2 text-gray-600 ">
        <span>
          {{ error }}
          <a href="/join" class="text-blue-500"><br>회원가입하러 가기</a>
        </span>
      </div>

      <div v-else-if="error && error !== '존재하지 않는 사용자입니다.'"
        class="whitespace-nowrap text-center mt-4 mb-2 text-gray-600">
        <span>{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
