<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useMemberStore } from '@/stores/member.js';
import apiInstance from '@/util/axios-instance';
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const memberStore = useMemberStore();

const profile = reactive({
  memberId: '',
  memberName: '',
  socialType: '',
  email: '',
  birthday: '',
  imageUrl: '',
});

const router = useRouter();
const isSocialLogin = ref(false);
const selectedImage = ref(null);

const password = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const isPasswordStrong = ref(false);
const isPasswordVerified = ref(false);
const isPasswordMatch = ref(false);
const isVerificationCodeSent = ref(false);
const inputCode = ref('');
const isVerifiedEmail = ref(false);
const isEmailChanged = ref(false);

onMounted(async () => {
  await fetchProfile();
});

const fetchProfile = async () => {
  try {
    const profileData = await memberStore.getProfile();
    profile.memberId = profileData.memberId;
    profile.memberName = profileData.memberName;
    profile.birthday = profileData.birthday;
    profile.socialType = profileData.socialType;
    profile.email = profileData.email;
    const imageUrl = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${profileData.imageUrl}`;
    profile.imageUrl = imageUrl;
    if (profile.socialType === 'GOOGLE') {
      isSocialLogin.value = true;
    }
  } catch (error) {
    console.error(error);
    alert('프로필 정보를 불러오는 중 오류가 발생했습니다.');
  }
};

const formattedBirthDay = computed(() => {
  if (!profile.birthday) return '';
  const date = new Date(profile.birthday);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const enhancedSecurityPassword = (password) => {
  const minLength = 8;
  const specialChars = /[~!@#$%^&*]/;
  const upperCase = /[A-Z]/;
  const lowerCase = /[a-z]/;

  return (
    password.length >= minLength &&
    specialChars.test(password) &&
    upperCase.test(password) &&
    lowerCase.test(password)
  );
};

const checkPasswordStrength = () => {
  if (enhancedSecurityPassword(newPassword.value)) {
    isPasswordStrong.value = true;
  } else {
    isPasswordStrong.value = false;
  }
};

const checkPasswordConfirmation = () => {
  if (newPassword.value === confirmNewPassword.value) {
    isPasswordMatch.value = true;
  } else {
    isPasswordMatch.value = false;
  }
};

const verifyPassword = async () => {
  if (!password.value) {
    return alert('비밀번호를 입력해주세요.');
  }

  try {
    const response = await apiInstance.post('/member/verification/password',
      {
        inputPassword: password.value,
      },
      {
        headers: {
          Authorization: authStore.member.accessToken,
        },
      }
    );

    if (response.data.success) {
      isPasswordVerified.value = true;
    } else {
      alert('기존 비밀번호와 일치하지 않습니다.');
    }
  } catch (error) {
    alert('기존 비밀번호와 일치하지 않습니다.');
  }
};

const changePassword = async () => {
  try {
    const response = await apiInstance.post(
      '/member/verification/newPassword',
      {
        memberId: authStore.member.memberId,
        newPassword: newPassword.value,
      },
      {
        headers: {
          Authorization: authStore.member.accessToken,
        },
      }
    );
    if (response.data.success) {
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } else {
      alert('이전과 같은 비밀번호는 사용하실 수 없습니다.');
    }
  } catch (error) {
    alert('이전과 같은 비밀번호는 사용하실 수 없습니다.');
  }
};

const sendVerificationCode = async () => {
  if (!profile.email) {
    return alert('이메일을 입력해 주세요.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profile.email)) {
    return alert(
      '유효하지 않은 이메일 형식입니다. 올바른 이메일을 입력해 주세요.'
    );
  }
  try {
    const isEmailExists = await authStore.checkEmailDuplicate(profile.email);
    if (isEmailExists) {
      alert('이미 존재하는 이메일입니다.');
      return;
    }
    console.log('이메일 중복이 없음. 인증 코드 발송 시도.');
    const result = await authStore.sendEmailVerification(profile.email);
    console.log('인증 코드 발송 성공:', result);
    isVerificationCodeSent.value = true;
    alert('인증 코드가 해당 이메일로 발송되었습니다. 인증 코드를 입력해 이메일 변경을 완료해주세요.');
  } catch (error) {
    alert('인증 코드 전송 중 오류가 발생했습니다.');
  }
};

const verifyCode = async () => {
  if (!inputCode.value) {
    return alert('인증 코드를 입력해 주세요.');
  }
  try {
    const result = await authStore.verifyEmailCode(profile.email, inputCode.value);
    if (result) {
      saveEmail();
      return alert('이메일이 변경되었습니다.');
    } else {
      return alert('인증 코드가 올바르지 않습니다.');
    }
  } catch(err) {
    console.error(err);
    return alert('인증 코드가 올바르지 않습니다.');
  }
};

const saveEmail = async () => {
  try {
    const authStore = useAuthStore();
    const response = await apiInstance.post('/member/email',
      {
        newEmail: profile.email,
      },
      {
        headers: {
          Authorization: authStore.member.accessToken,
        },
      }
    );

    if (response.data.success) {
      isEmailChanged.value = true;
      alert('이메일이 성공적으로 변경되었습니다.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      alert('이메일 변경에 실패하였습니다.');
    }
  } catch (error) {
    console.error('이메일 변경 중 오류 발생:', error);
    alert('이메일 변경 중 오류가 발생했습니다.');
  }
};

const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert('이미지를 선택해주세요.');
    return;
  }
  selectedImage.value = file;
  const previewUrl = URL.createObjectURL(file);
  profile.imageUrl = previewUrl;
  const formData = new FormData();
  formData.append('file', selectedImage.value);
  try {
    const authStore = useAuthStore();
    const response = await apiInstance.post(`/member/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: authStore.member.accessToken,
      },
    });

    if (response.data.success) {
      alert('이미지 업로드에 성공했습니다.');
      const imageUrl = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${response.data.data.storeFileName}`;
      profile.imageUrl = imageUrl;
     
      authStore.updateImageUrl(response.data.data.storeFileName)
      Object.assign(profile, { imageUrl: imageUrl });
      await fetchProfile();
    }
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    alert('이미지 업로드에 실패하셨습니다.');
  }
};

const deleteImage = async (profileImage) => {
  const confirmed = window.confirm("정말 삭제하시겠습니까? 기본 이미지로 변경됩니다.");
  if (confirmed) {
    try {
      const authStore = useAuthStore();
      const response = await apiInstance.delete(`/member/image`, {
        params: {
          fileUrl: profileImage,
        },
        headers: {
          Authorization: authStore.member.accessToken,
        },
      });
      if (response.data.success) {
        profile.imageUrl = 'upload-image/basic.jpg';
        authStore.updateImageUrl("upload-image/basic.jpg")
        await fetchProfile();
      }
    } catch (error) {
      console.error('파일 삭제 실패');
    }
  }
};
const withdraw = async () => {
  const confirmed = window.confirm("정말 탈퇴하시겠습니까?");

  if (confirmed) {
    try {
      await memberStore.withdraw();
      await authStore.logout();
      authStore.clearAuthState();
      localStorage.clear(); 
      router.push('/');
    } catch (err) {
      console.error('탈퇴 처리 중 오류 발생: ', erorr);
    }
  }
}
</script>

<template>
  <div class="mx-[20%] lg:mx-[32%] font-pretendard-regular">
    <div class="p-10 bg-white border rounded-xl shadow">
      <div class="mb-5 font-bold text-2xl text-customNavy font-jamsil">
        <div>나만의 프로필을</div>
        <div>완성해보세요</div>
      </div>

      <div class="px-5">
      <div class="flex flex-col items-center space-y-4 mb-6">
          <img :src="profile.imageUrl" alt="P" class="w-32 h-32 rounded-full" />
          <div class="flex space-x-3">
            <button class="bg-customNavy text-white text-xs py-2 px-3 rounded-lg" @click="() => $refs.profileImageInput.click()">
              변경
            </button>
            <button class="bg-gray-300 text-xs py-2 px-3 rounded-lg" @click="deleteImage(profile.imageUrl)"
              :disabled="profile.imageUrl === 'https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/basic.jpg'">
              삭제
            </button>
          </div>
          
        <input type="file" @change="uploadImage" class="hidden" ref="profileImageInput" />
      </div>

      <div class="flex items-center mb-6">
        <div class="w-1/4 text-end mr-10">이름</div>
        <div class="w-3/4">
          <input v-model="profile.memberName" type="text"
            class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 w-full p-4"
            readonly />
        </div>
      </div>

      <div class="flex items-center mb-6">
        <div class="w-1/4 text-end mr-10">아이디</div>
        <div class="w-3/4">
          <input v-model="profile.memberId" type="text"
            class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 w-full p-4"
            :disabled="isSocialLogin"
            readonly />
        </div>
      </div>

      <div class="flex items-center mb-6">
        <div class="w-1/4 text-end mr-10">현재 비밀번호</div>
        <div class="w-3/4 flex justify-between">
          <input v-model="password" type="password"
            class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-4 w-full mr-3 disabled:bg-gray-100"
            :disabled="isSocialLogin" />
          <button @click.prevent="verifyPassword"
            class="w-16 min-w-16 text-center my-1 py-3 px-4 bg-customNavy text-white rounded-xl text-sm disabled:bg-gray-300"
            :disabled="isSocialLogin">
            확인
          </button>
        </div>
      </div>

      <div v-if="isPasswordVerified" >
        <div class="flex items-center mb-6">
          <div class="w-1/4 text-end mr-10">
            <div>새 비밀번호</div>
            <div>&nbsp;</div>
          </div>
          <div class="w-3/4">
            <div>
              <input v-model="newPassword" type="password" autocomplete="new-password" id="newPassword"
              class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-4 w-full mr-3"
              placeholder="새 비밀번호를 입력해주세요." @input="checkPasswordStrength" required />
            </div>
            <div class="text-sm">
              <p v-if="isPasswordStrong === true" class="text-green-500">
                비밀번호가 강합니다.
              </p>
              <p v-else-if="isPasswordStrong == false && newPassword.length > 0" class="text-red-500">비밀번호가 약합니다.</p>
              <p v-else-if="isPasswordStrong == false && newPassword.length === 0" class="text-red-500">대소문자, 숫자, 특수문자를 모두 포함한 8글자 이상이어야 합니다.</p>
            </div>
          </div>
        </div>

        <div class="flex items-center mb-6">
          <div class="w-1/4 text-end mr-10">
            <div>비밀번호 확인</div>
            <div v-if="isPasswordMatch || confirmNewPassword.length > 0">&nbsp;</div>
          </div>
          <div class="w-3/4">
            <div class="flex justify-between">
              <input v-model="confirmNewPassword" type="password" autocomplete="new-password" id="confirmNewPassword"
                class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-4 w-full mr-3"
                placeholder="새 비밀번호를 다시 입력해주세요." @input="checkPasswordConfirmation" />
              <button @click="changePassword" class="w-16 min-w-16 text-center items-center my-1 py-3 px-4 bg-customNavy text-white rounded-xl text-sm"
                :disabled="!isPasswordStrong || newPassword !== confirmNewPassword">
                변경
              </button>
            </div>
            <div class="text-sm">
              <p v-if="isPasswordMatch === true" class="text-green-500">비밀번호가 일치합니다.</p>
              <p v-else-if="isPasswordMatch === false && confirmNewPassword.length > 0" class="text-red-500">비밀번호가 일치하지 않습니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center mb-6">
        <div class="w-1/4 text-end mr-10">생년월일</div>
        <div class="w-3/4">
          <input :value="formattedBirthDay" type="date"
            class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 w-full p-4"
            readonly />
        </div>
      </div>

      <div class="flex items-center mb-6">
        <div class="w-1/4 text-end mr-10">이메일</div>
        <div class="w-3/4 flex justify-between">
          <input v-model="profile.email" type="text"
            class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-4 w-full mr-3 disabled:bg-gray-100"
            :disabled="isSocialLogin"
            placeholder="이메일" />
          <button @click.prevent="sendVerificationCode"
            class="w-16 min-w-16 text-center my-1 py-3 px-4 bg-customNavy text-white rounded-xl text-sm disabled:bg-gray-300"
            :disabled="isSocialLogin">
            변경
          </button>
        </div>
      </div>

      <div v-if="isVerificationCodeSent">
        <div class="flex items-center mb-6">
          <div class="w-1/4 text-end mr-10">인증 코드</div>
          <div class="w-3/4 flex justify-between">
            <input v-model="inputCode" type="text" placeholder="인증 코드를 입력해 주세요"
              class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-4 w-full mr-3" />
            <button @click="verifyCode"
              class="w-16 min-w-16 text-center my-1 py-3 px-4 bg-customNavy text-white rounded-xl text-sm"
              :disabled="isVerifiedEmail">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <div class="mx-auto text-center mt-4">
      <div class="p-3 bg-customNavy text-white rounded-lg">
        <router-link to="/mypage/asset">연결된 자산 보기</router-link>
      </div>
      <button @click="withdraw" class="my-5 underline text-gray-500">탈퇴하기</button>
    </div>
  </div>
</template>

<style scoped>

</style>
