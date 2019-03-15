<template>
  <div style="padding: 15px 15px 0 15px;">
    <Form :model="searchForm" :label-width="100" :inline="true">
      <FormItem label="名称" prop="equip_name" :label-width="60">
        <Input v-model="searchForm.equip_name" clearable></Input>
      </FormItem>
      <FormItem label="品牌" prop="brand" :label-width="60">
        <Input v-model="searchForm.brand" clearable></Input>
      </FormItem>
      <FormItem label="型号" prop="type" :label-width="60">
        <Input v-model="searchForm.type" clearable></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSearchSubmit">查询</Button>
      </FormItem>
    </Form>
    <Table :no-data-text="noDataText" :loading="loading" :height="initHeight" border :data="tableData" :columns="tableColumns" stripe :row-class-name="rowClassName"></Table>
    <div style="margin: 15px 0 0 0;overflow: hidden">
      <div style="float: left;">
        <Button type="primary" icon="md-add" @click="showAddEquip">新建装备</Button>
      </div>
      <div style="float: right;">
        <Page :total="total" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="addPop" width="400">
      <p slot="header">
        <span>新增装备信息</span>
      </p>
      <div>
        <Form ref="addForm" :model="addForm" :label-width="80">
          <FormItem label="名称" prop="equip_name">
            <Input v-model="addForm.equip_name"></Input>
          </FormItem>
          <FormItem label="品牌" prop="brand">
            <Input v-model="addForm.brand"></Input>
          </FormItem>
          <FormItem label="型号" prop="type">
            <Input v-model="addForm.type"></Input>
          </FormItem>
          <FormItem label="设备编码" prop="number">
            <Input v-model="addForm.number"></Input>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input v-model="addForm.remark"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="add_loading" @click="handleAddSubmit()">保存</Button>
      </div>
    </Modal>
    <Modal v-model="updatePop" width="400">
      <p slot="header">
        <span>修改装备信息</span>
      </p>
      <div>
        <Form ref="updateForm" :model="updateForm" :label-width="80">
          <FormItem label="名称" prop="equip_name">
            <Input v-model="updateForm.equip_name"></Input>
          </FormItem>
          <FormItem label="品牌" prop="brand">
            <Input v-model="updateForm.brand"></Input>
          </FormItem>
          <FormItem label="型号" prop="type">
            <Input v-model="updateForm.type"></Input>
          </FormItem>
          <FormItem label="设备编码" prop="number">
            <Input v-model="addForm.number"></Input>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input v-model="updateForm.remark"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="update_loading" @click="handleUpdateSubmit()">保存</Button>
      </div>
    </Modal>
      <Modal v-model="updateEquipPop" width="400" @on-cancel="test">
          <p slot="header">
              <span>绑定装备信息</span>
          </p>
          <div>
              <Form ref="updateForm" :model="updateForm" :label-width="80">
                  <!--<FormItem label="名称" prop="equip_name">-->
                      <!--<Input v-model="updateForm.equip_name"></Input>-->
                  <!--</FormItem>-->
                  <!--<FormItem label="品牌" prop="brand">-->
                      <!--<Input v-model="updateForm.brand"></Input>-->
                  <!--</FormItem>-->
                  <!--<FormItem label="型号" prop="type">-->
                      <!--<Input v-model="updateForm.type"></Input>-->
                  <!--</FormItem>-->
                  <FormItem label="设备当前编码" readonly prop="number">
                      <Input v-model="updateForm.number"></Input>
                  </FormItem>
                  <FormItem label="扫描到的编码" readonly prop="newNumber">
                      <Input v-model="updateForm.newNumber"></Input>
                  </FormItem>
              </Form>
          </div>
          <div slot="footer">
              <Button type="info" size="large" long :loading="update_loading" @click="handleUpdateSubmit()">绑定</Button>
          </div>
      </Modal>
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
      updateEquipPop :false,
      update_loading: false,
      updateForm: {
        _index: null,
        id: "",
        equip_name: "",
        brand: "",
        type: "",
        number: "",
        newNumber: "",
        remark: ""
      },
      searchForm: {
        equip_name: "",
        brand: "",
        type: ""
      },
      tableData: [],
      tableColumns: [
        // {
        //   type: 'index',
        //   align: 'center'
        // },
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
          title: "备注",
          key: "remark",
          align: "center"
        },
        {
          title: "操作",
          key: "handle",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.updateEquip(params);
                    }
                  }
                },
                "绑定设备"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: "确定要删除吗?"
                  },
                  on: {
                    "on-ok": () => {
                      this.delete(params);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      on: {
                        click: () => {}
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
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
    test(){
      clearInterval(this.timer)
    },
    getTableData(searchForm) {
      searchForm = searchForm || this.searchForm;
      this.loading = true;
      this.$http
        .get("/api/equips", {
          params: {
            pageSize: this.pageSize,
            page: this.current,
            search: searchForm
          }
        })
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.tableData = data.result.equipList;
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
    showAddEquip() {
      this.$refs["addForm"].resetFields();
      this.addPop = true;
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
    update(params) {
      this.updatePop = true;
      let rowData = {
        _index: params.row._index,
        id: params.row.id,
        equip_name: params.row.equip_name,
        brand: params.row.brand,
        type: params.row.type,
        number: params.row.number,
        remark: params.row.remark
      };
      this.updateForm = rowData;
    },
    updateEquip(params) {
      this.updateEquipPop = true;
      let rowData = {
        _index: params.row._index,
        id: params.row.id,
        equip_name: params.row.equip_name,
        brand: params.row.brand,
        type: params.row.type,
        number: params.row.number,
        remark: params.row.remark
      };
      this.updateForm = rowData;
      var that = this;
      that.timer = setInterval( function () {
        /*that.$http.post("http://127.0.0.1:20085/moduleapi/syncinventory", {
          antennas: [4], "timeout": 300
        }, {
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
        }).then(res => {
          var a = JSON.stringify(res.data);
          if(a.result.length){
            this.$Message.error("扫到多个设备无法区分，请检查周围是否有其它设备！")
             clearInterval(that.timer);
          }else{
            this.newNumber = a.result[0].epc;
          }
        });*/
        /*测试本地代码*/
        var a = {"reader_name":"localreader/10.5.100.2","op_type:":"syncinventory","err_code":0,"err_string":"ok","result":[{"epc":"E2000017351002531180A037","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-61,"firstseen_timestamp":0,"lastseen_timestamp":0}]}
        if( a.result.length > 1 ){
          alert("扫到多个设备无法区分，请检查周围是否有其它设备！")
        }else{
          let rowData = {
            _index: params.row._index,
            id: params.row.id,
            equip_name: params.row.equip_name,
            brand: params.row.brand,
            type: params.row.type,
            number: params.row.number,
            newNumber: a.result[0].epc,
            remark: params.row.remark
          };
          that.updateForm = rowData
        }
      },800)
    },
    handleUpdateSubmit() {
      this.update_loading = true;
      var params = this.updateForm;
      params.number = params.newNumber;
      this.$http.post("/api/equips/update", params ).then(res => {
        var data = res.data;
        if (data.code == 200) {
          this.$Message.success({
            content: data.msg,
            duration: 1,
            onClose: () => {
              let tableData = this.tableData,
                index = this.updateForm._index,
                updateForm = this.updateForm;
              tableData[index].number = updateForm.newNumber;
              this.updateEquipPop = false;
              this.update_loading = false;
            }
          });
        } else {
          this.$Message.error(data.msg);
          this.update_loading = false;
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
