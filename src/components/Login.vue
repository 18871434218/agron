<template>
  <div class="loginBG">
    <el-image class="loginLOGO" :src="require('../assets/img/登录页logo-18.png') "></el-image>
    <div style="margin-top:8%">
      <el-row style="margin-left: 126px;" :gutter="10">
        <el-col :span="3">
          <el-image
            style="height:116px;width:188px"
            :src="require('../assets/img/登录页logo-19.png') "
          ></el-image>
        </el-col>
        <el-col :span="21">
          <div style="height:26px"></div>
          <el-row>
            <div style="color:#00fff5;font-size:32px;font-family:Microsoft YaHei Light;">智能机器人云端管控平台</div>
          </el-row>

          <el-row>
            <div
              style="color:#00fff5;font-size:34px;font-family:Arial Regular;"
            >Robort Control Cloud</div>
          </el-row>
        </el-col>
        <el-col :span="24">
          <div style="width:360px;margin-top:6%;">
            <!-- <el-menu mode="horizontal" style="background-color:transparent;width:100%;">
              <el-menu-item index="1" v-on:click="login_type='normal'">
                <div
                  style="color:#00fff5;font-size:18px;font-family:Microsoft YaHei Light;margin-right:30px;margin-left:11px"
                >账号密码登录</div>
              </el-menu-item>

              <el-menu-item index="2" v-on:click="login_type='QR'">
                <div
                  style="color:#00fff5;font-size:18px;font-family:Microsoft YaHei Light;margin-left:30px;margin-right:11px"
                >二维码登录</div>
              </el-menu-item>
            </el-menu>-->
            <div style="text-align: center;">
              <div
                style="color:#00fff5;font-size:18px;font-family:Microsoft YaHei Light;margin-bottom:10px"
              >用户登录</div>
            </div>

            <div style="background:linear-gradient(to right,#00fff5,#00b4f0);height:2px;"></div>

            <div v-if="login_type=='normal'" style="margin-top:44px;width:100%">
              <el-input
                style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464;background-color: transparent;"
                placeholder="邮箱/手机号"
                v-model="user_name"
              ></el-input>
              <el-input
                style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464;background-color: transparent;"
                placeholder="密码"
                v-model="password"
                show-password
              ></el-input>
              <el-row style="margin-top:24px">
                <el-col :span="20">
                  <el-checkbox v-model="is_password_cookie">记住密码</el-checkbox>
                </el-col>
                <el-col :span="4">
                  <el-link
                    :underline="false"
                    style="color:#00fff5;font-size:14px;font-family:Microsoft YaHei Light;margin-right:0px;margin-top:-6px;"
                    @click="is_forgot=true"
                  >忘记密码</el-link>
                </el-col>
              </el-row>
              <el-row style="margin-top:64px">
                <el-col :span="16">
                  <el-button class="loginButton toLogin" @click="loginPW()">
                    <div style="color:black;font-size:18px;font-family:Microsoft YaHei Light;">登录</div>
                  </el-button>
                </el-col>
                <el-col :span="4">
                  <el-button
                    class="loginButton"
                    style="color:#00fff5;font-size:18px;margin-right:0px,background-color: transparent;"
                    @click="is_register=true"
                  >注册</el-button>
                </el-col>
              </el-row>
            </div>
            <div v-if="login_type=='QR'" style="text-align: center;">
              <el-image style="width: 250px; height: 250px;margin-top:30px" src></el-image>
              <div
                style="margin-top:20px;color:#00fff5;font-size:18px;font-family:Microsoft YaHei Light;margin-left:30px;margin-right:11px"
              >请扫描上方二维码</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="注册" :visible.sync="is_register" @close="closeRegist()" width="22%">
      <div style="text-align: center;">
        <el-input
          style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464"
          placeholder="请输入用户名"
          v-model="user_name_regist"
        ></el-input>
        <el-input
          style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464"
          placeholder="请输入密码"
          v-model="password_regist_1"
          show-password
        ></el-input>
        <el-input
          style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464"
          placeholder="请再次输入密码"
          v-model="password_regist_2"
          show-password
        ></el-input>
        <el-input
          style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464"
          placeholder="请设定安全密钥"
          v-model="Scode_regist"
          show-password
        ></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRegist()">取 消</el-button>
        <el-button
          v-if="user_name_regist!=null&&password_regist_1!=null&&password_regist_2!=null&&Scode_regist!=null"
          type="primary"
          @click=" regist()"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="忘记密码" :visible.sync="is_forgot" @close="closeChangePW()" width="22%">
      <div style="text-align: center;">
        <el-input
          style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464;"
          placeholder="请输入用户名"
          v-model="user_name_reset"
        ></el-input>
        <el-input
          style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464"
          placeholder="请输入安全密钥"
          v-model="Scode_reset"
          show-password
        ></el-input>
        <el-input
          style="margin-top:30px;width:360px;height:40px;border-color: #c8c8c8;color:#646464"
          placeholder="请输入新密码"
          v-model="password_reset"
          show-password
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeChangePW()">取 消</el-button>
        <el-button
          v-if="user_name_reset!=null&&password_reset!=null&&Scode_reset!=null"
          type="primary"
          @click=" changePW()"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="is_logout" @close="is_logout=false" width="22%">
      <div>你已经下线了，请重新登录。</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="is_logout=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mqtt from "mqtt";
