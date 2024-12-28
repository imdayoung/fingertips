<script setup>
import { ref, onMounted } from "vue";
import socket from "@/util/socket";
import { useBalanceStore } from "@/stores/balance";
import { useAuthStore } from "@/stores/auth.js";

const balanceByMember = ref([]);
const currentAccountIndex = ref(0);

const balanceStore = useBalanceStore();

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;

const fetchBalance = async () => {
  await balanceStore.getTotalBalance();
};

onMounted(async () => {
  await fetchBalance(memberIdx);
  balanceByMember.value = balanceStore.TotalBalanceList;
  socket.on("connect", () => {
    console.log("Socket.IO connected!");
  });
  socket.on("balanceUpdate", (data) => {
    balanceByMember.value = data;
  });
  socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
  });
});

const nextAccount = () => {
  if (currentAccountIndex.value < balanceByMember.value.length - 1) {
    currentAccountIndex.value += 1;
  }
};

const prevAccount = () => {
  if (currentAccountIndex.value > 0) {
    currentAccountIndex.value -= 1;
  }
};
</script>

<template>
  <div
    class="border border-gray-200 rounded-lg p-6 bg-yellow-300 w-1/2 lg:w-1/3 mx-auto"
  >
    <div
      v-if="balanceByMember.length === 0"
      class="py-10 flex justify-center text-lg underline"
    >
      <RouterLink to="/mypage/asset">계좌연동하러가기</RouterLink>
    </div>
    <div v-else>
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center text-sm text-gray-500">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          <RouterLink to="/mypage/asset">내 계좌 보러가기</RouterLink>
        </div>
        <button class="flex items-center text-sm text-gray-500">
          <svg
            class="w-4 h-4 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          ></svg>
        </button>
      </div>

      <div class="text-gray-700 mb-6">
        <p class="text-lg font-semibold">
          {{ balanceByMember[currentAccountIndex].accountName }}
        </p>
        <p class="text-sm mb-4">
          {{ balanceByMember[currentAccountIndex].bankName }}
        </p>
      </div>
      <div class="flex justify-between mb-6 font-black">
        <button
          @click="prevAccount"
          :disabled="currentAccountIndex === 0"
          class="w-6 h-6 text-sm rounded flex justify-center items-center"
        >
          <font-awesome-icon
            :icon="['fas', 'chevron-left']"
            class="text-customNavy"
          />
        </button>
        <button
          @click="nextAccount"
          :disabled="currentAccountIndex === balanceByMember.length - 1"
          class="w-6 h-6 text-sm rounded flex justify-center items-center"
        >
          <font-awesome-icon
            :icon="['fas', 'chevron-right']"
            class="text-customNavy"
          />
        </button>
      </div>

      <div class="flex justify-end text-4xl font-bold text-gray-900 mb-4">
        {{ balanceByMember[currentAccountIndex].balance.toLocaleString() }}원
      </div>
    </div>
  </div>
</template>
