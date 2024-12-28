<!-- 新版商品管理 modal-->
<template>
  <a-modal
    v-model:open="open"
    :title="type == 'add' ? '新增車輛' : '編輯車輛'"
    centered
    @ok="handleOk"
    @cancel="closeModal"
    ok-text="保存"
    cancel-text="取消"
    :width="920"
    destroyOnClose
  >
    <a-form
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      layout="vertical"
      class="mt-3 p-3"
    >
      <a-row :gutter="[16, 0]">
        <a-col :span="item.span" v-for="item in formItemStatus" :key="item.key">
          <a-form-item
            v-if="showForm(item.field)"
            :label="item.label"
            :rules="[
              {
                required: item.required,
                message: `請輸入${item.label}`,
              },
            ]"
          >
            <a-select
              v-if="item.field == 'driver'"
              v-model:value="formData[item.field]"
              placeholder="請選擇"
              :options="driverList"
              show-search
              option-filter-prop="supplier"
              :fieldNames="{
                label: 'supplier',
                value: 'id',
              }"
            >
            </a-select>

            <a-select
              v-else-if="item.field == 'status' || item.field == 'ownership'"
              v-model:value="formData[item.field]"
              placeholder="請選擇"
              :options="
                item.field == 'status'
                  ? cartModalStatusOption
                  : cartModalOwnerOption
              "
            >
            </a-select>

            <a-date-picker
              v-else-if="item.showDataPicker"
              v-model:value="rawDate[item.field]"
              format="YYYY-MM-DD"
              :locale="locale"
            />

            <a-input
              v-else-if="item.field !== 'file'"
              v-model:value="formData[item.field]"
              :placeholder="`請輸入${item.label}`"
            /> </a-form-item
        ></a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import {
  Modal,
  Form,
  FormItem,
  Input,
  Row,
  Col,
  message,
  Select,
  DatePicker,
} from "ant-design-vue";
import { filterNullToEmptyString, assignFilteredKeys } from "@/utils/common";
import {
  carFormItem,
  cartModalStatusOption,
  cartModalOwnerOption,
} from "./data";
import { addNewCar, updateCarInfo } from "@/api/companyInfoApi.js";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
import dayjs, { Dayjs } from "dayjs";
import { useCompanyInfoStore } from "@/stores/useCompanyInfoStore";

export default defineComponent({
  components: {
    ARow: Row,
    ACol: Col,
    AModal: Modal,
    AForm: Form,
    AFormItem: FormItem,
    AInput: Input,
    ASelect: Select,
    ADatePicker: DatePicker,
  },
  emits: ["reload"],
  setup(_, { emit }) {
    const type = ref();
    const open = ref(false);
    const formItemStatus = reactive(carFormItem);
    const labelCol = { style: { width: "100px" } };
    const wrapperCol = { span: 24 };
    const formData = reactive({
      id: null,
      licensePlateNumber: null, // 車牌號碼
      brandModel: null, // 品牌型號
      driver: null, // 司機
      color: null, // 車身顏色
      mileage: null, // 里程數(公里)
      engineNumber: null, // 引擎號碼
      manufacture: null, // 出廠日期
      testDate: null, // 驗車日
      insuranceDate: null, // 保險日期
      insuranceDateEnd: null, // 車險迄止日
      takeOver: null, // 車輛接手日
      loanDue: null, // 貸款到期日
      contractExpired: null, // 司機合約到期日
      renewalDate: null, // 補換照日(行照)
      licenseValid: null, // 行照有效日
      cargoInsuranceDue: null, // 貨物險到期日
      emissions: null, // 排放量(c.c.)
      price: null, // 車價
      status: null, // 車輛狀態
      ownership: null, // 歸屬
      remark: null, // 備註
    });
    // 用來存儲原始日期對象
    const rawDate = reactive({});
    // store
    const companyInfoStore = useCompanyInfoStore();
    // 上傳檔案大小限制
    const fileSizeLimit = ref(null);
    const isUpload = ref(false);
    const driverList = ref();
    // 車輛類型選擇司機或師傅才顯示帳號密碼欄位
    const showForm = (field) => {
      let show = true;
      if (field == "loginName" || field == "loginPassword") {
        show = formData.type == "家電-司機" || formData.type == "冷氣-師傅";
      }
      return show;
    };

    // 開啟modal
    async function openModal(modalType, rowData) {
      open.value = true;
      type.value = modalType;

      if (rowData) {
        // 只留下formData中有的值
        assignFilteredKeys(formData, rowData);
        carFormItem.forEach((item) => {
          if (item.showDataPicker) {
            rawDate[item.key] = formData[item.key]
              ? dayjs(formData[item.key])
              : null;
          }
        });

        console.log("rawDate", rawDate);
        formData.status = formData.status == 0 ? null : formData.status;
        formData.ownership =
          formData.ownership == 0 ? null : formData.ownership;
      }

      console.log("formData", formData);
    }

    // 關閉modal
    function closeModal() {
      resetForm();
      open.value = false;
      console.log("關閉modal");
    }

    // 重置欄位
    function resetForm() {
      Object.keys(formData).forEach((key) => {
        formData[key] = null;
      });
    }

    // 確認
    async function handleOk() {
      let result = {};
      const data = filterNullToEmptyString(formData);
      // 新增類別
      if (type.value == "add") {
        data.id = 0;
        data.supplierall = data.supplier;
        result = await addNewCar(data);
      } else {
        result = await updateCarInfo(data);
      }
      if (result.data.code == 200 && result.data.data.message == "成功") {
        message.success(
          `成功${type.value == "add" ? "新增" : "編輯"}車輛成功： ${
            data.driver
          }`
        );

        emit("reload");
        isUpload.value = false;
        closeModal();
      } else {
        message.error(result.data.data.message);
        isUpload.value = false;
        closeModal();
      }
    }

    // 動態監聽 rawDate[item.field]，自動同步為格式化字串到 formData
    watch(
      rawDate,
      (newValues) => {
        for (const field in newValues) {
          const rawValue = newValues[field];
          formData[field] = rawValue
            ? dayjs(rawValue).format("YYYY-MM-DD")
            : null;
        }
      },
      { deep: true } // 深度監控
    );

    onMounted(async () => {
      const params = {
        currentPage: 1,
        pageSize: 1000,
        filter: JSON.stringify({ type: "家電-司機" }),
      };
      await companyInfoStore.fetchAllMember(params);
      const result = companyInfoStore.getAllMemberList;
      driverList.value = result;
    });

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      formData,
      labelCol,
      wrapperCol,
      type,
      formItemStatus,
      showForm,
      locale,
      fileSizeLimit,
      Dayjs,
      rawDate,
      cartModalStatusOption,
      cartModalOwnerOption,
      driverList,
    };
  },
});
</script>
<style lang="scss" scoped>
.note {
  margin-left: 8px;
  font-size: 12px;
  color: #74788d;
}

:deep(.ant-picker) {
  width: 100%;
}
</style>



