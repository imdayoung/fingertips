<script setup>
import { ref } from 'vue';
import FindMemberId from '@/components/Login/FindMemberId.vue';
import FindPassword from '@/components/Login/FindPassword.vue';

const menu = ref('memberId');

const selectMenu = (value) => {
  menu.value = value;
}
</script>

<template>
  <div class="mx-[20%] flex flex-col justify-center items-center font-pretendard-regular">
    <div class="grid grid-cols-2 w-full">
      <div class="col-span-1">
        <button :class="['w-full text-2xl font-bold', menu === 'memberId' ? 'text-customNavy' : 'text-gray-400']" type="button" @click="selectMenu('memberId')">
          <div>아이디 찾기</div>
          <div :class="['w-full border-b-4 mt-2', menu === 'memberId' ? 'border-customNavy' : 'border-gray-400']"></div>
        </button>
      </div>
      <div class="col-span-1">
        <button :class="['w-full text-2xl font-bold', menu === 'memberId' ? 'text-gray-400' : 'text-customNavy']" type="button" @click="selectMenu('password')">
          <div>비밀번호 찾기</div>
          <div :class="['w-full border-b-4 mt-2', menu === 'memberId' ? 'border-gray-400' : 'border-customNavy']"></div>
        </button>
      </div>
    </div>
    <FindMemberId v-if="menu === 'memberId'"/>
    <FindPassword v-else/>
  </div>
</template>

<style scoped>

</style>
