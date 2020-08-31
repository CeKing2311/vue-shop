<template>
    <div>
            <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRole">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand" label="详情">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',idx1===0?'bdtop':'','vcenter']" v-for="(item1,idx1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                               <el-tag closable @close="delRightById(scope.row,item1.id)"> {{item1.authName}}   </el-tag> 
                               <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级和三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[idx2===0?'':'bdtop','vcenter']" v-for="(item2,idx2) in item1.children" :key="item2.id">
                                    <el-col :span="6"> 
                                        <el-tag type="success" closable @close="delRightById(scope.row,item2.id)"> {{item2.authName}}   </el-tag> 
                                        <i class="el-icon-caret-right"></i>
                                     </el-col>
                                    <el-col :span="18">
                                        <!-- 三级权限 -->
                                        <el-tag type="danger" closable  v-for="item3 in item2.children" :key="item3.id" @close="delRightById(scope.row,item3.id)"> {{item3.authName}}</el-tag> 
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRole(scope.row.id)" >删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRight(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 角色信息 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisable" @close="resetForm" width="30%">
            <el-form :model="roleInfo" :rules="roleInfoRules" ref="roleInfoRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleInfo.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input type="textarea" v-model="roleInfo.roleDesc"></el-input>
                </el-form-item>
            </el-form>
             <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisable = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限 -->
        <el-dialog :title="dialogRightTitle" :visible.sync="dialogRightVisable" @close="dialogRightClose" width="50%">
          <el-tree
            :data="rightsList"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defKeys"
            :props="treeProps"
            ref="treeRef"
            >
            </el-tree>
             <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogRightVisable = false">取 消</el-button>
                <el-button type="primary" @click="saveRight">确 定</el-button>
            </span>  
        </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      dialogTitle: "添加角色",
      dialogVisable: false,
      dialogRightTitle: "分配权限",
      dialogRightVisable: false,
      roleInfo: {},
      roleInfoRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      rightsList: [],
      //树形控件
      treeProps: {
        label: "authName",
        children: "children",
        id: "id"
      },
      //默认选中的节点
      defKeys:[],
      roleId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败!");
      this.rolesList = res.data;
    },
    addRole() {
      this.dialogVisable = true;
      this.dialogTitle = "添加角色";
    },
    saveRoleInfo() {
      this.$refs.roleInfoRef.validate(async valid => {
        if (!valid) return false;
        if (
          this.roleInfo.roleId === null ||
          this.roleInfo.roleId === undefined
        ) {
          const { data: res } = await this.$http.post("roles", this.roleInfo);
          if (res.meta.status !== 201)
            return this.$message.error("添加角色失败!");
          this.$message.success("添加角色成功！");
        } else {
          const { data: res } = await this.$http.put(
            "roles/" + this.roleInfo.roleId,
            {
              roleName: this.roleInfo.roleName,
              roleDesc: this.roleInfo.roleDesc
            }
          );
          if (res.meta.status !== 200)
            return this.$message.error("编辑角色失败!");
          this.$message.success("编辑角色成功！");
        }
        this.dialogVisable = false;
        this.getRolesList();
      });
    },
    async editRole(id) {
      this.dialogTitle = "编辑角色";
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("获取角色失败！");
      this.dialogVisable = true;
      this.roleInfo = res.data;
    },
    delRole(id) {
      this.$confirm("此操作将永久删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("roles/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败!");
          }
          this.$message.success("删除成功！");
          this.getRolesList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delRightById(role, rightsId) {
      this.$confirm("此操作将永久删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            "roles/" + role.id + "/rights/" + rightsId
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败!");
          }
          this.$message.success("删除成功！");
          role.children = res.data;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async setRight(role) {
      // 获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败!");
      }
      this.rightsList = res.data;
      //console.log(this.rightsList);
      this.getLeafKeys(role,this.defKeys);
      this.roleId= role.id;
      this.dialogRightVisable = true;
    },
    //通过递归的形式获取角色下所有三级权限的Id,并保存到defkeys 数组中
    getLeafKeys(node,arr){
        //当前node不包含children属性，则是三级节点
        if (!node.children) {
            return arr.push(node.id);
        }
        node.children.forEach(element => {
            this.getLeafKeys(element,arr);
        });
    },
    dialogRightClose(){
        this.defKeys=new Array();
    },
    //分配权限
    async saveRight(){
        const keys= [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ];
        const idStr= keys.join(',');
        const {data:res} =await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
        if (res.meta.status!==200) {
            return this.$message.error('分配权限失败！');
        }
        this.$message.success('分配权限成功!');
        this.getRolesList();
        this.dialogRightVisable=false;
    },
    resetForm() {
      this.$refs.roleInfoRef.resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.el-row {
  display: flex;
}
.el-col {
  justify-content: center;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>