export default {
  data() {
    return {
      is_logout: false,
      login_type: "normal",
      is_register: false,
      is_forgot: false,
      is_password_cookie: false,

      user_name: null,
      password: null,

      user_name_regist: null,
      password_regist_1: null,
      password_regist_2: null,
      Scode_regist: null,

      user_name_reset: null,
      password_reset: null,
      Scode_reset: null,

      client: null
    };
  },
  created() {
    this.is_logout = this.$root.is_logout;
  },
  mounted() {
    if (this.$cookies.get("user_name")) {
      this.user_name = window.$cookies.get("user_name");
    }
    if (this.$cookies.get("password")) {
      this.password = window.$cookies.get("password");
    }
    
  },
  beforeDestroy() {
    if (this.is_password_cookie == false) {
      window.$cookies.remove("password");
    }
  },
  watch: {
    is_logout(val) {
      this.$root.is_logout = val;
    }
  },
  methods: {
    loginPW() {
      window.$cookies.set("user_name", this.user_name, "15D");
      this.$root.login_time = new Date().toLocaleString();
      var addSqlParams = [this.user_name, this.password, this.$root.login_time];
      this.$http.post("/api/login", addSqlParams, {}).then(
        response => {
          if (response.data == "登录失败") {
            this.$message.error("用户名或密码错误，登陆失败。");
          } else {
            if (this.is_password_cookie == true) {
              window.$cookies.set("password", this.password, "15D");
            }
            this.$root.can_login = true;
            this.$root.user.name = this.user_name;
            this.$root.current_page.name = "Monitor";
            this.$router.push({ name: "Monitor" });
          }
        },
        err => {
 //  err1:出错了!
        }
      );
    },
    regist() {
      if (this.password_regist_1 != this.password_regist_2) {
        this.$message.error("两次输入密码不同。");
      } else {
        this.$message({
          message: "注册成功。",
          type: "success"
        });
        this.closeRegist();
      }
    },
    closeRegist() {
      this.user_name_reset = null;
      this.password_regist_1 = null;
      this.password_regist_2 = null;
      this.Scode_regist = null;
      this.is_register = false;
    },
    changePW() {},
    closeChangePW() {
      this.user_name_reset = null;
      this.Scode_reset = null;
      this.password_reset = null;
      this.is_forgot = false;
    }
  }
};
</script>
<style>
.el-checkbox {
  color: #00fff5;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #00b4f0;
}
</style>
<style scoped>
.loginBG {
  height: 100vh;
  width: 100vl;
  background-image: url(../assets/img/登录页背景.jpg);
  background-size: 100% 100%;
}
.el-menu {
  backface-visibility: hidden;
}
.loginLOGO {
  margin-left: 126px;
  margin-top: 72px;
  height: 46px;
  width: 294px;
  z-index: 999;
}
.loginButton {
  width: 120px;
  height: 36px;
  padding: 8px 15px;
  background-color: transparent;
  border-radius: 18px;
}
.toLogin {
  background: linear-gradient(to right, #00fff5, #00fff5, #00b4f0);
  background-size: 200%;
  transition: background-position 0.5s;
}
.toLogin:hover {
  background-position: 100% 0;
}
</style>