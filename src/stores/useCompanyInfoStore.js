import { defineStore } from 'pinia';
import { getAllMemberList, addMember, editMember, getAllCarList } from "@/api/companyInfoApi.js";

export const useCompanyInfoStore = defineStore('company-info', {
  state: () => ({
    allCustomerList: [], // 客戶列表
    customerTotal: 0, // 客戶列表總數
    allCarList: [], // 車輛列表
  }),
  getters: {
    getAllMemberList() {
      return this.allCustomerList
    },
    getListTotal() {
      return this.customerTotal
    },
    getAllCarList() {
      return this.allCarList
    },
    getAllCarTotal() {
      return this.allCarTotal
    },
  },
  actions: {
    // 客戶列表 or 人事列表
    async fetchAllMember(params) {
      const result = await getAllMemberList(params);
      this.allCustomerList = result.rows;
      this.customerTotal = result.total
    },
    // 新增客戶
    async addMember(data) {
      const result = await addMember(data)
      return result
    },
    // 編輯客戶
    async editMember(data) {
      const result = await editMember(data)
      return result
    },
    // 車輛列表
    async fetchAllCar(params) {
      const result = await getAllCarList(params);
      this.allCarList = result.rows;
      this.allCarTotal = result.total;
    },
  },
});