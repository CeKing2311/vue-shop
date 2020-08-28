<template>
     <el-container class="home-container">
         <!-- 头部 -->
            <el-header>
                <div>
                    <img src="../assets/cking.jpg" alt="">
                    <span>后台管理系统</span>
                </div>
                <el-button type="info" @click="LoginOut">退出</el-button>
            </el-header>
            <!-- 主体 -->
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="isCollapse?'64px':'200px'">
                  <div class="toggle-button" @click="toggleCollapse">
                    |||
                  </div>
                    <!-- 一级菜单 -->
                    <el-menu 
                    class="el-menu-vertical-demo"
                    background-color="#333744"
                    text-color="#fff"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router
                    :default-active="activePath"
                    active-text-color="#409EFE">
                        <el-submenu :index="menu.id +''"  v-for="menu in menuList"   :key="menu.id">
                            <!-- 一级菜单模板 -->
                            <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[menu.id]"></i>
                            <!-- 文本 -->
                            <span>{{menu.authName}}</span>
                            </template>
                                <!-- 二级菜单 -->
                               <el-menu-item :index="'/'+child.path" v-for="child in menu.children" :key="child.id" @click="saveNavState('/'+child.path)" >                                   
                                   <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-menu"></i>
                                    <!-- 文本 -->
                                    <span>{{child.authName}}</span>
                                    </template>
                                </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 内容主体 -->
                <el-main>
                  <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>       
</template>
<script>
export default {
  data() {
    return {
      //菜单数据
      menuList: [],
      iconsObj: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      //是否折叠
      isCollapse: false,
      activePath:''      
    };
  },
  created() {
    this.getMenuList();
    this.activePath= window.sessionStorage.getItem('activePath');
  },
  mounted() {},
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.menuList = res.data;
    },
    //菜单折叠于展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接激活状态
    saveNavState(path){
      window.sessionStorage.setItem('activePath',path);
      this.activePath= path;
    },
    LoginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #1e9fff;
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 48px;
    height: auto;
    border-radius: 50%;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #f2f2f2;
}
.iconfont {
  margin-right: 5px;
}
.toggle-button {
  background-color: #333744;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>