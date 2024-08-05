<template>
  <a-modal
    v-model:open="open"
    title="分配功能"
    centered
    destroyOnClose
    @ok="handleOk"
    ok-text="保存"
    cancel-text="取消"
  >
    <div class="mt-4 mx-3">
      <a-tree
        v-model:checkedKeys="checkedKeys"
        :defaultExpandAll="true"
        :tree-data="menuItems"
        checkable
      >
        <template #title="{ text }">
          <span>{{ text }}</span>
        </template>
      </a-tree>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { Modal, Tree } from "ant-design-vue";
import { menuItems } from "./data";
import { message } from "ant-design-vue";
import { server } from "@/api";
import { filterNullValues } from "./data";
export default defineComponent({
  components: {
    AModal: Modal,
    ATree: Tree,
  },
  // emits: ["openTips"],
  // _, { emit }
  setup() {
    const open = ref(false);
    const checkedKeys = ref([]); // current checked key list
    const checkedAll = ref(false); // 全選
    const rowData = ref(); // 角色列表data
    const originalCheckedKeys = ref([]); // 儲存原始的checkedKeys
    const wasNewAdd = ref(true); // 判斷是否為第一次更新
    const wasSameList = ref(true); // 判斷勾選的與原始的陣列是否相同
    // 開啟
    function openModal(data) {
      checkedKeys.value = [];
      console.log("openModal", data);
      if (data !== null) {
        // 取得角色對應checked的功能列表
        rowData.value = data;
        const url = `/function/findRoleFunction?UBType=RoleFunctions&UBKeyId=${rowData.value.id}`;
        server.get(url).then((res) => {
          const dataList = res.data[0].children;
          dataList.forEach((data) => {
            if (data.children.length > 0) {
              data.children.forEach((item) => {
                if (item.checked == true) {
                  if (!checkedKeys.value.includes(data.key)) {
                    checkedKeys.value.push(data.key);
                  }
                  checkedKeys.value.push(item.key);
                }
              });
            } else {
              if (data.checked == true) {
                checkedKeys.value.push(data.key);
              }
            }
            wasNewAdd.value = checkedKeys.value.length === 0;
            originalCheckedKeys.value = [...checkedKeys.value];
          });
        });
      }

      open.value = true;
    }

    // 關閉
    function closeModal() {
      open.value = false;
      checkedKeys.value = [];
    }

    // 找出新勾選的項目
    function compareArrays() {
      if (checkedKeys.value.length !== originalCheckedKeys.value.length) {
        wasSameList.value = false;
      }

      for (let i = 0; i < checkedKeys.value.length; i++) {
        if (checkedKeys.value[i] !== originalCheckedKeys.value[i]) {
          wasSameList.value = false;
        }
      }

      if (wasSameList.value == false) {
        // 使用 filter 方法找出不同的元素
        const differences = checkedKeys.value
          .map((item, index) =>
            item !== originalCheckedKeys.value[index] ? item : null
          )
          .filter((item) => item !== null);
        checkedKeys.value = differences;
      }
    }

    // 確認
    // 點擊確認，回傳父層打開操作提示modal並帶入下一步名稱
    function handleOk() {
      compareArrays();
      // 暫時先不用分配按鈕
      // emit("openTips", "分配按鈕");
      // 判斷post or put

      // 移除全選的key 0
      checkedKeys.value = checkedKeys.value.filter((item) => item !== 0);

      const params = {
        // name: rowData.value.name,
        type: "RoleFunctions",
        keyId: rowData.value.id,
        value: checkedKeys.value,
      };
      filterNullValues(params);
      // current與原始checkedKey陣列不同且為第一次新增
      if (!wasSameList.value && wasNewAdd.value) {
        // 串接新增api
        console.log("串接新增api", checkedKeys.value);
        let url = `/userBusiness/add`;

        server
          .post(url, params)
          .then(() => {
            message.success("分配功能成功！");
            open.value = false;
          })
          .catch((error) => {
            console.log("error from add role", error);
          });
      } else if (!wasSameList.value && !wasNewAdd.value) {
        // 編輯角色功能列表
        console.log("串接編輯api", checkedKeys.value);
        let url = `/userBusiness/update`;
        server
          .put(url, params)
          .then(() => {
            message.success("編輯功能成功！");
            open.value = false;
          })
          .catch((error) => {
            console.log("error from add role", error);
          });
      }
      message.success("!?");
    }

    onMounted(() => {
      checkedKeys.value = [];
      console.log("onMounted", checkedKeys.value);
    });

    return {
      open,
      openModal,
      closeModal,
      handleOk,
      menuItems,
      checkedKeys,
      checkedAll,
    };
  },
});
</script>
