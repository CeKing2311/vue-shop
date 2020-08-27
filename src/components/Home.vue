<template>
    <div>
        <el-button type="info" @click="LoginOut">退出</el-button>
    </div>
</template>
<script>
export default {
  methods: {
    LoginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="less" scoped>
</style>


