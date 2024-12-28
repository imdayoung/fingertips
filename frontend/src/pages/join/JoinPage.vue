<script setup>
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const auth = useAuthStore();
const router = useRouter();

const member = reactive({
  memberName: '',
  memberId: '',
  email: '',
  password: '',
  checkPassword: '',
  birthday: '',
  gender: '',
  personalInfoAgreed: false,
  terms: false,
});

const isMemberIdChecked = ref(false);
const passwordsMatch = ref(false);
const passwordStrengthMessage = ref(
  '대소문자, 숫자, 특수문자를 모두 포함한 8글자 이상이어야 합니다.'
);
const allowedDomains = ['gmail.com', 'naver.com', 'daum.net'];
const selectedDomain = ref('');
const directEmail = ref('');
const isDirectInput = ref(false);
const memberIdFail = ref('');
const memberIdSuccess = ref('');
const disableSubmit = ref(true);
const isLoading = ref(false);
const isStrong = ref(false);
const isVerificationCodeSent = ref(false);
const inputCode = ref('');
const isVerifiedEmail = ref(false);
const verificationSuccess = ref('');
const verificationFail = ref('');
const agreeAll = ref(false);
const terms = ref(false);
const privacy = ref(false);

watch(
  () => member,
  (newMember) => {
    disableSubmit.value = !(
      newMember.memberName &&
      newMember.memberId &&
      newMember.email &&
      newMember.password &&
      newMember.checkPassword &&
      newMember.birthday &&
      newMember.gender &&
      newMember.personalInfoAgreed &&
      newMember.terms &&
      isMemberIdChecked.value &&
      isVerifiedEmail.value
    );
  }
);

const checkMemberId = async () => {
  const trimmedMemberId = member.memberId.trim();

  if (!trimmedMemberId) {
    memberIdFail.value = '회원 ID는 공백 없이 입력해야 합니다.';
    memberIdSuccess.value = '';
    return;
  }

  isLoading.value = true;
  try {
    const result = await auth.checkMemberId(trimmedMemberId);
    if (result) {
      memberIdFail.value = '이미 사용 중인 ID입니다.';
      memberIdSuccess.value = '';
      disableSubmit.value = true;
      isMemberIdChecked.value = false;
    } else {
      memberIdSuccess.value = '사용 가능한 ID입니다.';
      memberIdFail.value = '';
      isMemberIdChecked.value = true;
      disableSubmit.value = false;
    }
  } catch (error) {
    alert('ID 중복 확인 중 오류가 발생했습니다.');
    memberIdFail.value = 'ID 확인 중 오류가 발생했습니다.';
    memberIdSuccess.value = '';
    disableSubmit.value = true;
  } finally {
    isLoading.value = false;
  }
};

const checkPasswordsMatch = () => {
  passwordsMatch.value = member.password === member.checkPassword;
};

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
  isStrong.value = enhancedSecurityPassword(member.password);
  if (isStrong.value) {
    passwordStrengthMessage.value = '비밀번호가 강합니다.';
  } else if (member.password.length > 0) {
    passwordStrengthMessage.value = '비밀번호가 약합니다.';
  } else {
    passwordStrengthMessage.value =
      '대소문자, 숫자, 특수문자를 모두 포함한 8글자 이상이어야 합니다.';
  }
};

const handleBirthdayInput = (event) => {
  if (event.target.value.length > 1) {
    event.target.value = event.target.value.slice(0, 1);
  }
};

const handleDomainChange = () => {
  isDirectInput.value = selectedDomain.value === '직접입력';
  if (!isDirectInput.value) {
    member.email = `${member.email.split('@')[0]}@${selectedDomain.value}`;
    directEmail.value = '';
  } else {
    directEmail.value = '';
  }
};

const updateDirectEmail = () => {
  if (isDirectInput.value && !member.email.includes('@')) {
    member.email += '@';
  }
  if (directEmail.value.includes('@')) {
    directEmail.value = directEmail.value.replace('@', '');
  }
  if (isDirectInput.value) {
    member.email = `${member.email.split('@')[0]}@${directEmail.value}`;
  }
};

