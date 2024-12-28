<script setup>
import Guest from '@/components/home/Guest.vue';
import Member from '@/components/home/Member.vue';

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const authData = JSON.parse(localStorage.getItem('auth'));

</script>

<template>
  <div>
    <div v-if="authData == null">
      <Guest />
    </div>
    <div v-else>
      <Member />
    </div>
  </div>
</template>
