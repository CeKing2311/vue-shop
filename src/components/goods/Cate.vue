<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCate">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 分类列表 -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false"> 
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:green;"></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="handle" slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="delCate(scope.row)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
        </el-card>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            @close="dialogClosed"
            width="30%">
            <el-form :model="cateInfo" :rules="cateInfoRules" ref="cateInfoRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="cateInfo.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                     <el-cascader
                        expand-trigger="hover"
                        v-model="selectedValue"
                        :options="selectCateList"
                        :props="selectProps"
                        clearable 
                        change-on-select 
                        @change="handleChange"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCateInfo">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      cateList: [],
      total: 0,
      //为tree-table指定列定义
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          //当前列定义为模板列
          type: "template",
          //当前列使用的模板名称
          template: "isok"
        },
        {
          label: "排序",
          //当前列定义为模板列
          type: "template",
          //当前列使用的模板名称
          template: "order"
        },
        {
          label: "操作",
          //当前列定义为模板列
          type: "template",
          //当前列使用的模板名称
          template: "handle"
        }
      ],
      dialogTitle: "添加分类",
      dialogVisible: false,
      cateInfo: {
        //分类名称
        cat_name: "",
        cat_pid: 0,
        //分类等级默认一级分类
        cat_level: 0
      },
      cateInfoRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //选择中父级分类id数组
      selectedValue: [],
      selectCateList: [],
      selectProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败!");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    addCate() {
      this.dialogVisible = true;
      this.dialogTitle = "添加分类";
      this.getParentCateList();
    },
    //获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败!");
      }
      this.selectCateList = res.data;
    },
    handleChange() {
      //选中父级分类
      if (this.selectedValue.length > 0) {
        //父级分类id
        const pid = this.selectedValue[this.selectedValue.length - 1];
        this.cateInfo.cat_pid = pid;
        this.cateInfo.cat_level = this.selectedValue.length;
        return;
      } else {
        this.cateInfo.cat_pid = 0;
        this.cateInfo.cat_level = 0;
      }
    },
    saveCateInfo() {
      this.$refs.cateInfoRef.validate(async valid => {
        if (valid) {
          if (this.cateInfo.cat_id === undefined) {
            const { data: res } = await this.$http.post(
              "categories",
              this.cateInfo
            );
            if (res.meta.status !== 201) {
              return this.$message.error("保存失败!");
            }
          } else {
            const { data: res } = await this.$http.put(
              "categories/" + this.cateInfo.cat_id,
              { cat_name: this.cateInfo.cat_name }
            );
            if (res.meta.status !== 200) {
              return this.$message.error("保存失败!");
            }
          }
          this.$message.success("保存成功!");
          this.dialogVisible = false;
          this.getCateList();
        } else {
          return;
        }
      });
    },
    async editCate(cateInfo) {
      const { data: res1 } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res1.meta.status !== 200) {
        return this.$message.error("获取分类列表失败!");
      }
      this.selectCateList = res1.data;
      const { data: res } = await this.$http.get(
        "categories/" + cateInfo.cat_id
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类数据失败!");
      }
      this.cateInfo = res.data;
      this.getParentPid(this.cateInfo.cat_pid, this.cateInfo.cat_level);
      this.dialogVisible = true;
      this.dialogTitle = "编辑分类";
    },
    getParentPid(cid, level) {
      this.selectCateList.forEach(el => {
        if (level === 1) {
          if (el.cat_id === cid) {
            this.selectedValue.unshift(el.cat_id);
            return;
          }
        } else if (level === 2) {
          if (el.children !== undefined && el.children.length > 0) {
            el.children.forEach(e => {
              if (e.cat_id === cid) {
                this.selectedValue.unshift(e.cat_id);
                if (el.cat_id === e.cat_pid) {
                  this.selectedValue.unshift(el.cat_id);
                  return;
                }
              }
            });
          }
        }
      });
      console.log(this.selectedValue);
    },
    delCate(cateInfo){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete('categories/'+cateInfo.cat_id);
          if (res.meta.status!==200) {
            return this.$message.error('删除失败!');
          }          
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getCateList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    dialogClosed() {
      this.$refs.cateInfoRef.resetFields();
      this.selectedValue = [];
      this.cateInfo.cat_pid = 0;
      this.cateInfo.cat_level = 0;
    }
  }
};
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>


