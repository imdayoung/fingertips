import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth";

export const useTestStore = defineStore("testStore", {
  state: () => ({
    questions: [],
    types: [],
    selectedType: null,
    options: new Map(),
    impulseScore: 0,
    plannedScore: 0,
    costEffective: 0,
    goodForSatisfaction: 0,
    material: 0,
    experiential: 0,
    birthYear: 0,
    gender: '',
    region: "",
    occupation: "",
  }),
  actions: {
    async fetchQuestions() {
      try {
        const response = await apiInstance.get("/test/questions");
        if (response.data.success) {
          this.questions = response.data.data;
          return response.data.data;
        } else {
          console.error("질문을 가져오는 데 실패했습니다.", response.data.error);
        }
      } catch (error) {
        console.error("질문을 가져오는 중 오류가 발생했습니다:", error.message);
      }
    },
    async fetchOptions(questionIdx) {
      try {
        const response = await apiInstance.get(`/test/options/${questionIdx}`);
        if (response.data.success) {
          this.options.set(questionIdx, response.data.data);
          return response.data.data;
        } else {
          console.error("선택지를 가져오는 중 오류가 발생했습니다:", error.message);
        }
      } catch (error) {
        console.error("선택지를 가져오는 중 오류가 발생했습니다:", error.message);
      }
    },
    async fetchTypes() {
      try {
        const response = await apiInstance.get("/test/types");
        if (response.data.success) {
          this.types = response.data.data;
          return response.data.data;
        } else {
          console.error("데이터 전송 성공", response.data.error);
        }
      } catch (error) {
        console.error("데이터 전송 실패", error.message);
      }
    },

    async saveResult(result) {
      const authStore = useAuthStore();
      const memberIdx = authStore.member.memberIdx || null;
      const typeIdx = result;
      const birthYear = this.birthYear;
      const gender = this.gender;
      const region = this.region;
      const occupation = this.occupation;

      try {
        const response = await apiInstance.post("/test/result", {
          typeIdx: typeIdx,
          memberIdx: memberIdx,
          birthYear: birthYear,
          gender: gender,
          region: region,
          occupation: occupation,
        });
        console.log("데이터 전송 성공:", response.data);
      } catch (error) {
        console.error("데이터 전송 실패:", error);
      }
    },

    async getSurveyInfo() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get("/test/survey", {
          headers: {
            Authorization: authStore.member.accessToken,
          },
        });
        if (response.data.success) {
          return response.data.data;
        } else {
          console.error("정보를 가져오는 데 실패했습니다.", response.data.error);
        }
      } catch (error) {
        console.error("정보를 가져오는 중 오류가 발생했습니다:", error.message);
      }
    },

    async getAdditionalSurveyInfo() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/test/survey/additional-info`, {
          headers: {
            Authorization: authStore.member.accessToken,
          },

        });
        if (response.data.success) {
          this.additionalSurveyInfo = response.data.data;
          return this.additionalSurveyInfo;
        } else {
          console.error("정보를 가져오는 데 실패했습니다.", response.data.error);
          this.error = response.data.error;
        }
      } catch (error) {
        console.error("정보를 가져오는 중 오류가 발생했습니다:", error.message);
        this.error = error.message;
      }
    },

    setRegion(region) {
      this.region = region;
    },
    setOccupation(occupation) {
      this.occupation = occupation;
    },
    setBirthYear(year) {
      this.birthYear = year;
    },
    getBirthYear(year) {
      return this.birthYear = year;
    },
    setGender(gender) {
      this.gender = gender;
    },
    resetInfo() {
      this.birthYear = 0;
      this.gender = '';
    },

    getOptionsByQuestionIdx(questionIdx) {
      return this.options.get(questionIdx) || [];
    },
    resetScore() {
      this.impulseScore = 0;
      this.plannedScore = 0;
      this.costEffective = 0;
      this.goodForSatisfaction = 0;
      this.material = 0;
      this.experiential = 0;
    },
    incrementImpulseScore(value) {
      this.impulseScore += value;
    },
    incrementPlannedScore(value) {
      this.plannedScore += value;
    },
    incrementCostEffective(value) {
      this.costEffective += value;
    },
    incrementGoodForSatisfaction(value) {
      this.goodForSatisfaction += value;
    },
    incrementMaterialScore(value) {
      this.material += value;
    },
    incrementExperientialScore(value) {
      this.experiential += value;
    },
  },
  async fetchOptions(questionIdx) {
    try {
      const response = await apiInstance.get(`/test/options/${questionIdx}`);
      if (response.data.success) {
        this.options.set(questionIdx, response.data.data);
        return response.data.data;
      } else {
        console.error("선택지를 가져오는 중 오류가 발생했습니다:", error.message);
      }
    } catch (error) {
      console.error("선택지를 가져오는 중 오류가 발생했습니다:", error.message);
    }
  },
  async fetchTypes() {
    try {
      const response = await apiInstance.get("/test/types");
      if (response.data.success) {
        this.types = response.data.data;
        return response.data.data;
      } else {
        console.error("데이터 전송 성공", response.data.error);
      }
    } catch (error) {
      console.error("데이터 전송 실패", error.message);
    }
  },

  async saveResult(result) {
    const authStore = useAuthStore();
    const memberIdx = authStore.member.memberIdx || null;
    const typeIdx = result;
    const birthYear = this.birthYear;
    const gender = this.gender;
    const region = this.region;
    const occupation = this.occupation;

    try {
      const response = await apiInstance.post("/test/result", {
        typeIdx: typeIdx,
        memberIdx: memberIdx,
        birthYear: birthYear,
        gender: gender,
        region: region,
        occupation: occupation,
      });
    } catch (error) {
      console.error("데이터 전송 실패:", error);
    }
  },

  async getSurveyInfo() {
    try {
      const authStore = useAuthStore();
      const response = await apiInstance.get(`/test/survey`, {
        headers: {
          Authorization: authStore.member.accessToken,
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("정보를 가져오는 데 실패했습니다.", response.data.error);
      }
    } catch (error) {
      console.error("정보를 가져오는 중 오류가 발생했습니다:", error.message);
    }
  },

  setRegion(region) {
    this.region = region;
  },
  setOccupation(occupation) {
    this.occupation = occupation;
  },
  setBirthYear(year) {
    this.birthYear = year;
  },
  setGender(gender) {
    this.gender = gender;
  },
  resetInfo() {
    this.birthYear = 0;
    this.gender = '';
  },

  getOptionsByQuestionIdx(questionIdx) {
    return this.options.get(questionIdx) || [];
  },

  resetScore() {
    this.impulseScore = 0;
    this.plannedScore = 0;
    this.costEffective = 0;
    this.goodForSatisfaction = 0;
    this.material = 0;
    this.experiential = 0;
  },
  incrementImpulseScore(value) {
    this.impulseScore += value;
  },
  incrementPlannedScore(value) {
    this.plannedScore += value;
  },
  incrementCostEffective(value) {
    this.costEffective += value;
  },
  incrementGoodForSatisfaction(value) {
    this.goodForSatisfaction += value;
  },
  incrementMaterialScore(value) {
    this.material += value;
  },
  incrementExperientialScore(value) {
    this.experiential += value;
  },
});