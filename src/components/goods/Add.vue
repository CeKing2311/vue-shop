<template>
    <div>
     <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
          <el-alert
            title="添加商品信息"
            type="info"
            center
            show-icon
            :closable="false"
            >
        </el-alert>
        <!-- 步骤条 -->
        <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center >
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <el-form :model="goodsForm" :rules="goodsRules" ref="goodsFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
            <el-tab-pane label="基本信息" name="0">
                 <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="goodsForm.goods_name"></el-input>
                </el-form-item>
                  <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="goodsForm.goods_price" type="number"></el-input>
                </el-form-item>
                  <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="goodsForm.goods_weight" type="number"></el-input>
                </el-form-item>
                 <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="goodsForm.goods_number" type="number"></el-input>
                </el-form-item>
                 <el-form-item label="商品分类" prop="goods_cat">
                    <el-cascader
                        v-model="goodsForm.goods_cat"
                        :options="cateList"
                        :props="cateProps"
                        @change="selectChange">
                    </el-cascader>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
                <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                    <!-- 复选框组 -->
                    <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox v-for="(attr,i) in item.attr_vals" :key="i" :label="attr" border ></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
                 <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                    <!-- 输入框 -->
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
               <el-upload
                :action="uploadUrl"
                :headers="headersObj"
                :on-preview="handlePreview"
                :on-remove="handleRemove"         
                :on-success	="uploadSuccess"       
                multiple
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器组件 -->
              <quill-editor v-model="goodsForm.goods_introduce">                
              </quill-editor>
              <el-button type="primary" class="btn-top-15" @click="addGoods">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
        </el-form>
    </el-card>
    <el-dialog
        title="图片预览"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <img :src="previewpath" class="previewimg" >
     </el-dialog>
    </div>
</template>
<script>
import _ from "lodash";

export default {
  data() {
    return {
      activeIndex: "0",
      goodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: "",
        pics: [],
        // 商品
        goods_introduce: "",
        attrs: []
      },
      goodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //   动态参数列表
      manyTableData: [],
      //静态属性
      onlyTableData: [],
      uploadUrl: "https://www.liulongbin.top:8888/api/private/v1/upload",
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewpath: "",
      dialogVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败!");
      }
      this.cateList = res.data;
    },
    selectChange() {
      if (this.goodsForm.goods_cat.length !== 3) {
        this.goodsForm.goods_cat = [];
        return;
      }
    },
    beforeTabLeave(actName, oldActName) {
      if (oldActName === "0" && this.goodsForm.goods_cat.length !== 3) {
        this.$message.info("请先选择商品分类!");
        return false;
      }
      return true;
    },
    async tabClicked() {
      //动态参数
      if (this.activeIndex === "1" && this.manyTableData.length==0) {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品参数失败!");
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2" && this.onlyTableData.length==0) {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品属性失败!");
        }
        this.onlyTableData = res.data;
        console.log(this.onlyTableData);
      }
    },
    handleRemove(file) {
      const filePath = file.response.data.url;
      const i = this.goodsForm.pics.findIndex(x => x.pic === filePath);
      this.goodsForm.pics.splice(i, 1);
      console.log(this.goodsForm);
    },
    handlePreview(file) {
      console.log(file);
      this.previewpath = file.response.data.url;
      this.dialogVisible = true;
    },
    uploadSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error("图片上传失败!");
      }
      const obj = {
        pic: response.data.url
      };
      this.goodsForm.pics.push(obj);
    },
     addGoods() {
      this.$refs.goodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单数据!");
        }
        // lodash  cloneDeep(obj)  深拷贝
        const formData = _.cloneDeep(this.goodsForm);
        formData.goods_cat = formData.goods_cat.join(",");
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.goodsForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.goodsForm.attrs.push(newInfo);
        });
        formData.attrs= this.goodsForm.attrs;      
        console.log(formData);
        //  发起请求添加商品
        // 商品名称唯一
        const {data:res} = await this.$http.post('goods',formData);
        console.log(res);
        if (res.meta.status !==201) {
          return this.$message.error('添加商品失败!')
        }else if (res.meta.status==400) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success('添加商品成功!');
        this.$router.push('/goods');
      });
    }
  },
  computed: {
    cateId() {
      if (this.goodsForm.goods_cat.length === 3) {
        return this.goodsForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>
<style lang="less" scoped>
.el-tabs {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewimg {
  width: 100%;
}
</style>


