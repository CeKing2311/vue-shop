<template>
    <div>
         <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert
            title="注意：只允许为第三级分类设置参数"
            :closable ="false"
            show-icon
            type="warning">
            </el-alert>
             <!-- 商品分类 -->
            <el-row class="cat-opt">
                <el-col>
                    <span>选择商品分类：</span> 
                    <el-cascader
                        expand-trigger="hover"
                        v-model="selectedValue"
                        :options="cateList"
                        :props="selectProps"
                        clearable 
                        @change="selectChange"></el-cascader>                   
                </el-col>
            </el-row>
            <!-- tabs -->
              <el-tabs v-model="activeName" @tab-click="tabsClick">
                  <!-- 动态参数 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParams">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border  stripe >
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="tagClose(i,scope.row)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 静态属性 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParams">添加属性</el-button>
                     <el-table :data="onlyTableData" border  stripe >
                        <el-table-column type="expand">
                             <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="tagClose(i,scope.row)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>       
        <!-- 添加参数 -->
          <el-dialog
            :title="'添加'+dialogTitle"
            :visible.sync="dialogVisible"
            @close="dialogClosed"
            width="50%">
            <el-form :model="paramsInfo" :rules="paramsInfoRules" ref="paramsInfoRef" label-width="100px">
                <el-form-item :label="dialogTitle" prop="attr_name">
                    <el-input v-model="paramsInfo.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveParamsInfo">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      selectedValue: [],
      selectProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      activeName: "many",
      //动态参数数据
      manyTableData: [],
      //静态属性数据
      onlyTableData: [],
      dialogVisible: false,
      paramsInfo: {
        attr_name: ""
      },
      paramsInfoRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败!");
      }
      this.cateList = res.data;
    },
    selectChange() {
      this.getAttributesList();
    },
    async getAttributesList() {
      if (this.selectedValue.length !== 3) {
        this.selectedValue = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败!");
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //控制文本框的显示与隐藏
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    tabsClick() {
      this.getAttributesList();
    },
    addParams() {
      this.dialogVisible = true;
    },
    saveParamsInfo() {
      this.$refs.paramsInfoRef.validate(async valid => {
        if (!valid) {
          return;
        }
        if (
          this.paramsInfo.attr_id !== undefined &&
          this.paramsInfo.attr_id !== ""
        ) {
          const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.paramsInfo.attr_id}`,
            {
              attr_name: this.paramsInfo.attr_name,
              attr_sel: this.activeName,
              attr_vals: ""
            }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("更新失败!");
          }
          this.$message.success("更新成功!");
        } else {
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.paramsInfo.attr_name,
              attr_sel: this.activeName,
              attr_vals: ""
            }
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加失败!");
          }
          this.$message.success("添加成功!");
        }
        this.getAttributesList();
        this.dialogVisible = false;
      });
    },
    async editParams(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败!");
      }
      this.dialogVisible = true;
      this.paramsInfo = res.data;
    },
    deleteParams(attrInfo) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attrInfo.attr_id}`
          );
          if (res.meta.status !== 200) return this.$message.error("删除失败!");
          this.getAttributesList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    dialogClosed() {
      this.$refs.paramsInfoRef.resetFields();
    },
    //文本框失去焦点或 按下enter键触发
    handleInputConfirm(info) {
      if (info.inputValue.trim().length === 0) {
        info.inputValue = "";
        info.inputVisible = false;
        return;
      }
      //输入内容需要做后续处理
      info.attr_vals.push(info.inputValue.trim());
      info.inputValue = "";
      info.inputVisible = false;
      this.saveAttrs(info);
    },
    showInput(info) {
      info.inputVisible = true;
      // 文本框自动获得焦点
      //this.$nextTick   当页面元素被重新渲染后才会执行回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async saveAttrs(info) {
      //发起请求保存操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${info.attr_id}`,
        {
          attr_name: info.attr_name,
          attr_sel: info.attr_sel,
          attr_vals: info.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改参数失败!");
      this.$message.success("修改参数成功!");
    },
    tagClose(index, info) {
      info.attr_vals.splice(index, 1);
      this.saveAttrs(info);
    }
  },
  computed: {
    //如果按钮需要被禁用，则返回true,否则返回false
    isBtnDisabled() {
      if (this.selectedValue.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedValue.length === 3) {
        return this.selectedValue[2];
      }
      return null;
    },
    dialogTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  }
};
</script>
<style lang="less" scoped>
.cat-opt {
  margin: 15px 5px;
}
.el-tag {
  margin-right: 15px;
}
.input-new-tag {
  width: 150px;
}
</style>


