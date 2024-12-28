<!-- 新版商品管理 modal-->
<template>
  <a-modal
    v-model:open="open"
    :title="type == 'add' ? '新增人事' : '編輯人事'"
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
              v-if="item.field == 'type'"
              v-model:value="formData[item.field]"
              placeholder="請選擇"
              :options="typeOptions(false)"
              :field-names="{
                label: 'type',
                value: 'value',
              }"
            >
            </a-select>

            <a-date-picker
              v-else-if="item.showDataPicker"
              v-model:value="rawDate[item.field]"
              format="YYYY-MM-DD"
              :locale="locale"
              :disabled-date="(current) => disableDates(item.field, current)"
            />

            <a-switch
              v-else-if="item.field == 'enabled'"
              v-model:checked="formData[item.field]"
              checked-children="啟用"
              un-checked-children="停用"
            />

            <a-input
              v-else-if="item.field !== 'file'"
              v-model:value="formData[item.field]"
              :placeholder="`請輸入${item.label}`"
            />

            <div v-if="item.field == 'file'" class="d-flex flex-column gap-1">
              <span class="text-danger">
                {{ `最大檔案大小: ${fileSizeLimit} MB` }}
              </span>
              <UploadPicture
                :fileSource="formData.license"
                @uploadSuccess="setLicenseFile"
              />
            </div> </a-form-item
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
  Switch,
  Row,
  Col,
  message,
  Select,
  DatePicker,
} from "ant-design-vue";
import { filterNullToEmptyString, assignFilteredKeys } from "@/utils/common";
import { memberFormItem, typeOptions } from "./data";
import { useCompanyInfoStore } from "@/stores/useCompanyInfoStore";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
import UploadPicture from "@/components/UploadPicture.vue";
import { getUploadFileSizeLimit } from "@/api/commonApi";
import dayjs, { Dayjs } from "dayjs";
export default defineComponent({
  components: {
    ARow: Row,
    ACol: Col,
    AModal: Modal,
    AForm: Form,
    AFormItem: FormItem,
    AInput: Input,
    ASwitch: Switch,
    ASelect: Select,
    ADatePicker: DatePicker,
    UploadPicture,
  },
  emits: ["reload"],
  setup(_, { emit }) {
    const type = ref();
    const open = ref(false);
    const formItemStatus = reactive(memberFormItem);
    const labelCol = { style: { width: "100px" } };
    const wrapperCol = { span: 24 };
    const formData = reactive({
      id: null,
      type: null, // 類別
      idNumber: null, // 身分證字號
      supplier: null, // 姓名
      supplierall: null, // 姓名
      loginName: null, // 登入帳號
      loginPassword: null, // 登入密碼
      telephone: null, // 手機號碼
      phoneNum: null, // 聯絡電話
      email: null, // 電子信箱
      address: null, // 地址
      licensePlate: null, // 車牌號碼
      contacts: null, // 緊急聯絡人
      emergencyPhone: null, // 緊急聯絡人電話
      groupInsuranceStart: null, // 團保加保日
      groupInsuranceEnd: null, // 團保退保日
      laborHealthInsuranceStart: null, // 勞健保加保日
      laborHealthInsuranceEnd: null, // 勞健保退保日
      onboarding: null, // 入職日
      resign: null, // 離職日
      birthday: null, // 出生年月日
      enabled: true, // 狀態
      license: "",
    });
    // 用來存儲原始日期對象
    const rawDate = reactive({});
    const enabledOptions = reactive([
      {
        value: "啟用",
        label: "enabled",
      },
      {
        value: "停用",
        label: "disabled",
      },
    ]);
    // 上傳檔案大小限制
    const fileSizeLimit = ref(null);
    const isUpload = ref(false);
    // store
    const companyInfoStore = useCompanyInfoStore();

    // 人事類型選擇司機或師傅才顯示帳號密碼欄位
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
        console.log("formData.license0", formData.license);
        rawDate.onboarding = formData.onboarding
          ? dayjs(formData.onboarding)
          : null;
        rawDate.resign = formData.resign ? dayjs(formData.resign) : null;
        rawDate.groupInsuranceStart = formData.groupInsuranceStart
          ? dayjs(formData.groupInsuranceStart)
          : null;
        rawDate.groupInsuranceEnd = formData.groupInsuranceEnd
          ? dayjs(formData.groupInsuranceEnd)
          : null;
        rawDate.laborHealthInsuranceStart = formData.laborHealthInsuranceStart
          ? dayjs(formData.laborHealthInsuranceStart)
          : null;
        rawDate.laborHealthInsuranceEnd = formData.laborHealthInsuranceEnd
          ? dayjs(formData.laborHealthInsuranceEnd)
          : null;
      }
    }

    // 關閉modal
    function closeModal() {
      if (isUpload.value) {
        message.warning("已有上傳新檔案，請點擊保存按鈕");
        open.value = true;
      } else {
        resetForm();
        open.value = false;
      }
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
        result = await companyInfoStore.addMember(data);
      } else {
        result = await companyInfoStore.editMember(data);
      }
      if (result.data.code == 200 && result.data.data.message == "成功") {
        message.success(
          `成功${type.value == "add" ? "新增" : "編輯"}人事成功： ${
            data.supplier
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

    // 動態設置禁用日期
    const disableDates = (field, current) => {
      if (!current) return false;

      let relatedDate = null;
      // 離職日
      if (field == "resign") {
        // 獲取相關日期字段
        relatedDate = dayjs(formData.onboarding);
        return current.isBefore(relatedDate, "day");
      }

      // 團保退保日
      if (field == "groupInsuranceEnd") {
        // 獲取相關日期字段
        relatedDate = dayjs(formData.groupInsuranceStart);
        return current.isBefore(relatedDate, "day");
      }

      // 勞健保退保日
      if (field == "laborHealthInsuranceEnd") {
        // 獲取相關日期字段
        relatedDate = dayjs(formData.laborHealthInsuranceStart);
        return current.isBefore(relatedDate, "day");
      }

      // 默認不禁用
      return false;
    };

    // 上傳檔案完成
    function setLicenseFile(data) {
      console.log("setLicenseFile data", data);
      if (data) {
        console.log("formData.license1", formData.license);
        if (formData.license == "") formData.license = data;
        else formData.license = formData.license + "," + data;
        isUpload.value = true;
      }

      console.log("formData.license", formData.license);
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

    onMounted(() => {
      getUploadFileSizeLimit()
        .then((res) => {
          if (res) {
            fileSizeLimit.value = Math.floor(res / 1024 / 1024);
          }
        })
        .catch((error) => {
          console.error("取得檔案大小限制失敗", error);
        });
    });

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      formData,
      labelCol,
      wrapperCol,
      enabledOptions,
      type,
      formItemStatus,
      typeOptions,
      showForm,
      locale,
      fileSizeLimit,
      Dayjs,
      disableDates,
      setLicenseFile,
      rawDate,
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



