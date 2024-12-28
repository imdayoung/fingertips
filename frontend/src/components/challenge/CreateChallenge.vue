<script setup>
import { ref } from "vue";
import { useChallengeStore } from "@/stores/challenge";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;

const props = defineProps(["showModal"]);
const emit = defineEmits(["close", "challengeAdded"]);

const challengeStore = useChallengeStore();

const detailedCategories = ref([]);
const maxLimit = ref(100);
const limitMessage = ref("제한횟수");

const formData = ref({
  memberIdx: memberIdx,
  challengeName: "",
  challengeType: "횟수",
  challengeLimit: 0,
  categoryIdx: 0,
  detailedCategory: "",
  challengeStatus: "",
  challengeStartDate: "",
  challengeEndDate: "",
  isPublic: 1,
});

const isDetailedCategoryInputDirectly = ref(false);

const closeModal = () => {
  formData.value = {
    memberIdx: memberIdx,
    challengeName: "",
    challengeType: "횟수",
    challengeLimit: 0,
    categoryIdx: 0,
    detailedCategory: "",
    challengeStatus: "",
    challengeStartDate: "",
    challengeEndDate: "",
    isPublic: 1,
  };
  detailedCategories.value = [];
  limitMessage.value = "제한횟수";
  maxLimit.value = 100;
  isDetailedCategoryInputDirectly.value = false;
  emit("close");
};

const confirmSubmission = async () => {
  if (
    window.confirm(
      "한번 등록한 챌린지는 수정할 수 없습니다. 이대로 진행하시겠습니까?"
    )
  ) {
    const today = new Date();
    const challengeStartDate = new Date(formData.value.challengeStartDate);

    const challengeStatus = challengeStartDate > today ? "예정" : "진행";
    formData.value.challengeStatus = challengeStatus;

    await challengeStore.insertChallenge(formData.value);
    await challengeStore.getChallengeList();

    window.location.reload();
    closeModal();
  }
};

const onConditionChange = () => {
  if (formData.value.challengeType === "횟수") {
    maxLimit.value = 100;
    limitMessage.value = "제한횟수";
  } else {
    maxLimit.value = 1000000;
    limitMessage.value = "제한금액";
  }
  formData.value.challengeLimit = 0;
};

const onCategoryChange = async () => {
  if (formData.value.categoryIdx != 0) {
    await challengeStore.getDetailedCategory(
      formData.value.categoryIdx
    );
    detailedCategories.value = challengeStore.detailedCategories;
  } else {
    detailedCategories.value = [];
  }
};

const selectDetailedCategory = (detailedCategory) => {
  if (formData.value.detailedCategory === detailedCategory) {
    formData.value.detailedCategory = '';
  } else {
    formData.value.detailedCategory = detailedCategory;  
  }
};

const selectPublicStatus = (status) => {
  formData.value.isPublic = status;
};

const changeDetailedCategoryInputDirectly = () => {
  isDetailedCategoryInputDirectly.value = !isDetailedCategoryInputDirectly.value;
  formData.value.detailedCategory = '';
}

