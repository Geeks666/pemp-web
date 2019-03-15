<template>
  <div class="login">
    <div class="logo-box">
      <img src="./../assets/img/logo.png" alt="演出装备管理平台">
      <h1>
        <p>演出装备管理平台</p>
        <p>Performance equipment management system</p>
      </h1>
    </div>
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false" v-if="loginShow">
        <div class="form-con">
          <login-form @on-success-valid="handleLoginSubmit" :subText="loginText"></login-form>
          <p class="login-tip" @click="loginShow = false">注册账号</p>
        </div>
      </Card>
      <Card icon="log-in" title="欢迎注册" :bordered="false" v-if="!loginShow">
        <div class="form-con">
          <login-form @on-success-valid="handleRegSubmit" :subText="regText"></login-form>
          <p class="login-tip" @click="loginShow = true">已有账号，去登录</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import loginForm from "@/components/loginForm";
export default {
  data() {
    return {
      loginShow: true,
      loginText: "登录",
      regText: "注册"
    };
  },
  components: {
    loginForm
  },
  mounted() {},
  methods: {
    handleLoginSubmit({ userName, password }) {
      this.$http
        .get("/api/login", {
          params: {
            name: userName,
            password: password
          }
        })
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$Message.success({
              content: data.msg,
              duration: 1,
              onClose: () => {
                let redirectUrl = '/main';
                this.$router.push({
                  path: redirectUrl,
                });
              }
            });
          } else {
            this.$Message.error(data.msg);
          }
        });
    },
    handleRegSubmit({ userName, password }) {
      var csrftoken = this.$cookies.getCookie("csrfToken");
      this.$http
        .post("/api/reg", {
          name: userName,
          password: password
        })
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$Message.success({
              content: data.msg,
              duration: 1,
              onClose: () => {
                this.$router.push({
                  path: "/main"
                });
              }
            });
          } else {
            this.$Message.error(data.msg);
          }
        });
    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("../assets/img/login-bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
}
.login-con {
  position: absolute;
  right: 160px;
  top: 50%;
  transform: translatey(-60%);
  width: 300px;
}
.login-con-header {
  font-size: 16px;
  font-weight: 300;
  text-align: center;
  padding: 30px 0;
}
.login-con .form-con {
  padding: 10px 0 0;
}
.login-con .login-tip {
  font-size: 14px;
  text-align: center;
  color: #308cee;
  cursor: pointer;
}
.login-con .login-tip:hover {
  text-decoration: underline;
}
.logo-box {
  padding: 20px 0 0 50px;
}
.logo-box img {
  float: left;
  margin-right: 10px;
}
.logo-box h1 {
  color: #ffffff;
  font-weight: normal;
}
.logo-box h1 p {
  font-size: 16px;
}
.logo-box h1 p:first-child {
  font-size: 22px;
  letter-spacing: 20px;
}
</style>
