<template>
  <div style="padding: 15px 15px 0 15px;">
    <Form :model="searchForm" :label-width="100" :inline="true">
      <FormItem label="演出名称" prop="show_id" :label-width="60">
        <Input v-model="searchForm.show_id" clearable></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSearchSubmit">查询</Button>
      </FormItem>
    </Form>
    <Table :no-data-text="noDataText" :loading="loading" :height="initHeight" border :data="tableData" :columns="tableColumns" stripe :row-class-name="rowClassName"></Table>
    <div style="margin: 15px 0 0 0;overflow: hidden">
      <div style="float: left;">
        <Button type="primary" icon="md-add" @click="outputScan">出库扫描</Button>
        <Button type="primary" icon="md-add" @click="putawayScan">入库扫描</Button>
        <Button type="primary" icon="md-add" @click="closeScan">入库扫描</Button>
      </div>
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
      timer: null,
      total: 0,
      current: 1,
      pageSize: 10,
      loading: false,
      noDataText: "读取中...",
      addPop: false,
      add_loading: false,
      addForm: {
        equip_name: "",
        brand: "",
        type: "",
        count: 0,
        remark: ""
      },
      updatePop: false,
      update_loading: false,
      updateForm: {
        _index: null,
        id: "",
        equip_name: "",
        brand: "",
        type: "",
        count: 0,
        remark: ""
      },
      searchForm: {
        show_name: "",
        show_id: "",
      },
      tableData: [],
      tableColumns: [
        {
          title: "编号",
          key: "number",
          align: "center"
        },
        {
          title: "名称",
          key: "equip_name",
          align: "center"
        },
        {
          title: "品牌",
          key: "brand",
          align: "center"
        },
        {
          title: "型号",
          key: "type",
          align: "center"
        },
        {
          title: "匹配信息",
          key: "status",
          align: "center",
          render:(h,params)=>{

            if(params.row.status === 0 ){
              return h("div","未出库");
            }else if(params.row.status === 1 ){
              return h("div","已出库")
            }else{
              return h("div","未入库")
            }
          }
        }
      ]
    };
  },
  computed: {
    initHeight() {
      return document.documentElement.clientHeight - 260;
    }
  },
  mounted() {
    this.getTableData();
  },
  watch: {
    tableData(curVal, oldVal) {
      if (curVal.length == 0) {
        this.noDataText = "暂无数据";
      }
    }
  },
  methods: {
    getTableData(searchForm) {
      searchForm = searchForm || this.searchForm;
      this.loading = true;
      this.$http
        .get("/api/app/test", {
          params: {
            status:0
          }
        })
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.tableData = data.result;
            this.total = data.result.total;
            this.current = data.result.current;
          }
          this.loading = false;
        });
    },
    handleSearchSubmit() {
      this.current = 1;
      this.getTableData(this.searchForm);
    },
    changePage(page) {
      this.current = page;
      this.getTableData();
    },
    rowClassName() {
      return "table-info-row";
    },
    outputScan() {
      var that = this;
      that.timer = setInterval( function (){
        var a = {"reader_name":"localreader/10.5.100.2","op_type:":"syncinventory","err_code":0,"err_string":"ok","result":[{"epc":"E2000017351002531180A037","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-61,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025316906B2A","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-55,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025315507855","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-57,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253171066CE","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-54,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025317006766","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-62,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253154078DE","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-51,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253185059A9","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-53,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025313408EC6","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-59,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002292","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-47,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002266","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-56,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025316806BC2","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-63,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002257","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-53,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025318405A43","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-55,"firstseen_timestamp":0,"lastseen_timestamp":0}]}
        a = JSON.stringify(a);
        that.$http
          .post("/api/scan/output", {
            params:{
              optput: a
            }
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.getTableData();
            }
          });
      }, 1000);
    },
    putawayScan() {
      var that = this;
      that.timer = setInterval( function (){
        var a = {"reader_name":"localreader/10.5.100.2","op_type:":"syncinventory","err_code":0,"err_string":"ok","result":[{"epc":"E2000017351002531180A037","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-61,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025316906B2A","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-55,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025315507855","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-57,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253171066CE","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-54,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025317006766","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-62,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253154078DE","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-51,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253185059A9","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-53,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025313408EC6","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-59,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002292","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-47,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002266","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-56,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025316806BC2","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-63,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002257","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-53,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025318405A43","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-55,"firstseen_timestamp":0,"lastseen_timestamp":0}]}
        a = JSON.stringify(a);
        that.$http
          .post("/api/scan/putaway", {
            params:{
              optput: a
            }
          })
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.getTableData();
            }
          });
      }, 1000);
    },
    closeScan() {
      clearInterval(this.timer);
    },
    handleAddSubmit() {
      this.add_loading = true;
      this.$http.post("/api/equips/add", this.addForm).then(res => {
        var data = res.data;
        if (data.code == 200) {
          this.$Message.success({
            content: data.msg,
            duration: 1,
            onClose: () => {
              this.addPop = false;
              this.add_loading = false;
            }
          });
        } else {
          this.$Message.error(data.msg);
          this.add_loading = false;
        }
      });
    },


    delete(params) {
      this.$http.post("/api/equips/delete", { id: params.row.id }).then(res => {
        var data = res.data;
        if (data.code == 200) {
          this.$Message.success({
            content: data.msg,
            duration: 1,
            onClose: () => {
              this.getTableData();
            }
          });
        } else {
          this.$Message.error(data.msg);
        }
      });
    }
  }
};
</script>

<style>
.ivu-table .table-info-row td {
  height: 30px;
}
.ivu-form-inline .ivu-form-item {
  margin-bottom: 10px;
}
.ivu-input-number {
  width: 100%;
}
</style>
