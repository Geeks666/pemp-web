<template>
  <div style="padding:15px">
    <div>
      <Form :model="searchForm" :label-width="100" :inline="true">
        <FormItem label="仓库名称" prop="store_name" :label-width="60">
          <Input v-model="searchForm.store_name" clearable></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearchSubmit">查询</Button>
        </FormItem>
          <FormItem>
              <Button type="primary" @click="handleSearchSubmit">刷新</Button>
          </FormItem>
      </Form>
    </div>
    <Table :no-data-text="noDataText" :loading="loading" :height="initHeight" border :data="tableData" :columns="tableColumns" stripe :row-class-name="rowClassName"></Table>
    <div style="margin: 15px 0 0 0;overflow: hidden">

      <div style="float: right;">
        <Page :total="total" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        total: 0,
        current: 1,
        pageSize: 10,
        loading: false,
        user_loading: false,
        updatestore:false,
        noDataText: "读取中...",
        searchForm: {
          store_name: ""
        },
        tableData: [],
        tableColumns: [
          {
            title: "设备编号",
            key: "number",
            align: "center"
          },
          {
            title: "设备名称",
            key: "equip_name",
            align: "center"
          },
          {
            title: "所在位置",
            key: "address",
            align: "center"
          }]
      }
    },
    computed: {
      initHeight() {
        return document.documentElement.clientHeight - 260;
      }
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      rowClassName() {
        return "table-info-row";
      },
      getTableData(searchForm) {
        searchForm = searchForm || this.searchForm;
        this.loading = true;
        this.$http
          .post("/api/notice/serach", {
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.tableData = data.result || [{}];
              this.total = data.result.total;
              this.current = data.result.current;
              if(this.tableData.length == 0){
                this.noDataText = "暂无数据"
              }
            }
            this.loading = false;
          });
      },
      handleSearchSubmit() {
        this.current = 1;
        this.getTableData(this.searchForm);
      },
      handleStoreSubmit() {

      },
      createStore() {
        this.updatestore = true;
        // this.getTableData(this.searchForm);
      },
      changePage(page) {
        this.current = page;
        this.getTableData();
      },

    }
  }
</script>
<style>

</style>