const sendVerificationCode = async () => {
  if (!member.email) {
    return alert('이메일을 입력해 주세요.');
  }

  try {
    isLoading.value = true;

    const isEmailExists = await auth.checkEmailDuplicate(member.email);
    if (isEmailExists) {
      alert('이미 존재하는 이메일입니다.');
      isLoading.value = false;
      return;
    }

    alert('인증 코드가 발송되었습니다. 이메일을 확인하고 인증 코드를 입력해 주세요.');
    isVerificationCodeSent.value = true;

    const result = await auth.sendEmailVerification(member.email);
    console.log('인증 코드 발송 성공:', result);

    isVerificationCodeSent.value = true;
    alert(
      '인증 코드가 발송되었습니다. 이메일을 확인하고 인증 코드를 입력해 주세요.'
    );
  } catch (error) {
    alert('인증 코드 전송 중 오류가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};

const verifyCode = async () => {
  if (!inputCode.value) {
    return alert('인증 코드를 입력해 주세요.');
  }
  try {
    isLoading.value = true;
    const result = await auth.verifyEmailCode(member.email, inputCode.value);

    if (result) {
      verificationSuccess.value = '이메일 인증이 완료되었습니다.';
      verificationFail.value = '';
      isVerifiedEmail.value = true;
    } else {
      verificationFail.value = '인증 코드가 올바르지 않습니다.';
      verificationSuccess.value = '';
      isVerifiedEmail.value = false;
    }
  } catch (error) {
    alert('인증 코드 확인 중 오류가 발생했습니다.');
    verificationFail.value = '인증 코드 확인 중 오류가 발생했습니다.';
    isVerifiedEmail.value = false;
  } finally {
    isLoading.value = false;
  }
};

const toggleAll = () => {
  terms.value = agreeAll.value;
  privacy.value = agreeAll.value;
  member.terms = agreeAll.value;
  member.personalInfoAgreed = agreeAll.value;
};

const checkAgreeAll = () => {
  if (terms.value && privacy.value) {
    agreeAll.value = true;
  } else {
    agreeAll.value = false;
  }
  member.terms = terms.value;
  member.personalInfoAgreed = privacy.value;
};

const join = async () => {
  if (!isMemberIdChecked.value) {
    return alert('ID 중복 확인을 해 주세요.');
  }
  try {
    isLoading.value = true;
    const result = await auth.checkMemberId(member.memberId);

    if (result) {
      alert(
        '아이디 중복 확인이 필요합니다. \n 회원가입 정보를 다시 확인해 주세요.'
      );
      isLoading.value = false;
      return;
    }
  } catch (error) {
    alert('ID 중복 확인 중 오류가 발생했습니다.');
    console.error('ID 중복 확인 오류:', error);
    isLoading.value = false;
    return;
  }

  if (member.password !== member.checkPassword) {
    return alert('비밀번호가 일치하지 않습니다.');
  }
  if (!isVerifiedEmail.value) {
    return alert('이메일 인증을 완료해 주세요. ');
  }
  if (!member.terms || !member.personalInfoAgreed) {
    return alert('약관에 동의해야 합니다.');
  }

  if (member.gender !== '1' && member.gender !== '2' && member.gender !== '3' && member.gender !== '4') {
    return alert('주민번호 뒷자리 첫째 자리를 정확하게 입력해주세요.');
  }

  try {
    isLoading.value = true;
    (member.gender === '1' || member.gender === '3') ? member.gender = 'male' : member.gender = 'female';

    isLoading.value = true;
    const createResponse = await auth.create(member);
    const loginResponse = await auth.login(member.memberId, member.password);

    if (loginResponse.success) {
        router.push("/");
    }
  } catch (error) {
    alert('회원가입 중 오류가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center font-pretendard-regular">
    <div class="mx-[20%] lg:mx-[32%] px-16 py-10 bg-white border rounded-lg shadow">
      <div class="mb-5 font-bold text-2xl text-customNavy font-jamsil">
        <div>회원가입을 위해</div>
        <div>정보를 입력해주세요</div>
      </div>

      <form @submit.prevent="join">
        <div class="relative mb-6">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'user']" />
          </div>
          <input v-model="member.memberName" type="text" id="memberName"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
            placeholder="이름" required />
        </div>

        <div class="relative flex">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'user']" />
          </div>
          <input v-model="member.memberId" type="text" id="memberId"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
            placeholder="아이디" required />
          <button type="button" class="cursor-pointer w-24 ml-2 px-1 my-2 bg-customNavy text-white rounded-lg text-sm hover:bg-customHover"
            @click="checkMemberId" :disabled="!member.memberId">
            중복 확인
          </button>
        </div>
        <div class="text-sm mb-6">
          <span v-if="memberIdFail" class="text-red-500">{{
            memberIdFail
          }}</span>
          <span v-if="memberIdSuccess" class="text-green-500">{{
            memberIdSuccess
          }}</span>
        </div>

        <div class="relative">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'lock']" />
          </div>
          <input v-model="member.password" type="password" id="password"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
            placeholder="비밀번호" @input="checkPasswordStrength" required />
        </div>
        <div
          :class="[
            'text-sm',
            'mt-1',
            'mb-6',
            isStrong ? 'text-green-500' : 'text-red-500',
          ]"
        >
          {{ passwordStrengthMessage }}
        </div>

        <div class="relative">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'lock']" />
          </div>
          <input v-model="member.checkPassword" type="password" id="checkPassword"
            class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-4"
            placeholder="비밀번호를 다시 입력해주세요." @input="checkPasswordsMatch" required />
        </div>
        <div
          :class="[
            'mb-6',
            'text-sm',
            passwordsMatch ? 'text-green-500' : 'text-red-500',
          ]"
        >
          {{
            passwordsMatch
              ? '비밀번호가 일치합니다.'
              : '비밀번호가 일치하지 않습니다.'
          }}
        </div>

        <div class="mb-6">
          <div class="flex items-center">
            <input
              v-model="member.birthday"
              type="text"
              class="bg-gray border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4"
              id="birthday"
              placeholder="생년월일 6자리"
              maxlength="6"
              required
            />
            <span class="px-2">-</span>
            <input
              v-model="member.gender"
              type="text"
              class="w-11 bg-gray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-4"
              id="gender"
              maxlength="1"
              @input="handleBirthdayInput"
              required
            />
            <span class="px-2">●●●●●●</span>
          </div>
        </div>

        <div class="mb-4 flex flex-col">
          <div class="flex items-center">
            <input v-model="member.email" type="email"
              class="w-72 bg-gray border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 p-4"
              id="email" placeholder="이메일" required />
            <select v-model="selectedDomain" @change="handleDomainChange"
              class="border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 p-3.5">
              <option value="">도메인 선택</option>
              <option
                v-for="domain in allowedDomains"
                :key="domain"
                :value="domain"
              >
                {{ domain }}
              </option>
              <option value="직접입력">직접 입력</option>
            </select>
            <button @click="sendVerificationCode" type="button"
              class="cursor-pointer w-28 ml-2 px-1 my-2 py-3 bg-customNavy text-white rounded-lg text-sm hover:bg-customHover">
              인증 코드 전송
            </button>
          </div>
          <input v-if="isDirectInput" type="text"
            class="mt-2 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="도메인을 입력해 주세요" v-model="directEmail" @input="updateDirectEmail" />
        </div>

        <div v-if="isVerificationCodeSent" class="mt-2">
          <input v-model="inputCode" type="text" placeholder="인증 코드를 입력해 주세요"
            class="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <button @click="verifyCode" type="button" class="cursor-pointer ml-2 my-2 p-3 bg-customNavy text-white rounded-lg text-sm hover:bg-customHover">
            인증 코드 확인
          </button>
          <div v-if="verificationFail" class="text-red-500 text-sm">{{ verificationFail }}</div>
          <div v-if="verificationSuccess" class="text-green-500 text-sm">{{ verificationSuccess }}</div>
        </div>

        <div class="mt-10 mb-5 font-bold text-2xl text-customNavy">약관 동의</div>
        <div class="p-5 mb-6 flex items-center bg-gray-100 rounded-md">
          <input
            id="agreeAll"
            type="checkbox"
            class="mr-3 w-7 h-7"
            v-model="agreeAll"
            @change="toggleAll"
          />
          <div for="agreeAll" class="text-base font-bold">전체 동의</div>
        </div>

        <div class="mb-6">
          <div class="mb-3 flex itmes-center">
            <input
              id="terms"
              type="checkbox"
              class="mr-2 w-6 h-6"
              v-model="terms"
              @change="checkAgreeAll"
            />
            <div for="terms" class="text-base font-semibold">
              이용약관 동의 <span class="text-red-500"> (필수)</span>
            </div>
          </div>
          <div
            class="h-52 overflow-y-scroll border border-gray-300 p-4 rounded-lg text-sm space-y-3"
          >
            <section>
              <div class="font-bold mb-1">제1조(목적)</div>
              <div>
                본 약관은 당사와 이용자 간의 권리, 의무 및 책임 사항을 규정하며,
                당사에서 제공하는 서비스 이용과 관련된 규칙을 명시합니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제2조(정의)</div>
              <div>• “몰”이란 OO 회사가 운영하는 사이버 몰을 의미합니다.</div>
              <div>
                • “이용자”란 몰에 접속하여 약관에 동의하고 서비스를 이용하는
                회원 및 비회원을 말합니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제3조(약관의 명시 및 변경)</div>
              <div>
                당사는 약관을 몰 초기 화면에 명시하여 이용자가 쉽게 알 수 있도록
                하며, 약관을 변경할 경우 최소 7일 전부터 공지합니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제4조(서비스 제공 및 변경)</div>
              <div>• 재화 및 용역에 대한 정보 제공 및 구매 계약의 체결</div>
              <div>• 구매 계약이 체결된 재화 및 용역의 배송</div>
              <div>• 기타 당사가 정하는 업무</div>
            </section>
            <section>
              <div class="font-bold mb-1">제5조(서비스 목적)</div>
              <div>
                본 서비스는 자산 관리 및 소비 분석을 목적으로 하며, 사용자의
                금융 자산 정보를 수집하여 소비 성향을 분석하고, 소비 패턴에 맞는
                챌린지 및 맞춤형 서비스를 제공합니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제6조(사용자의 의무)</div>
              <div>
                • 사용자는 정확한 정보를 제공해야 하며, 타인의 개인정보를 부정
                사용하거나 본 서비스의 기능을 악용하지 않아야 합니다.
              </div>
              <div>
                • 사용자는 서비스 이용 중 제공된 정보를 바탕으로 본인의 자산을
                관리할 책임이 있습니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제7조(서비스 제공자의 의무)</div>
              <div>
                • 당사는 사용자의 개인정보 및 자산 정보를 보호하고, 안정적인
                서비스를 제공할 의무가 있습니다.
              </div>
              <div>
                • 당사는 사용자의 금융 정보가 정확하게 처리되도록 노력하지만,
                제3자 API(은행 API 등)의 문제로 인한 정보 오류에 대해서는
                책임지지 않습니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제8조(로그 수집)</div>
              <div>
                • 당사는 서비스 운영 및 보안을 강화하고, 서비스 최적화를 위해 IP
                주소, 접속 시간, 브라우저 정보 등 사용자의 로그 데이터를
                수집합니다.
              </div>
              <div>
                • 로그 데이터는 서비스 안정성 및 보안 강화를 위해 사용되며, 오류
                분석 및 문제 해결을 위한 데이터로 활용됩니다.
              </div>
              <div>
                • 로그 데이터는 법적 요구에 따라 사법 당국에 제공될 수 있습니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제9조(책임의 한계)</div>
              <div>
                • 당사는 서비스 제공을 위해 노력하나, 사용자 개인의 재정적
                결정에 대해 책임지지 않습니다.
              </div>
              <div>
                • 금융 자산 정보는 제3자 제공(은행 API)에서 수집되며, 해당
                정보의 오류나 지연에 대해 당사는 책임지지 않습니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제10조(개인정보 보호 및 권리)</div>
              <div>
                • 사용자는 언제든지 개인정보에 대한 열람, 정정, 삭제를 요청할 수
                있습니다.
              </div>
              <div>
                • 당사는 사용자의 동의 없이 개인정보를 제3자에게 제공하지
                않습니다.
              </div>
              <div>
                • 로그 정보에 대한 열람 및 삭제는 법적 요구에 따라 처리됩니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제11조(서비스 이용 중단 및 해지)</div>
              <div>
                사용자는 언제든지 서비스 해지를 요청할 수 있으며, 서비스 해지
                후에는 모든 금융 정보 연동이 종료됩니다.
              </div>
            </section>
            <section>
              <div class="font-bold text-sm mb-1">
                제12조(소비 분석 및 챌린지)
              </div>
              <div>
                • 사용자의 소비 패턴에 기반하여 다양한 소비 습관 개선
                프로그램(챌린지)을 제공합니다.
              </div>
              <div>
                • 제공된 데이터 분석을 바탕으로 소비 성향 테스트(MBTI와 유사)를
                진행할 수 있습니다.
              </div>
            </section>
          </div>
        </div>

        <div class="mb-6">
          <div class="mb-3 flex itmes-center">
            <input id="privacy" type="checkbox" class="mr-2 w-6 h-6" v-model="privacy" @change="checkAgreeAll">
            <div for="privacy" class="text-base font-semibold">개인정보 수집 및 이용 동의<span class="text-red-500"> (필수)</span>
            </div>
          </div>
          <div
            class="h-52 overflow-y-scroll border border-gray-300 p-4 rounded-lg text-sm space-y-3"
          >
            <section>
              <div class="font-bold mb-1">제1조(목적)</div>
              <div>이 동의서는 본 서비스가 수집하는 개인정보의 범위, 목적, 보유 기간 등을 명시하며, 개인정보 처리와 관련하여 이용자의 권리 및 의무 사항을 규정하는 것을 목적으로 합니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제2조(수집하는 개인정보 항목)</div>
              <div>
                • 이름, 이메일, 성별, 자산 정보 (은행 API 연동 시 금융 데이터)
              </div>
              <div>
                • IP 주소, 접속 시간, 브라우저 정보, 서비스 이용 기록 등
              </div>
              <div>• 회원 가입 및 본인 인증을 위한 정보</div>
            </section>
            <section>
              <div class="font-bold mb-1">
                제3조(개인정보 수집 및 이용 목적)
              </div>
              <div>• 서비스 이용자 식별 및 본인 확인</div>
              <div>• 자산 관리 및 소비 분석</div>
              <div>• 맞춤형 컨텐츠 제공 및 소비 성향 분석</div>
              <div>• 서비스 최적화 및 보안 강화</div>
              <div>• 법적 요구에 따른 기록 보관</div>
            </section>
            <section>
              <div class="font-bold mb-1">
                제4조(개인정보의 보유 및 이용 기간)
              </div>
              <div>
                수집된 개인정보는 서비스 이용 종료 후 회원 탈퇴 시 5년간
                보관하며, 보관 기간 종료 후 즉시 파기됩니다.
              </div>
            </section>
            <section>
              <div class="font-bold mb-1">제5조(제3자 제공 여부)</div>
              <div>개인정보는 법적 요구 사항 또는 서비스 제공을 위한 외부 서비스 제공 업체(예: 은행 API)와 연동될 수 있으며, 이 경우 이용자의 명시적 동의를 받아 처리됩니다. 동의를 거부할
                권리가 있으며, 거부 시 서비스 이용에 제한이 있을 수 있습니다.</div>
            </section>
          </div>
        </div>

        <button type="submit"
          class="cursor-pointer w-full bg-customNavy text-white py-2 rounded-xl flex justify-center items-center py-5 hover:bg-customHover"
          :disabled="disableSubmit || isLoading || !isMemberIdChecked">
          <span class="ml-2">회원가입 하기</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
[type='checkbox'] {
  accent-color: #0b1573;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
