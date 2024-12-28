import { defineStore } from "pinia";
import apiInstance from "@/util/axios-instance";
import { useAuthStore } from "@/stores/auth.js";


export const useMemberStore = defineStore("memberStore", {
  state: () => ({
    member: {
      memberId:'',
      memberName:'',
      socialType:'',
      birthday:'',
      gender:'',
      email:'',
      imageUrl:'',
    }
  }),

  actions: {
    async getProfile() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.get(`/member/info`, {
          headers: {
            Authorization: authStore.member.accessToken
          },
        });
        this.member = response.data.data;
        return response.data.data;
      } catch (error) {
        console.error('Failed to profile data', error);
        throw error;
      }
    },

    async withdraw() {
      try {
        const authStore = useAuthStore();
        const response = await apiInstance.post(`/member/withdraw`, authStore.member.memberIdx, {
          headers: {
            Authorization: authStore.member.accessToken,
            'Content-Type': 'application/json'
          },
        });
      } catch (error) {
        console.error('Failed to withdraw', error);
      }
    },
  },  
});
