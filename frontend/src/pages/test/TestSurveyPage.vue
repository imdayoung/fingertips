<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";

const router = useRouter();
const testStore = useTestStore();

const birthYear = ref(null);
const gender = ref(null);
const region = ref("");
const occupation = ref("");

const years = Array.from(
  { length: 100 },
  (v, i) => new Date().getFullYear() - i
);
const genderOptions = ["남성", "여성"];

const selectGender = (option) => {
  gender.value = option;
};

const goToQuestions = () => {
  if (gender.value === "여성") {
    gender.value = "female";
  } else {
    gender.value = "male";
  }
  testStore.setBirthYear(birthYear.value);
  testStore.setGender(gender.value);
  testStore.setRegion(region.value);
  testStore.setOccupation(occupation.value);

  router.push({ name: "testQuestion", params: { number: 1 } });
};

const onScroll = (event) => {
  const scrollPosition = event.target.scrollTop;
  const itemHeight = 40;
  const index = Math.round(scrollPosition / itemHeight);
  birthYear.value = years[index];
};

const selectYear = (year, index) => {
  birthYear.value = year;
  const itemHeight = 40;
  const wheel = document.querySelector(".wheel");
  wheel.scrollTo({
    top: index * itemHeight,
    behavior: "smooth",
  });
};

onMounted(() => {
  console.log("Birth Year:", testStore.birthYear);
  console.log("Gender:", testStore.gender);
});
</script>

<template>
  <div class="survey-container gong-gothic-font">
    <div class="question" v-if="!testStore.birthYear">
      <label class="text-2xl">당신이 태어난 연도는?</label>
      <div class="wheel-picker">
        <div class="wheel" @scroll="onScroll" ref="wheel">
          <ul>
            <li class="spacer"></li>
            <li
              v-for="(year, index) in years"
              :key="year"
              :class="{ active: birthYear === year }"
              @click="selectYear(year, index)"
            >
              {{ year }}
            </li>
            <li class="spacer"></li>
          </ul>
        </div>
      </div>
    </div>
    <br />
    <div class="question gong-gothic-font" v-if="!testStore.gender">
      <label class="text-2xl">당신의 성별은?</label>
      <br />
      <div class="gender-options">
        <button
          class="custom-shadow gong-gothic-font bg-white text-gray-500 font-medium py-4 px-6 rounded-xl text-l transition duration-300 transform hover:scale-105 w-[100px]"
          v-for="(option, index) in genderOptions"
          :key="index"
          :class="{ selected: gender === option }"
          @click="selectGender(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>
    <br />
    <div class="question gong-gothic-font">
      <label class="text-2xl">당신의 거주지는? ('구'까지 입력)</label>

      <input
        v-model="region"
        type="text"
        placeholder="거주지 입력"
        class="custom-shadow gong-gothic-font bg-white text-gray-500 font-medium py-4 px-6 rounded-xl text-l transition duration-300 transform hover:scale-105 w-[300px]"
      />
    </div>
    <br />
    <div class="question gong-gothic-font">
      <label class="text-2xl">당신의 직업은?</label>

      <input
        v-model="occupation"
        type="text"
        placeholder="직업 입력"
        class="custom-shadow gong-gothic-font bg-white text-gray-500 font-medium py-4 px-6 rounded-xl text-l transition duration-300 transform hover:scale-105 w-[300px]"
      />
    </div>
    <br />
    <button
      class="custom-shadow gong-gothic-font bg-white text-gray-500 font-medium py-4 px-6 rounded-xl text-l transition duration-300 transform hover:scale-105 w-[200px]"
      @click="goToQuestions"
    >
      다음
    </button>
  </div>
</template>

<style>
.survey-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.question {
  margin-bottom: 30px;
}

label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.wheel-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 150px;
  width: 100px;
  margin: 0 auto;
}

.wheel {
  height: 120px;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.wheel::-webkit-scrollbar {
  display: none;
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
  text-align: center;
}

li {
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  color: #999;
  scroll-snap-align: center;
  cursor: pointer;
}

li.active {
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.spacer {
  height: 40px;
}

.gender-options button {
  font-size: 18px;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #eee;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.gender-options button.selected {
  background-color: #333;
  color: #fff;
}

.next-button {
  font-size: 18px;
  padding: 10px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.next-button:hover {
  background-color: #555;
}

@font-face {
  font-family: "GongGothicMedium";
  src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicMedium.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}

.gong-gothic-font {
  font-family: "GongGothicMedium", sans-serif;
}
</style>
