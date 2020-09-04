<template>
    <div>
        <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
    </div>
</template>
<script>
import echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      options: {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
        ]
      }
    };
  },
  created() {},
  // 此时 页面上的元素 已经被渲染完毕
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    // 指定图表的配置项和数据
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) return this.$message.error("获取数据失败!");
     const result = _.merge(res.data, this.options);
    // console.log(result);
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  methods: {}
};
</script>
<style lang="less" scoped>
</style>


