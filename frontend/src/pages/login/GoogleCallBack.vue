<script setup>
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import { setLocalStorage } from '@/util/token';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const googleAccessToken = computed(() => route.query.access_token);
const googleRefreshToken = computed(() => route.query.refresh_token);
const memberId = computed(() => route.query.member_id);
const memberIdx = computed(() => route.query.member_idx);
const memberName = computed(() => route.query.member_name);


const imageUrl = computed(() => {
  const imageUrl = JSON.parse(localStorage.getItem('imageUrl') || '{}');
  return imageUrl || 'basic.jpg';
});

onMounted(async () => {
  if (googleAccessToken.value) {
    try {
      authStore.$patch({
        member: {
          memberId: memberId.value,
          memberName: memberName.value,
          memberIdx: memberIdx.value,
          accessToken: googleAccessToken.value,
					imageUrl: imageUrl.value,
        },
      });
			setLocalStorage({
        memberId: memberId.value,
        accessToken: googleAccessToken.value,
        refreshToken: googleRefreshToken.value,
        memberName: memberName.value,
        memberIdx: memberIdx.value,
				imageUrl: imageUrl.value,
      });
			const is_login_flag = authStore.isLogin();

      if (is_login_flag) {
        console.log("로그인 성공");
      } else {
        console.log("로그인 실패");
      }

      authStore.loadAuthState();
      router.push('/');

    } catch (error) {
      console.error('토큰 저장 또는 리다이렉트 중 오류 발생:', error);
    }
  } else {
    console.error("googleAccessToken 값이 없습니다!");
  }
});

</script>

