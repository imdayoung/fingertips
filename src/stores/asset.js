import { defineStore } from 'pinia';
import apiInstance from '@/util/axios-instance';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    allAssetList: [],
    allAccountList: [],
    connectedAccountList: [],
    allCardList: [],
    connectedCardList: [],
  }),
  actions: {
    async getAssetList(memberIdx) {
      try {
        const response = await apiInstance.get(`/asset/${memberIdx}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          },
        });
        this.allAssetList = response.data.data;
        this.allAccountList = this.allAssetList.filter(asset => asset.financeKind === 2);
        this.allCardList = this.allAssetList.filter(asset => asset.financeKind === 1);
        this.connectedAccountList = this.allAccountList.filter(asset => asset.connectedStatus === 1);
        this.connectedCardList = this.allCardList.filter(asset => asset.connectedStatus === 1);
      } catch (error) {
        console.error('Failed to fetch asset list:', error);
        throw error;
      }
    },

    async updateAccountStatus(selectedAccount) {
      try {
        const accountIdx = selectedAccount.prdtId;
        const response = await apiInstance.post(`/asset/account/${accountIdx}`, {}, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          },
        });
        this.connectedAccountList.push(selectedAccount);
        return response.data;
      } catch (error) {
        console.error('Failed to update account status:', error);
        throw error;
      }
    },
    
    async updateCardStatus(selectedCard) {
      try {
        const cardIdx = selectedCard.prdtId;
        const response = await apiInstance.post(`/asset/card/${cardIdx}`, {}, {
          headers: {
            Authorization: localStorage.getItem("accessToken")
          },
        });
        this.connectedCardList.push(selectedCard);
        return response.data;
      } catch (error) {
        console.error('Failed to update card status:', error);
        throw error;
      }
    }
  },
});
