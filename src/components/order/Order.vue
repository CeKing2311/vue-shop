<template>
    <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
            <el-col :span="8">
                <el-input placeholder="请输入内容" clearable >
                    <el-button slot="append" icon="el-icon-search">搜索</el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data="orderList" border  stripe >
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="订单编号" prop="order_number"></el-table-column>
            <el-table-column label="订单价格" prop="order_price"></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.pay_status===1">已付款</el-tag>
                    <el-tag type="danger" v-else>未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send"></el-table-column>
            <el-table-column label="下单时间" prop="create_time">
                <template slot-scope="scope">
                   {{scope.row.create_time | dateFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作" >
                <template>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddress"></el-button>
                    <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
    <!-- 修改地址 -->
    <el-dialog
        title="修改地址"
        :visible.sync="dialogVisible"
        @close="dialogClosed"
        width="50%">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
             <el-cascader v-model="addressForm.address1"
                :options="cityData"
                clearable></el-cascader>
            </el-form-item>
             <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
     </el-dialog>
     <!-- 展示物流进度 -->
     <el-dialog
        title="物流进度"
        :visible.sync="dialogProgressVisible"
        width="50%">
        <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(progress, index) in progressList"
          :key="index"
          :timestamp="progress.time">
          {{progress.context}}
        </el-timeline-item>
      </el-timeline>
     </el-dialog>
    </div>
</template>
<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: ""
      },
      orderList: [],
      total: 0,
      dialogVisible: false,
      dialogProgressVisible: false,
      addressForm: {
        address1: "",
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData,
      progressList: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败!");
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    editAddress() {
      this.dialogVisible = true;
    },
    dialogClosed() {
      this.$refs.addressFormRef.resetFileds();
    },
    async showProgressBox() {
      this.dialogProgressVisible = true;
      const { data: res } = await this.$http.get("kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败!");
      }
      this.progressList = res.data;
      console.log(res.data);
    }
  }
};
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.el-cascader-panel {
  height: 300px;
}
</style>


