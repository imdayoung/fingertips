<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";
import { useAuthStore } from "@/stores/auth";
import ShareButton from "@/components/common/ShareButton.vue";
import KakaoShareButton from "@/components/common/KakaoShareButton.vue";
import ResultBar from "@/components/test/ResultBar.vue";

const route = useRoute();
const router = useRouter();
const testStore = useTestStore();
const authStore = useAuthStore();

const resultImage = ref("");
const resultContent = ref("");
const resultId = computed(() => parseInt(route.params.resultId, 10));

const impulseVsPlanned = ref({ left: 0, right: 0});
const costEffectiveVsSatisfaction = ref({ left: 0, right: 0});
const materialVsExperiential = ref({ left: 0, right: 0});

onMounted(async () => {
    resultContent.value = await getResultContent();

    const storedResultText = localStorage.getItem('resultName');
    if (storedResultText) {
        resultContent.value = storedResultText; 
    } else {
        resultContent.value = await getResultContent(); 
    }

    testStore.impulseScore = parseInt(localStorage.getItem('impulseScore')) || 0;
    testStore.plannedScore = parseInt(localStorage.getItem('plannedScore')) || 0;
    testStore.costEffective = parseInt(localStorage.getItem('costEffective')) || 0;
    testStore.goodForSatisfaction = parseInt(localStorage.getItem('goodForSatisfaction')) || 0;
    testStore.material = parseInt(localStorage.getItem('material')) || 0;
    testStore.experiential = parseInt(localStorage.getItem('experiential')) || 0;

    const storedImage = localStorage.getItem('resultImage');
    if (storedImage) {
        resultImage.value = storedImage;
    }

    impulseVsPlanned.value = { left: testStore.impulseScore, right: testStore.plannedScore };
    costEffectiveVsSatisfaction.value = { left: testStore.costEffective, right: testStore.goodForSatisfaction };
    materialVsExperiential.value = { left: testStore.material, right: testStore.experiential };
});

const getResultContent = async () => {
    let resultText = "";
    let resultValue = 0;

    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultText = testStore.types[0].typeName;
        resultValue = 1;
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultText = testStore.types[1].typeName;
        resultValue = 2;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultText = testStore.types[2].typeName;
        resultValue = 3;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultText = testStore.types[3].typeName;
        resultValue = 4;
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultText = testStore.types[4].typeName;
        resultValue = 5;
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultText = testStore.types[5].typeName;
        resultValue = 6;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultText = testStore.types[6].typeName;
        resultValue = 7;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultText = testStore.types[7].typeName;
        resultValue = 8;
    }

    if (resultValue !== 0) {
        testStore.saveResult(resultValue);
        resultImage.value = testStore.types[resultValue - 1].typeImage; 
        resultImage.value = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${resultImage.value}`;
        localStorage.setItem('resultName', resultText);
        localStorage.setItem('resultImage', resultImage.value); 
        console.log('이미지 url',resultImage.value);
    }
    return resultText;
};

const restartTest = () => {
    router.push({ name: "testStart" });
};

const goToSignup = () => {
    if (authStore.isLogin()) {
        router.push({ name: "homePage" });
    } else {
        router.push({ name: "join" }); 
    }
};
</script>

<template>
    <div class="flex flex-col justify-center items-center h-full">
        <h1 class="text-2xl gong-gothic-font font-bold-md mb-10">당신의 결과는:</h1>
        <img :src="resultImage" alt="Result Image" class="w-[390px] h-[614px] object-cover" />

        <div class="w-full max-w-lg">
            <ResultBar
                :labelLeft="'충동적'"
                :labelRight="'계획적'"
                :scoreLeft="impulseVsPlanned.left"
                :scoreRight="impulseVsPlanned.right"
            />
            <ResultBar
                :labelLeft="'가성비'"
                :labelRight="'가심비'"
                :scoreLeft="costEffectiveVsSatisfaction.left"
                :scoreRight="costEffectiveVsSatisfaction.right"
            />
            <ResultBar
                :labelLeft="'물질적'"
                :labelRight="'경험적'"
                :scoreLeft="materialVsExperiential.left"
                :scoreRight="materialVsExperiential.right"
            />
        </div>
        <ShareButton class="mt-4" /> 

        <KakaoShareButton 
            class="mt-4" 
            title="카카오톡으로 공유하기" 
            description="테스트 결과를 확인하세요!"
            imageUrl="https://your-image-url.com/image.jpg"
            :linkUrl="`http://localhost:8080/test/${resultId}`"
        />
        <div class="flex gong-gothic-font">
            <button @click="restartTest" class="mt-4 px-4 py-2 bg-blue-200 text-gray-600 rounded mr-2 rounded-full">
                <font-awesome-icon :icon="['fas', 'repeat']" class="mr-2" />다시 하기
            </button>
            <button 
                @click="goToSignup" 
                :class="[authStore.isLogin() ? 'bg-yellow-200' : 'bg-green-100', 'mt-4', 'ml-2', 'px-4', 'py-2', 'text-gray-600', 'rounded-full', 'flex', 'items-center']">
                {{ authStore.isLogin() ? "홈 화면으로" : "회원가입 하러 가기" }}
            </button>
        </div>
    </div>
</template>

<style>
@font-face {
    font-family: "GongGothicMedium";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicMedium.woff") format("woff");
    font-weight: normal;
    font-style: normal;
}

.gong-gothic-font {
    font-family: "GongGothicMedium", sans-serif;
}
</style>
