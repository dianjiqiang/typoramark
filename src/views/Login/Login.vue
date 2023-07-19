<template>
  <div class="login">
    <div class="login-card">
      <div class="login-form0" v-if="activeFormIndex === 0">
        <h2 class="title">欢迎登录</h2>
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
        <el-button @click="handleLoginBtnClick">登录</el-button>
        <span class="no-account" @click="changeActiveForm(1)"
          >没有账户？使用分享码查看文件</span
        >
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
          src="@/assets/image/1.jpg"
          alt="cover"
          v-show="activeFormIndex === 0"
        />
        <img
          src="@/assets/image/2.jpg"
          alt="cover"
          v-show="activeFormIndex === 1"
        />
      </div>

      <div class="login-form1" v-if="activeFormIndex === 1">
        <h2 class="title">查看分享</h2>
        <div class="form-item">
          <span class="label">分享码</span>
          <el-input placeholder="请输入分享码"></el-input>
        </div>
        <el-button @click="handleViewShareClick">确认</el-button>
        <span class="no-account" @click="changeActiveForm(0)">去登录</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import useUserStore from "@/store/modules/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

// 表单数据
const activeFormIndex = ref(0);
const userForm = reactive({
  name: "",
  password: "",
});

// 切换当前激活的表单
const changeActiveForm = (index) => {
  activeFormIndex.value = index;
};

// 处理登录和查看分享的点击

const handleLoginBtnClick = () => {
  const { name, password } = userForm;
  if (!name || !password) return;
  const onSuccess = () => {
    router.push("/home");
  };
  userStore.userLoginAction(name, password, onSuccess);
};
const handleViewShareClick = () => {
  console.log(2);
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
}

.login-card {
  display: inline-flex;
  padding: 30px 50px;
  box-shadow: 0 0 4px 6px #fafafa;
  margin-top: 15%;
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
    }
  }
  .login-form1 {
    order: 3;
    .no-account {
      align-self: flex-end !important;
    }
  }
  .form-item {
    display: flex;
    align-items: center;
    .label {
      white-space: nowrap;
      width: 90px;
    }
  }
  .no-account {
    color: #999;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    &:hover {
      text-decoration: underline;
      color: #777;
    }
  }
}
</style>
