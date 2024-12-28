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

const emit = defineEmits(["updateAccount"]);

const assetStore = useAssetStore();
const unconnectedAccountList = ref([]);
const selectedAccounts = ref([]);
const message = ref("");

const close = () => {
  props.onClose();
};

const toggleAccountSelection = (account) => {
  const index = selectedAccounts.value.findIndex((a) => a === account);
  if (index === -1) {
    selectedAccounts.value.push(account);
  } else {
    selectedAccounts.value.splice(index, 1); // 이미 선택된 계좌를 해제
  }
  message.value = "";
};

const addAccount = async () => {
  if (selectedAccounts.value.length === 0) {
    message.value = "연결할 계좌를 선택해주세요!";
    return;
  }

  for (const account of selectedAccounts.value) {
    await assetStore.updateAccountStatus(account);
  }

  emit("updateAccount", selectedAccounts.value);
  close();
};

const fetchAsset = async () => {
  await assetStore.getAssetList();
  const accountList = assetStore.allAccountList;
  unconnectedAccountList.value = accountList.filter(
    (account) => account.connectedStatus === 0
  );
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchAsset();
      selectedAccounts.value = [];
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
          연결 가능한 계좌를 찾았어요
        </div>
        <button class="absolute right-0 top-0 text-gray-700" @click="close">
          <font-awesome-icon :icon="['fas', 'xmark']" class="text-xl mt-1" />
        </button>
      </div>
      <div>
        <div v-if="unconnectedAccountList.length > 0">
          <div v-for="(account, index) in unconnectedAccountList" :key="index">
            <input
              type="checkbox"
              :id="'account-' + index"
              :value="account"
              :checked="selectedAccounts.includes(account)"
              @change="toggleAccountSelection(account)"
              class="hidden peer"
            />
            <label
              :for="'account-' + index"
              class="inline-flex items-center w-full p-5 my-1 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-indigo-900 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50"
            >
              <img
                :src="account.assetImage"
                alt="account"
                class="w-10 h-10 rounded-full mr-3"
              />
              <div class="block">
                <div class="text-sm text-gray-600">
                  {{ account.bankName }}
                </div>
                <div class="font-bold">{{ account.assetName }}</div>
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
          더 이상 추가할 계좌가 없어요!
        </div>
      </div>
      <button
        v-if="unconnectedAccountList.length > 0"
        @click="addAccount"
        class="w-full mt-1 px-4 py-4 bg-customNavy text-white rounded-lg hover:bg-blue-600"
      >
        선택한 자산 연결하기
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
