<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";


const route = useRoute();
const baseUrl = "http://localhost:5173"; 
const linkUrl = `${baseUrl}${route.fullPath}`;
const imageUrl = "https://raw.githubusercontent.com/kb-project-mz/Frontend/main/src/assets/test_start.png";

const shareKakao = () => {
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: "나의 소비 성향은?",
        description: "지금 바로 소비 성향 테스트하러 가기",
        imageUrl: imageUrl, 
        link: {
          mobileWebUrl: linkUrl,
          webUrl: linkUrl,
        },
      },
      buttons: [
        {
          title: '자세히 보기',
          link: {
            mobileWebUrl: linkUrl,
            webUrl: linkUrl,
          },
        },
      ],
    });
  } else {
    console.error("Kakao SDK가 초기화되지 않았습니다.");
  }
};

onMounted(() => {
  if (!window.Kakao.isInitialized()) {
    console.error("Kakao SDK가 초기화되지 않았습니다.");
  }
});
</script>

<template>
    <button 
        id="kakao-share-btn" 
        class="flex items-center justify-center w-12 h-12 rounded-full bg-[#fee500] shadow-lg transition duration-200 ease-in-out transform hover:scale-105" 
        @click="shareKakao">
      <img 
        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" 
        alt="카카오톡 공유하기" 
        class="w-6 h-6" 
      />
    </button>
</template>