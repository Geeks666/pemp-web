<template>
  <div style="padding: 15px 15px 0 15px;">
    <Form :model="searchForm" :label-width="100" :inline="true">
      <FormItem label="演出名称" prop="show_name" :label-width="100">
        <Input v-model="searchForm.show_name" clearable></Input>
      </FormItem>
      <FormItem label="日期" prop="data_date" :label-width="60">
        <DatePicker v-model="searchForm.data_date" type="date"></DatePicker>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSearchSubmit">查询</Button>
      </FormItem>
    </Form>
    <Table :no-data-text="noDataText" :loading="loading" :height="initHeight" border :data="tableData" :columns="tableColumns" stripe :row-class-name="rowClassName"></Table>
    <div style="margin: 15px 0 0 0;overflow: hidden">
      <div style="float: left;">
        <Button type="primary" icon="md-add" @click="showAddPop">新建演出</Button>
      </div>
      <div style="float: right;">
        <Page :total="total" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="addPop" width="400" class="addPop">
      <p slot="header">
        <span>新增演出信息</span>
      </p>
      <div>
        <Form ref="addForm" :model="addForm" :label-width="80">
          <FormItem label="演出名称" prop="show_name">
            <Input v-model="addForm.show_name"></Input>
          </FormItem>
          <FormItem label="演出日期" prop="data_date">
            <DatePicker v-model="addForm.data_date" type="date"></DatePicker>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="add_loading" @click="handleAddSubmit()">保存</Button>
      </div>
    </Modal>

    <Modal v-model="updatePop" width="400" class="updatePop">
      <p slot="header">
        <span>编辑演出基本信息</span>
      </p>
      <div>
        <Form ref="updateForm" :model="updateForm" :label-width="80">
          <FormItem label="演出名称" prop="show_name">
            <Input v-model="updateForm.show_name"></Input>
          </FormItem>
          <FormItem label="演出日期" prop="data_date">
            <DatePicker v-model="updateForm.data_date" type="date"></DatePicker>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="update_loading" @click="handleUpdateSubmit()">保存</Button>
      </div>
    </Modal>

    <Drawer v-model="showPop" width="50" placement="left" :closable="false" :mask-closable="false" :transfer="false" :styles="styles" :inner="true" :scrollable="true">
      <div id="demo" style="display: none"></div>
      <p slot="header" style="overflow: hidden;">
        编辑演出装备信息
        <Button type="success" size="small" style="float:right;" @click="showEquipPop">添加演出使用装备</Button>
        <Button type="info" size="small" style="float:right;margin-right:10px" @click="printCode">打印二维码</Button>
        <Button type="warning" size="small" style="float:right;margin-right:10px" @click="qrCode">生成</Button>
      </p>
      <div>
        <Form ref="updateForm" :model="updateForm" :inline="true">
          <FormItem label="演出名称" prop="show_name" :label-width="100">
            <Input v-model="updateForm.show_name" clearable></Input>
          </FormItem>
          <FormItem label="日期" prop="data_date" :label-width="60">
            <DatePicker v-model="updateForm.data_date" type="date"></DatePicker>
          </FormItem>
        </Form>
        <Table :no-data-text="noDataTextSelected" :loading="loading" :height="initHeight" border :data="selectedTableData" :columns="selectedTableColumns" stripe :row-class-name="rowClassName"></Table>
      </div>
      <div class="left-drawer-footer">
        <Button style="margin-right: 8px" @click="showPop = equipPop = false">关闭</Button>
      </div>
    </Drawer>

    <Drawer title="可选择装备" v-model="equipPop" width="50" placement="right" :mask="false" :transfer="false" :styles="styles" :inner="true" :scrollable="true">
      <div>
        <Form :model="searchEquipForm" :label-width="40" :inline="true">
          <FormItem label="名称" prop="equip_name">
            <Input v-model="searchEquipForm.equip_name" clearable></Input>
          </FormItem>
          <FormItem label="品牌" prop="brand">
            <Input v-model="searchEquipForm.brand" clearable></Input>
          </FormItem>
          <FormItem label="型号" prop="type">
            <Input v-model="searchEquipForm.type" clearable></Input>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" @click="handleSearchEquipSubmit">查询</Button>
          </FormItem>
        </Form>
        <Table :no-data-text="noDataTextEquip" :loading="loadingEquip" :height="initHeight" border :data="selectionTableData" :columns="selectionTableColumns" stripe :row-class-name="rowClassName"></Table>
        <div style="margin: 15px 0 0 0;overflow: hidden">
          <div style="float: right;">
            <Page :total="totalEquip" :current="currentEquip" :page-size="pageSizeEquip" @on-change="changePageEquip"></Page>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addPop: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      code_numbers: [],
      total: 0,
      current: 1,
      pageSize: 10,

      add_loading: false,
      loading: false,

      noDataText: "读取中...",
      searchForm: {
        show_name: "",
        data_date: ""
      },
      tableData: [],
      tableColumns: [
        {
          title: "编号",
          type: "index",
          align: "center"
        },
        {
          title: "演出名称",
          key: "show_name",
          align: "center"
        },
        {
          title: "日期",
          key: "data_date",
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
                      this.update(params);
                    }
                  }
                },
                "编辑信息"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.getShowAndEquips(params);
                    }
                  }
                },
                "编辑装备"
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
                      this.handleDeleteSubmit(params);
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
      ],
      addForm: {
        show_name: "",
        data_date: ""
      },

      updatePop: false,
      update_loading: false,
      updateForm: {
        index: 0,
        id: 0,
        show_name: "",
        data_date: ""
      },

      showPop: false,
      loadingShow: false,
      noDataTextSelected: "读取中...",
      selectedTableData: [],
      selectedTableColumns: [
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
          title: "操作",
          key: "handle",
          align: "center",
          width: 130,
          render: (h, params) => {
            return h("div", [
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
                      this.handleDelSelected(params);
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
      ],

      equipPop: false,
      totalEquip: 0,
      currentEquip: 1,
      pageSizeEquip: 10,
      loadingEquip: false,
      noDataTextEquip: "读取中...",
      searchEquipForm: {
        equip_name: "",
        brand: "",
        type: ""
      },
      selectionTableData: [],
      selectionTableColumns: [
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
          title: "操作",
          key: "handle",
          align: "center",
          width: 70,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleAddSelected(params);
                    }
                  }
                },
                "添加"
              )
            ]);
          }
        }
      ],

      updateEquipCount: 0
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
    },
    selectedTableData(curVal, oldVal) {
      if (curVal.length == 0) {
        this.noDataTextSelected = "暂无数据";
      }
    }
  },
  methods: {
    rowClassName() {
      return "table-info-row";
    },

    getTableData(searchForm) {
      searchForm = searchForm || this.searchForm;
      this.loading = true;
      this.$http
        .get("/api/shows", {
          params: {
            pageSize: this.pageSize,
            page: this.current,
            search: searchForm
          }
        })
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.tableData = data.result.showList;
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

    showAddPop() {
      this.$refs["addForm"].resetFields();
      this.addPop = true;
    },
    handleAddSubmit() {
      this.add_loading = true;
      this.$http.post("/api/shows/add", this.addForm).then(res => {
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
    handleDeleteSubmit(params) {
      this.$http.post("/api/shows/delete", { id: params.row.id }).then(res => {
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
    },

    update(params) {
      this.updateForm = {
        index: params.index,
        id: params.row.id,
        show_name: params.row.show_name,
        data_date: params.row.data_date
      };
      this.updatePop = true;
    },
    handleUpdateSubmit() {
      this.update_loading = true;
      this.$http.post("/api/shows/update", this.updateForm).then(res => {
        var data = res.data;
        if (data.code == 200) {
          this.$Message.success({
            content: data.msg,
            duration: 1,
            onClose: () => {
              this.tableData[this.updateForm.index].show_name =
                data.result.show_name;
              this.tableData[this.updateForm.index].data_date =
                data.result.data_date;
              this.updatePop = false;
              this.update_loading = false;
            }
          });
        } else {
          this.$Message.error(data.msg);
          this.update_loading = false;
        }
      });
    },
    getShowAndEquips(params) {
      this.loadingShow = true;
      this.updateForm = {
        index: params.index,
        id: params.row.id,
        show_name: params.row.show_name,
        data_date: params.row.data_date
      };
      this.$http
        .get("/api/shows/selected_equips", {
          params: {
            id: params.row.id
          }
        })
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.selectedTableData = data.result.equipList;
          }
          this.loadingShow = false;
        });
      this.showPop = true;
    },

    showEquipPop() {
      this.equipPop = true;
      this.getSelectionEquips();
    },
    printCode (){
      // var code_numbers = JSON.stringify(this.code_numbers);
      this.$http
        .post("/api/shows/greate_check", {
          params: {
            numbers: this.code_numbers.brand,
            equip_id: this.code_numbers.equip_id,
            id: this.updateForm.id
          }
        })
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.selectedTableData = data.result.equipList;
          }
          this.loadingShow = false;
        });
      this.$options.methods.printdiv('demo');
    },
    getElem(data,that) {
      var htmlstr = "";
      $("#demo").html("");
      var brand = [];
      let equip_id = [];
      for(var i = 0; i<data.length; i++){
        console.log(data[i])
        htmlstr ='<div class="items" style="overflow: hidden">'
          +'<div id="qrcode_'+i+'" style="width:100px; height:100px; margin-top:15px;float:left"></div>'
          +'<div class="right" style="float:left;margin-left:15px;">'
          +'<h3>设备名称：'+ data[i].equip_name +'</h3>'
          +'<p><span class="">设备品牌：'+data[i].brand+'</span><span>设备型号：'+data[i].type+'</span></p>'
          +'</div>'
          +'</div>'
        $("#demo").append(htmlstr);
        var qrcode = new QRCode(document.getElementById("qrcode_"+i), {
          width : 100,
          height : 100
        });
        qrcode.makeCode(data[i].number +'_'+ i);
        brand.push(data[i].number +'_'+ i);
        equip_id.push(data[i].id);
      }
      return {brand,equip_id};
    },
    printdiv(printpage) {
      var headstr="<html><head><title></title></head><body>";
      var footstr="</body>";
      var newstr=document.all.item(printpage).innerHTML;
      var oldstr=document.body.innerHTML;
      /*document.body.innerHTML=headstr+newstr+footstr;*/

      var myWindow = window.open("", "打印", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no");
      var style = "<style type='text/css'>table.gridtable {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table.gridtable th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table.gridtable td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;}</style>";
      myWindow.document.write(headstr+newstr+footstr);
      myWindow.focus();
      myWindow.document.close();     //关闭document的输出流, 显示选定的数据
      myWindow.print();
      return myWindow;
      //document.body.innerHTML=oldstr;
      return false;
    },
    qrCode() {
      var a = this.$options.methods.getElem(this.selectedTableData,this);
      this.code_numbers = a;
    },
    handleSearchEquipSubmit() {
      this.current = 1;
      this.getSelectionEquips(this.searchEquipForm);
    },
    changePageEquip(pageEquip) {
      this.currentEquip = pageEquip;
      this.getSelectionEquips();
    },
    getSelectionEquips() {
      this.loadingEquip = true;
      this.$http
        .get("/api/shows/selection_equips", {
          params: {
            pageSize: this.pageSizeEquip,
            page: this.currentEquip,
            search: this.searchEquipForm
          }
        })
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.selectionTableData = data.result.equipList;
            this.totalEquip = data.result.total;
            this.currentEquip = data.result.current;
          }
          this.loadingEquip = false;
        });
    },
    handleAddSelected(params) {
      /*if (params.row.use_count == 0 || params.row.count == 0) {
        return;
      }*/
      // params.row.count = params.row.count - params.row.use_count;
      let status = true,
        rowData = {};
        //selectionNum = params.row.number;
      rowData.number = params.row.number;
      rowData.equip_name = params.row.equip_name;
      rowData.brand = params.row.brand;
      rowData.type = params.row.type;

      this.$http
        .post("/api/shows/selected_equip_add", {
          show_id: this.updateForm.id,
          equip_id: params.row.id,
        })
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.selectedTableData.push(rowData);
          } else {
            this.$Message.error(data.msg);
          }
        });
      return;
    },
    handleDelSelected(params) {
      this.$http
        .post("/api/shows/selected_equip_delete", { id: params.row.id })
        .then(res => {
          var data = res.data;
          if (data.code == 200) {
            this.$Message.success({
              content: data.msg,
              duration: 1,
              onClose: () => {
                this.selectedTableData.splice(params.index, 1);
                this.getSelectionEquips(this.searchEquipForm);
              }
            });
          } else {
            this.$Message.error(data.msg);
          }
        });
    },
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
.left-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.ivu-drawer-header p,
.ivu-drawer-header-inner {
  height: 24px;
  line-height: 24px;
}
.addPop .ivu-date-picker,
.updatePop .ivu-date-picker {
  width: 100%;
}
</style>
