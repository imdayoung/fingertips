<script setup>
import { ref, watch } from "vue";
import { useAssetStore } from "@/stores/asset";
import { useAuthStore } from "@/stores/auth.js";

const props = defineProps({
  visible: { type: Boolean, required: true },
  onClose: { type: Function, required: true },
});

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;

const emit = defineEmits(["updateCard"]);

const assetStore = useAssetStore();
const unconnectedCardList = ref([]);
const selectedCards = ref(null);
const message = ref("");

const close = () => {
  props.onClose();
};

const toggleCardSelection = (card) => {
  const index = selectedCards.value.findIndex((a) => a === card);
  if (index === -1) {
    selectedCards.value.push(card);
  } else {
    selectedCards.value.splice(index, 1);
  }
  message.value = "";
};

const addCard = async () => {
  if (selectedCards.value.length === 0) {
    message.value = "연결할 카드를 선택해주세요!";
    return;
  }

  for (const card of selectedCards.value) {
    await assetStore.updateCardStatus(card);
  }

  emit("updateCard", selectedCards.value);
  close();
};

const fetchAsset = async () => {
  await assetStore.getAssetList();
  const cardList = assetStore.allCardList;
  unconnectedCardList.value = cardList.filter(
    (card) => card.connectedStatus === 0
  );
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchAsset();
      selectedCards.value = [];
    }
  }
);
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center"
    @click="close"
  >
    <div
      class="w-2/3 xl:w-1/4 bg-white p-5 rounded-lg shadow-lg fixed box-border"
      @click.stop
    >
      <div class="relative w-full mb-5">
        <div class="text-lg font-bold text-center">
          연결 가능한 카드를 찾았어요
        </div>
        <button class="absolute right-0 top-0 text-gray-700" @click="close">
          <font-awesome-icon :icon="['fas', 'xmark']" class="text-xl mt-1" />
        </button>
      </div>
      <div>
        <div v-if="unconnectedCardList.length > 0">
          <div v-for="(card, index) in unconnectedCardList" :key="index">
            <input
              type="checkbox"
              :id="'card-' + index"
              :value="card"
              :checked="selectedCards.includes(card)"
              @change="toggleCardSelection(card)"
              class="hidden peer"
            />
            <label
              :for="'card-' + index"
              class="inline-flex items-center w-full p-5 my-1 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-indigo-900 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50"
            >
              <img :src="card.assetImage" alt="card" class="h-10 rounded-sm mr-3" />
              <div class="block">
                <div class="text-sm text-gray-600">{{ card.bankName }}</div>
                <div class="font-bold">{{ card.assetName }}</div>
              </div>
            </label>
          </div>
          <div
            v-if="message"
            class="mb-4 text-red-500 text-lg font-bold text-center"
          >
            {{ message }}
          </div>
        </div>
        <div v-else class="text-red-500 text-lg font-bold text-center">
          더 이상 추가할 카드가 없어요!
        </div>
      </div>
      <button
        v-if="unconnectedCardList.length > 0"
        @click="addCard"
        class="w-full mt-1 px-4 py-4 bg-customNavy text-white rounded-lg hover:bg-blue-600"
      >
        선택한 자산 연결하기
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