const today = new Date();
const availableDay = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20"
    @click="closeModal">
    <div class="w-2/3 xl:w-1/4 bg-white p-8 rounded-lg shadow-lg box-border" @click.stop>
      <div class="text-xl font-semibold mb-4 text-center">챌린지 등록하기</div>
      <form @submit.prevent="confirmSubmission">
        <div class="flex flex-col space-y-2">
          <div class="flex items-center h-12">
            <div class="w-24 text-end mr-8">이름</div>
            <input id="challengeName" type="text" v-model="formData.challengeName"
              class="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2" required />
          </div>

          <div class="flex items-center h-12">
            <div class="w-24 text-end mr-8">기간</div>
            <div class="flex w-full py-2">
              <input type="date" :min="availableDay" v-model="formData.challengeStartDate" class="form-input border-gray-300 rounded-md"
                required />
              <span class="self-center">-</span>
              <input type="date" :min="availableDay" v-model="formData.challengeEndDate" class="form-input border-gray-300 rounded-md"
                required />
            </div>
          </div>

          <div class="flex items-center h-12">
            <div class="w-24 text-end mr-8">조건</div>
            <select v-model="formData.challengeType" @change="onConditionChange"
              class="bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              <option value="횟수">횟수 제한</option>
              <option value="금액">금액 제한</option>
            </select>
          </div>

          <div class="flex items-center h-12">
            <div class="w-24 text-end mr-8">카테고리</div>
            <select v-model="formData.categoryIdx" @change="onCategoryChange"
              class="bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
              <option value="0">카테고리를 선택해주세요.</option>
              <option value="1">식비</option>
              <option value="2">카페/디저트</option>
              <option value="3">교통비</option>
              <option value="4">미용</option>
              <option value="5">취미</option>
              <option value="6">주거/통신</option>
              <option value="7">의류</option>
              <option value="8">의료/건강</option>
              <option value="9">여행</option>
              <option value="10">생필품</option>
              <option value="11">미분류</option>
            </select>
          </div>

          <div class="flex min-h-12">
            <div class="w-24 text-end mr-8 my-2">소분류</div>
            <div class="w-full">
              <div v-if="detailedCategories.length > 0 && !isDetailedCategoryInputDirectly" class="flex flex-wrap">
                <div v-for="(category, index) in detailedCategories" 
                    :key="index" 
                    @click="selectDetailedCategory(category)" 
                    :class="['rounded-full px-3 py-2 text-sm mr-2 mb-2 cursor-pointer', 
                              formData.detailedCategory === category ? 'bg-customNavy text-white' : 'bg-gray-200 hover:bg-gray-300']">
                  {{ category }}
                </div>
              </div>
              <div v-if="formData.categoryIdx != 0" :class="['cursor-pointer w-fit px-3 py-2 text-sm bg-gray-200 rounded-full', isDetailedCategoryInputDirectly ? 'bg-customNavy text-white' : 'bg-gray-200']"
                @click="changeDetailedCategoryInputDirectly">
                직접 입력
              </div>
              <div v-if="isDetailedCategoryInputDirectly" class="my-3">
                <input v-model="formData.detailedCategory" type="text"
                  placeholder="세부 내역을 입력해주세요."
                  class="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2">
              </div>
            </div>
          </div>

          <div class="flex items-center h-12">
            <div class="w-24 text-end mr-8">{{ limitMessage }}</div>
            <input type="number"
              v-model="formData.challengeLimit"
              class="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2">
          </div>

          <div class="flex items-center h-12">
            <div class="w-24 text-end mr-8">공개여부</div>
              <div class="w-full mt-5">
                <div class="flex space-x-2">
                  <div class="cursor-pointer text-center py-2 px-5 rounded-lg" :class="{
                    'bg-customNavy text-white': formData.isPublic === 1,
                    'bg-gray-200': formData.isPublic !== 1,
                  }" @click="selectPublicStatus(1)">
                    공개
                  </div>
                  <div class="cursor-pointer text-center py-2 px-5 rounded-lg" :class="{
                    'bg-red-500 text-white': formData.isPublic === 0,
                    'bg-gray-200': formData.isPublic !== 0,
                  }" @click="selectPublicStatus(0)">
                    비공개
                  </div>
                </div>
              <div v-if="formData.isPublic === 1" class="text-sm text-customNavy">공개로 설정하면 또래에게 내 챌린지가 공개돼요.</div>
              <div v-else class="text-sm text-red-500">비공개로 설정하면 또래에게 내 챌린지가 공개되지 않아요.</div>
            </div>
          </div>
        </div>

        <div class="flex space-x-2 mt-12">
          <button type="submit" class="flex-1 bg-customNavy text-white py-3 rounded-lg  hover:bg-customHover">등록</button>
          <button type="button" class="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
            @click="closeModal">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
