<script setup>
import { ref, onMounted } from "vue";
import { useAssetStore } from "@/stores/asset";
import AddCardModal from "@/components/connection/AddCardModal.vue";
import { useAuthStore } from "@/stores/auth.js";

import { useCardTransactionStore } from "@/stores/card-transaction.js";
const cardTransactionStore = useCardTransactionStore();

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;

const assetStore = useAssetStore();
const connectedCardList = ref([]);

const isModalVisible = ref(false);
const isLoading = ref(true);

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = async () => {
  await fetchAsset();
  isModalVisible.value = false;
};

const fetchAsset = async () => {
  isLoading.value = true;
  await assetStore.getAssetList();
  const cardList = assetStore.allCardList;
  connectedCardList.value = cardList.filter(
    (card) => card.connectedStatus === 1
  );

  connectedCardList.value.forEach((card) => {
    const cardIdx = card.assetIdx;
    if (cardTransactionStore.cardAmountBycardIdx[cardIdx]) {
      card.totalAmount = cardTransactionStore.cardAmountBycardIdx[cardIdx];
    } else {
      card.totalAmount = 0;
    }
  });

  isLoading.value = false;
};

const disconnectCard = async (cardIdx) => {
  const card = connectedCardList.value.find((card) => card.assetIdx === cardIdx);

  const confirm = window.confirm(`${card.assetName} 연동을 해제하시겠습니까?`);

  if (confirm) {
    await assetStore.disconnectCard(cardIdx);
    await fetchAsset();
  }
};

onMounted(async () => {
  await cardTransactionStore.getCardTransactionListByCardIdx();
  await fetchAsset();
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      class="w-full px-8 py-4 bg-white border border-gray-200 rounded-2xl shadow"
    >
      <div v-if="isLoading" role="status" class="flex flex-col items-center">
        <svg
          aria-hidden="true"
          class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>

      <div v-else-if="connectedCardList.length > 0">
        <div
          v-for="(card, index) in connectedCardList"
          :key="index"
          class="py-3 pl-2 flex items-center justify-between"
        >
          <div class="flex items-center">
            <img :src="card.assetImage" alt="card" class="h-12 mr-4 rounded-sm" />
            <div>
              <div class="text-medium">{{ card.assetName }}</div>
              <div class="text-lg font-bold">
                {{ card.totalCardExpense.toLocaleString() }}원
              </div>
            </div>
          </div>
          <button
            @click="disconnectCard(card.assetIdx)"
            class="ml-4 text-gray-400"
          >
            삭제
          </button>
        </div>
        <button @click="openModal" class="w-full">
          <div
            class="flex flex-row items-center py-3 pl-2 text-lg hover:bg-gray-400 hover:rounded-lg"
          >
            <font-awesome-icon
              :icon="['fas', 'circle-plus']"
              class="text-customNavy w-12 h-12 mr-4"
            />카드 추가하기
          </div>
        </button>
      </div>

      <div v-else class="flex flex-col items-center">
        <div class="text-xl">연결된 카드가 없어요</div>
        <div class="text-9xl font-black mt-6 mb-8 text-gray-600 font-jamsil">
          텅
        </div>
        <button
          @click="openModal"
          class="w-full py-4 bg-customNavy text-white text-lg rounded-lg"
        >
          카드 연결하러 가기
        </button>
      </div>
    </div>
  </div>

  <AddCardModal
    @updateCard="fetchAsset"
    :onClose="closeModal"
    :visible="isModalVisible"
  />
</template>

<style scoped></style>
