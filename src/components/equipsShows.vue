<template>
  <div>
    <Layout>
      <Header class="head">
        <router-link to="/main/equips-shows/equips">管理我的装备</router-link>
        <router-link to="/main/equips-shows/shows">管理演出</router-link>
      </Header>
      <Layout class="drawer-box">
        <Content :style="{height: initHeight+'px', background: '#ffffff'}">
          <router-view></router-view>
        </Content>
        <Sider hide-trigger width='360' class="sider">
          <Card :bordered="false" style="padding: 10px 0;margin-bottom: 20px;">
            <Row>
              <Col span="9">
              <Card :bordered="false" :dis-hover="true" :padding="0">
                <Avatar style="background-color: #239FFD" icon="ios-person" shape="square" size="large" />
              </Card>
              </Col>
              <Col span="15">
              <Card :bordered="false" :dis-hover="true" :padding="0">
                <p>欢迎使用，{{userInfo.name}}！</p>
                <p class="today">今天是{{today}}</p>
                <p>您一共登记了{{userInfo.equipCount}}件装备</p>
              </Card>
              </Col>
            </Row>
          </Card>
          <Card :bordered="false" style="padding: 10px 0;">
            <p class="userInfo"><b>公司名称：</b>{{userInfo.company}}</p>
            <p class="userInfo"><b>邮编：</b>{{userInfo.postcode}}</p>
            <p class="userInfo"><b>地址：</b>{{userInfo.address}}</p>
            <p class="userInfo"><b>手机/座机：</b>{{userInfo.tel}}</p>
            <div style="margin: 20px 0 0 0;text-align:center;">
              <Button type="info" @click="openUpdateUser">修改信息</Button>
              <Button type="success" @click="openUpdatePass">修改密码</Button>
            </div>
          </Card>
        </Sider>
      </Layout>
    </Layout>
    <Modal v-model="updateUser" width="360">
      <p slot="header">
        <span>编辑公司信息</span>
      </p>
      <div>
        <Form ref="formUserInfo" :model="formUserInfo" :label-width="80">
          <FormItem label="公司名称" prop="company">
            <Input v-model="formUserInfo.company"></Input>
          </FormItem>
          <FormItem label="邮编" prop="postcode">
            <Input v-model="formUserInfo.postcode"></Input>
          </FormItem>
          <FormItem label="地址" prop="address">
            <Input v-model="formUserInfo.address"></Input>
          </FormItem>
          <FormItem label="手机/座机" prop="tel">
            <Input v-model="formUserInfo.tel"></Input>
          </FormItem>
          <FormItem label="公司编码" prop="number">
            <Input v-model="formUserInfo.number"></Input>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input v-model="formUserInfo.remark"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="user_loading" @click="handleUserSubmit()">保存</Button>
      </div>
    </Modal>
    <Modal v-model="updatePass" width="360">
      <p slot="header">
        <span>修改密码</span>
      </p>
      <div>
        <Form ref="formPassInfo" :model="formPassInfo" :rules="ruleValidate" :label-width="80">
          <FormItem label="原密码" prop="oldPass">
            <Input v-model="formPassInfo.oldPass" type="password"></Input>
          </FormItem>
          <FormItem label="新密码" prop="pass">
            <Input v-model="formPassInfo.pass" type="password"></Input>
          </FormItem>
          <FormItem label="确认密码" prop="newPass">
            <Input v-model="formPassInfo.newPass" type="password"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="pass_loading" @click="handlePassSubmit('formPassInfo')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("必填项不能为空"));
      } else if (value !== this.formPassInfo.pass) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      userInfo: {
        equipCount: 0,
        company: "",
        postcode: "",
        address: "",
        tel: "",
        remark: ""
      },
      updateUser: false,
      user_loading: false,
      updatePass: false,
      pass_loading: false,
      formUserInfo: {
        company: "",
        postcode: "",
        address: "",
        tel: "",
        number:"",
        remark: ""
      },
      formPassInfo: {
        oldPass: "",
        pass: "",
        newPass: ""
      },
      ruleValidate: {
        oldPass: [{ required: true, message: "必填项不能为空" }],
        pass: [{ required: true, message: "必填项不能为空" }],
        newPass: [{ required: true, validator: validatePassCheck }]
      }
    };
  },
  computed: {
    initHeight() {
      return document.documentElement.clientHeight - 125;
    },
    today() {
      return this.$utils.dateFormat(new Date(), "yyyy年MM月dd日");
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$http.get("/api/user").then(res => {
        var data = res.data;
        if (data.code == 200) {
          this.userInfo = data.result.userInfo;
        }
      });
    },
    openUpdateUser() {
      this.updateUser = true;
      this.formUserInfo = this.userInfo;
    },
    openUpdatePass() {
      this.updatePass = true;
      this.formPassInfo = {
        oldPass: "",
        pass: "",
        newPass: ""
      };
    },
    handleUserSubmit() {
      this.user_loading = true;
      this.$http.post("/api/user", this.formUserInfo).then(res => {
        var data = res.data;
        if (data.code == 200) {
          this.$Message.success({
            content: data.msg,
            duration: 1,
            onClose: () => {
              this.userInfo = this.formUserInfo;
              this.updateUser = false;
              this.user_loading = false;
            }
          });
        } else {
          this.$Message.error(data.msg);
          this.user_loading = false;
        }
      });
    },
    handlePassSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.pass_loading = true;
          this.$http.post("/api/pass", this.formPassInfo).then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.$Message.success({
                content: data.msg,
                duration: 1,
                onClose: () => {
                  this.updatePass = false;
                  this.pass_loading = false;
                  this.$refs[name].resetFields();
                  this.$http.get("/api/logout").then(res => {
                    this.$router.push({
                      path: "/"
                    });
                  });
                }
              });
            } else {
              this.$Message.error(data.msg);
              this.pass_loading = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.ivu-layout {
  background: #eeeeee;
}
.head {
  background: #ffffff;
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin-bottom: 10px;
}
.head a {
  color: #000;
  font-size: 14px;
  font-weight: 400;
  margin-right: 20px;
}
.sider {
  background: #eee;
  padding: 0 10px 0 20px;
}
.ivu-avatar-large {
  width: 80px;
  height: 80px;
  line-height: 80px;
  font-size: 80px;
}
.today {
  padding: 8px 0;
}
.userInfo {
  padding: 5px 0;
}
</style>
