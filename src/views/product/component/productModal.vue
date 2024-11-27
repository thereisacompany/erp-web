<template>
  <a-modal
    v-model:open="open"
    :title="type == 'add' ? '新增商品' : '編輯商品'"
    centered
    @ok="handleOk"
    @cancel="closeModal"
    ok-text="保存"
    cancel-text="取消"
    :width="680"
  >
    <a-form
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      layout="vertical"
      class="mt-3 p-3"
    >
      <a-row style="gap: 15px">
        <a-col :span="7" v-for="item in formItemStatus" :key="item.key">
          <a-form-item
            :label="item.label"
            :rules="[
              {
                required: item.required,
                message:
                  item.key == name
                    ? `請輸入${item.label}`
                    : `請選擇${item.label}`,
              },
            ]"
          >
            <a-switch
              v-if="item.field == 'enabled'"
              v-model:checked="formData[item.field]"
              checked-children="啟用"
              un-checked-children="停用"
            />
            <a-select
              v-else-if="item.field == 'organId'"
              v-model:value="formData[item.field]"
              placeholder="請選擇客戶"
              :options="allCustomerOptions"
              :fieldNames="{
                label: 'supplier',
                value: 'id',
              }"
              option-filter-prop="supplier"
              show-search
            >
            </a-select>
            <a-tree-select
              v-else-if="item.field == 'categoryId'"
              v-model:value="formData[item.field]"
              show-search
              allow-clear
              placeholder="請選擇類別"
              tree-default-expand-all
              tree-node-filter-prop="title"
              :tree-data="allCategoryOptions"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              @change="fetchData"
            >
            </a-tree-select>
            <a-input
              v-else
              v-model:value="formData[item.field]"
              :placeholder="
                item.key == 'number' ? '系統自動產生' : `請輸入${item.label}`
              "
              :disabled="item.key == 'number' || item.key == 'volume'"
              @change="handleChange(item.key)"
            />
            <span v-if="item.key == 'number'" class="note"
              >* 需要手動修改可告知</span
            >
            <span v-else-if="item.key == 'volume'" class="note"
              >* 材積=(長*寬*高)/27826</span
            >
          </a-form-item></a-col
        >
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import {
  Modal,
  Form,
  FormItem,
  Input,
  Switch,
  Select,
  TreeSelect,
  Row,
  Col,
  message,
} from "ant-design-vue";
import { filterNullToEmptyString, assignFilteredKeys } from "@/utils/common";
import { useProductStore } from "@/stores/useProductStore";
import { editProduct, addNewProduct } from "@/api/productApi.js";
import { productFormItem } from "./data";
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
    ATreeSelect: TreeSelect,
    ASwitch: Switch,
  },
  emits: ["reload"],
  setup(_, { emit }) {
    const type = ref();
    const open = ref(false);
    const formItemStatus = reactive(productFormItem);
    const labelCol = { style: { width: "50px" } };
    const wrapperCol = { span: 24 };
    const formData = reactive({
      id: null,
      name: null, //品名
      standard: null, // 規格
      model: null, // 型號
      categoryId: null, // 類別
      length: null, // 長
      width: null, // 寬
      high: null, // 高
      volume: null, // 材積
      number: null, // 品號
      enabled: true, // 狀態
      counter: null, // 儲位
      organId: null, // 客戶
      base: null,
      barcode: null,
    });

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
    const allCategoryOptions = ref([]);
    const allCustomerOptions = ref([]);
    // store
    const productStore = useProductStore();
    const companyInfoStore = useCompanyInfoStore();

    // 開啟modal
    async function openModal(modalType, rowData) {
      open.value = true;
      type.value = modalType;

      if (rowData) {
        // 只留下formData中有的值
        assignFilteredKeys(formData, rowData);
      }
    }

    // 關閉modal
    function closeModal() {
      resetForm();
      open.value = false;
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
      const params = filterNullToEmptyString(formData);
      // 新增類別
      if (type.value == "add") {
        params.id = null;
        result = await addNewProduct(params);
      } else {
        result = await editProduct(params);
      }
      if (result.data.code == 200 && result.data.data.message == "成功") {
        message.success(
          `成功${type.value == "add" ? "新增" : "編輯"}商品： ${params.name}`
        );
        emit("reload");
        closeModal();
      }
    }

    // 計算材積
    function handleChange(field) {
      if (field == "length" || field == "width" || field == "high") {
        const value = Number(formData[field]);
        if (isNaN(value)) {
          message.error("請輸入數字");
        } else {
          const volume =
            (formData.length * formData.width * formData.high) / 27826;
          formData.volume = parseFloat(volume.toFixed(3));
        }
      }
    }

    onMounted(async () => {
      // 全部類別 下拉選單
      await productStore.fetchProductCategory();
      allCategoryOptions.value = productStore.getProductCategoryList;

      // 全部客戶 下拉選單
      const customerParams = {
        currentPage: 1,
        pageSize: 1000,
        type: '{"type":"客戶"}',
      };
      await companyInfoStore.fetchAllCustomer(customerParams);
      allCustomerOptions.value = companyInfoStore.getAllCustomerList;
      // await getAllCustomerList(customerParams).then((result) => {
      //   allCustomerOptions.value = result;
      // });
      console.log("onMounted");
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
      allCategoryOptions,
      allCustomerOptions,
      handleChange,
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
</style>



