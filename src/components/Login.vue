<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!--登录表单-->            
            <el-form :model="userForm" ref="loginFormRef" :rules="loginRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="userForm.username"  prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="userForm.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                 <el-form-item class="btns">
                    <el-button type="primary" @click="submitForm('loginFormRef')">登录</el-button>
                    <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
                </el-form-item>                
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      userForm: {
        username: "admin",
        password: "123456"
      },
      //验证规则对象
      loginRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 24, message: "长度在 6 到 24 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post("login", this.userForm);
          if (res.meta.status !== 200) {
            console.log("登录失败");
            this.$message.error("登录失败");
          } else {
            this.$message.success("登录成功");
            window.sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置登录表单
    resetForm(formname) {
      this.$refs[formname].resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #666;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


