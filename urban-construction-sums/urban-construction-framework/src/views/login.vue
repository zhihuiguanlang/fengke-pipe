<template>
  <div class="login">
    <v-card class="pa-4" outlined light>
      <v-card-title class="d-flex flex-column align-start">
        <span class="headline">后台管理登录</span>
        <span>www.xxx.com</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="form.username"
              :rules="rule.username"
              label="用户名"
              outlined
              clearable
              class="select"
            ></v-text-field>
            <v-text-field
              v-model="form.password"
              :rules="rule.password"
              type='password'
              label="密码"
              outlined
              clearable
              class="select"
            ></v-text-field>
            <v-text-field
              v-model="form.validCode"
              :rules="rule.validCode"
              label="验证码"
              outlined
              clearable
              class="select"
            >
              <template v-slot:append-outer>
                <div class="code">
                  <v-img
                    :src="`${http.system}/api-uaa/validata/code/${form.deviceId}`"
                    width="150px"
                    height="40px"
                    light
                    alt
                  />
                  <div class='look' @click='look'>
                    看不清，换一张
                  </div>
                </div>
              </template>
            </v-text-field>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn dark color="cyan" width="200" @click="login" :loading="loading">登录</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Cookies from "js-cookie";  // 引入cookie
import http from "@/assets/script/http";
export default {
  name: "login",
  data: () => ({
    http,
    valid: false,
    loading: false,
    show1:false,
    form: {
      username: "",
      password: "",
      validCode: "",
      deviceId: (Math.random() * 1000).toFixed(4),
    },
    rule: {
      username: [v => !!v || "必填"],
      password: [v => !!v || "必填"],
      validCode: [v => !!v || "必填"]
    }
  }),
  methods: {
    login() {
      this.$refs.form.validate();
      if (this.valid) {
        // 临时配置token
        Cookies.set(
          "token",
          `Basic ${window.btoa('web:web')}`,  // btoa()用于创建一个 base-64 编码的字符串。
          { expires: 7, path: '/' }  // 临时配置Basic认证---web登录
        );
        const { username, password, validCode, deviceId } = this.form;
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("validCode", validCode);
        formData.append("deviceId", deviceId);
        this.$axios
          .post("/api-uaa/oauth/user/token", formData)
          .then(res => {
            if (res) {
              // 存储token
              const token = res.data.access_token;
              Cookies.set('token', `Bearer ${token}`, { expires: 7, path: '/' });
              // 用户提示
              this.$notice.success('登录成功')
              // 跳转页面
              this.$router.push('/vessel');
            } else {
              // 移除token
              Cookies.remove('token', { expires: 7, path: '/' });
            }
          });
      }
    },
    look() {
      //  更换验证码
      this.form.deviceId = (Math.random() * 1000).toFixed(4);
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .headline {
    font-size: 18px;
    color: #12bed1;
    font-family: "microsoft yahei";
  }
  .select {
    width: 300px;
  }
  .code {
    display: flex;
    flex-direction: column;
    .look {
      text-align: center;
      text-decoration: underline;
      color: blue;
      cursor: pointer;
    }
  }
}
</style>
