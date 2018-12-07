<template>
  <div>
    <Row class="head">
      <Col span="8">
      <div class="logo-box">
        <img src="./../assets/img/logo.png" alt="演出装备管理平台">
        <h1>
          <p>演出装备管理平台</p>
          <p>Performance equipment management system</p>
        </h1>
      </div>
      </Col>
      <Col span="8" class="nav">
      <router-link to="/main/equips-shows">我的装备</router-link>
      <router-link to="/main/equips-check">装备卸载校对</router-link>
      </Col>
      <Col span="8" class="logout">
      <Button type="info" @click="logout">
        <Icon type="ios-power" />退出</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <router-view></router-view>
      </Col>
    </Row>

  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.getCsrftoken();
  },
  methods: {
    logout() {
      this.$http.get("/api/logout").then(res => {
        this.$router.push({
          path: "/"
        });
      });
    },
    getCsrftoken() {
      this.$http.get("/api/getToken");
    }
  }
};
</script>

<style scoped>
.head {
  background-image: -webkit-linear-gradient(0deg, #0cb1fb, #0e74f1);
  height: 62px;
}
.nav {
  line-height: 62px;
  text-align: center;
}
.nav a {
  color: #ffffff;
  font-size: 18px;
  margin-right: 20px;
}
.logout {
  line-height: 62px;
  text-align: right;
  padding-right: 50px;
}
.logout button {
  font-size: 14px;
}
.logout i {
  font-size: 20px !important;
  margin-right: 5px;
  vertical-align: sub;
}
.logo-box {
  padding: 10px 0 10px 50px;
}
.logo-box img {
  float: left;
  width: 40px;
  margin-right: 10px;
}
.logo-box h1 {
  color: #ffffff;
  font-weight: normal;
}
.logo-box h1 p {
  font-size: 12px;
}
.logo-box h1 p:first-child {
  font-size: 16px;
  letter-spacing: 16px;
}
</style>