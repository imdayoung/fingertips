<script setup>
import { useTestResultStore } from "@/stores/testResult";
import { ref, onMounted, toRaw } from "vue";
import { useAuthStore } from "@/stores/auth.js";

const testResultStore = useTestResultStore();
const SBTIResult = ref(null);
const resultImage = ref("");
const GoTest = ref(false);

const authStore = useAuthStore();
const memberIdx = authStore.member.memberIdx;

const fetchSBTIResult = async (memberIdx) => {
  await testResultStore.getTestResult(memberIdx);

  SBTIResult.value = await testResultStore.TestResult;

  const _obj = toRaw(SBTIResult.value);

  if (_obj && _obj.typeImage) {
    resultImage.value = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/basic-image/${_obj.typeImage}`;
  } else {
    resultImage.value = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/basic-image/before_test.png`;
    GoTest.value = true;
  }
};

onMounted(async () => {
  await fetchSBTIResult(memberIdx);
});
</script>

<template>
  <div class="flex justify-center h-full p-30 w-3/4 mx-auto">
    <div v-if="GoTest" class="h-full">
      <RouterLink to="/test/start" class="h-full">
        <img class="h-full" :src="resultImage" alt="Result Image" />
      </RouterLink>
    </div>
    <div v-else class="h-full">
      <img :src="resultImage" alt="Result Image" class="h-full" />
    </div>
  </div>
</template>
