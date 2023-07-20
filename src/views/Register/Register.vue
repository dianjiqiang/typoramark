<template>
  <div class="login">
    <div class="login-card">
      <div class="login-form0" v-if="activeFormIndex === 0">
        <h2 class="title">欢迎注册</h2>
        <div class="form-item">
          <span class="label">用户名</span>
          <el-input
            placeholder="请输入用户名"
            v-model.trim="userForm.name"
          ></el-input>
        </div>
        <div class="form-item">
          <span class="label">密码</span>
          <el-input
            placeholder="请输入密码"
            v-model.trim="userForm.password"
            type="password"
          ></el-input>
        </div>
        <div class="form-item">
          <span class="label">注册码</span>
          <el-input
            placeholder="上版本的口令"
            v-model.trim="userForm.registerCode"
            type="password"
          ></el-input>
        </div>
        <el-button type="danger" @click="handleRegisterBtnClick"
          >注册</el-button
        >
        <span class="no-account">
          <span>已有账户？&nbsp;</span>
          <span @click="handleLoginClick">去登录 &nbsp;</span>
          <span @click="changeActiveForm(1)">使用分享码查看文件</span>
        </span>
      </div>

      <div
        class="login-cover"
        :style="
          activeFormIndex === 0
            ? { marginLeft: '50px' }
            : { marginRight: '50px' }
        "
      >
        <img
          src="@/assets/image/3.jpg"
          alt="cover"
          v-show="activeFormIndex === 0"
        />
        <img
          src="@/assets/image/4.jpg"
          alt="cover"
          v-show="activeFormIndex === 1"
        />
      </div>

      <div class="login-form1" v-if="activeFormIndex === 1">
        <h2 class="title">查看分享</h2>
        <div class="form-item">
          <span class="label">分享码</span>
          <el-input
            placeholder="请输入分享码"
            v-model.trim="userForm.shareCode"
          ></el-input>
        </div>
        <el-button type="danger" @click="handleViewShareClick">确认</el-button>
        <span class="no-account" @click="changeActiveForm(0)">去注册</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import useLoginStore from "@/store/modules/login";
import { useRouter } from "vue-router";

const loginStore = useLoginStore();
const router = useRouter();

// 表单数据
const activeFormIndex = ref(0);
const userForm = reactive({
  name: "",
  password: "",
  registerCode: "",
  shareCode: "",
});

// 切换当前激活的表单
const changeActiveForm = (index: number) => {
  activeFormIndex.value = index;
};

// 处理注册用户和查看分享的点击
const handleRegisterBtnClick = () => {
  const { name, password, registerCode } = userForm;
  if (!name || !password || !registerCode) return;
  const onSuccess = () => {
    router.push("/home");
  };
  loginStore.registerUserAction(name, password, registerCode, onSuccess);
};
const handleViewShareClick = () => {
  const { shareCode } = userForm;
  if (!shareCode) return;
  const onSuccess = () => {
    router.push({
      path: "/home",
      query: { shareCode },
    });
  };
  loginStore.getShareCodeTreeAction(shareCode, onSuccess);
};

// 处理前往登录页
const handleLoginClick = () => {
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  min-width: 680px;
}

.login-card {
  display: inline-flex;
  padding: 30px 50px;
  box-shadow: 0 0 8px 7px #f7f7f7;
  margin-top: 15%;
  border-radius: 8px;
  .login-cover {
    order: 2;
    img {
      width: 260px;
      height: 260px;
    }
  }
  .login-form0,
  .login-form1 {
    order: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .title {
      margin-top: 0;
      color: #333;
    }
  }
  .login-form1 {
    order: 3;
    .no-account {
      align-self: flex-end !important;
      &:hover {
        text-decoration: underline;
        color: #777;
      }
    }
  }
  .form-item {
    display: flex;
    align-items: center;
    .label {
      white-space: nowrap;
      width: 90px;
      color: #333;
      position: relative;
      &::after {
        content: "*";
        display: block;
        position: absolute;
        right: 10px;
        top: 0;
        color: lightcoral;
      }
    }
  }
  .no-account {
    color: #999;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: space-between;
    & > *:not(:first-child):hover {
      text-decoration: underline;
      color: #777;
    }
  }
}
</style>
