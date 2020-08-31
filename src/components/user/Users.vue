<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <el-row :gutter="20">
               <el-col :span="7">
                 <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="queryClick"> 
                     <el-button slot="append" icon="el-icon-search" @click="queryClick"></el-button></el-input>
                </el-col>
               <el-col :span="4">    
                   <el-button type="primary" @click="addUser">添加用户</el-button>              
                </el-col>                                    
             </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userList" stripe border >
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column prop="username" label="姓名"></el-table-column>
                  <el-table-column prop="role_name" label="角色"></el-table-column>
                  <el-table-column prop="mobile" label="手机号"></el-table-column>
                  <el-table-column prop="email" label="电子邮箱"></el-table-column>
                  <el-table-column label="状态">
                      <template slot-scope="scope">
                          <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)">
                            </el-switch>
                      </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                                <el-button type="primary" icon="el-icon-edit"  size="mini" @click="showEditDialog(scope.row.id)" ></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                                <el-button type="danger" icon="el-icon-delete"  size="mini" @click="DelUser(scope.row.id)" ></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="设置权限" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting"  size="mini" @click="setRole(scope.row)"></el-button>
                            </el-tooltip>
                    </template>
                  </el-table-column>
            </el-table>
            <!-- 分页区域 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            @close="addDialogClose"
            width="30%">
            <!-- 内容区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户 -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editDialogVisible"
            @close="editDialogClose"
            width="30%">
            <!-- 内容区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 设置权限 -->
        <el-dialog
            title="设置权限"
            :visible.sync="roleDialogVisible"
            @close="roleDialogClose"
            width="50%">
            <!-- 内容区域 -->
            <div>
              <p>当前用户：{{userInfo.username}}</p>
              <p>当前角色：{{userInfo.role_name}}</p>
              <p>选择角色：
                 <el-select v-model="roleId" placeholder="请选择新角色">
                  <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                </el-select>
            </p>
            </div>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setUserRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { validateEmail, validateMobile } from "@/utils/validate";
export default {
  data() {
    //验证邮箱
    var chkEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else {
        if (validateEmail(value)) {
          callback(new Error("请输入合法的邮箱"));
        }
        callback();
      }
    };
    //验证手机号
    var chkMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (validateMobile(value)) {
          callback(new Error("请输入合法的手机号"));
        }
        callback();
      }
    };
    return {
      //获取用户列表查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3-10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码的长度在6-18个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: chkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: chkMobile, trigger: "blur" }
        ]
      },
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: chkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: chkMobile, trigger: "blur" }
        ]
      },
      roleDialogVisible: false,
      userInfo: {},
      roleList: [],
      //选中的角色Id
      roleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //添加用户
    addUser() {
      this.addDialogVisible = true;
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    queryClick() {
      this.getUserList();
    },
    //添加用户对话框的关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    roleDialogClose() {
      this.roleId="";
      this.roleDialogVisible = false;
    },
    //监听状态改变
    async userStatusChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败!");
      } else {
        this.$message.success("更新用户状态成功!");
      }
    },
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.userList = res.data.users;
      console.log(this.userList);
      this.total = res.data.total;
    },
    //保存用户信息
    saveUserInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false;
        //发起添加请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("/users/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("获取用户信息失败!");
      this.editDialogVisible = true;
      this.editForm = res.data;
    },
    //编辑用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        //发起编辑请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("编辑用户失败！");
        }
        this.$message.success("编辑用户成功！");
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    //删除用户信息
    async DelUser(id) {
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => {
        return err;
      });
      if (res !== "confirm") {
        //取消删除
        return this.$message.info("取消删除!");
      } else {
        const { data: res } = await this.$http.delete("users/" + id);
        if (res.meta.status !== 200) {
          return this.$message.err("删除用户失败!");
        }
        this.$message.success("删除用户成功！");
        this.queryInfo.pagenum = 1;
        this.getUserList();
      }
    },
    async setRole(user) {
      this.userInfo = user;
      //获取所有角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败!");
      }
      this.roleList = res.data;
      this.roleDialogVisible = true;
    },
    //分配角色
    async setUserRole() {
      if (!this.roleId) {
        return this.$message.error("请选择要分配的角色！");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.roleId }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配角色失败!");
      }
      this.getUserList();
      this.roleDialogVisible=false;
      this.$message.success("分配角色成功!");
    }
  }
};
</script>
<style lang="less" scoped>
</style>


