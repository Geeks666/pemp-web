<template>
  <div>
    <div>
      <Form :model="searchForm" :label-width="100" :inline="true">
        <FormItem label="仓库名称" prop="store_name" :label-width="60">
          <Input v-model="searchForm.store_name" clearable></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearchSubmit()">查询</Button>
        </FormItem>
      </Form>
    </div>
    <Table :no-data-text="noDataText" :loading="loading" :height="initHeight" border :data="tableData" :columns="tableColumns" stripe :row-class-name="rowClassName"></Table>
    <div style="margin: 15px 0 0 0;overflow: hidden">
      <div style="float: left;">
        <Button type="primary" icon="md-add" @click="openStoreForm">新建仓库</Button>
      </div>
      <div style="float: right;">
        <Page :total="total" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="createStoreModal" width="360">
      <p slot="header">
        <span>新增仓库</span>
      </p>
      <div>
        <Form ref="formCreateStore" :model="formCreateStore" :label-width="80">
          <FormItem label="仓库名称" prop="store_name">
            <Input v-model="formCreateStore.store_name"></Input>
          </FormItem>
          <FormItem label="本地编号" prop="store_number">
            <Input v-model="formCreateStore.store_number"></Input>
          </FormItem>
          <FormItem label="地址" prop="address">
            <Input v-model="formCreateStore.address"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="user_loading" @click="handleStoreCreateSubmit()">保存仓库</Button>
      </div>
    </Modal>
    <Modal v-model="updateStoreModal" width="360">
      <p slot="header">
        <span>更改仓库信息</span>
      </p>
      <div>
        <Form ref="formUpdateStore" :model="formUpdateStore" :label-width="80">
          <FormItem label="仓库名称" prop="store_name">
            <Input v-model="formUpdateStore.store_name"></Input>
          </FormItem>
          <FormItem label="本地编号" prop="store_number">
            <Input v-model="formUpdateStore.store_number"></Input>
          </FormItem>
          <FormItem label="地址" prop="address">
            <Input v-model="formUpdateStore.address"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="info" size="large" long :loading="user_loading" @click="handleStoreUpdateSubmit()">保存仓库</Button>
      </div>
    </Modal>
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
        createStoreModal:false,
        updateStoreModal:false,
        noDataText: "读取中...",
        searchForm: {
          store_name: ""
        },
        formCreateStore: {
          store_number:'',
          store_name:'',
          adress:''
        },
        formUpdateStore: {
          id: -1,
          store_number:'',
          store_name:'',
          adress:''
        },

        tableData: [],
        tableColumns: [
          {
            title: "名称",
            key: "store_name",
            align: "center"
          },
          {
            title: "编号",
            key: "store_number",
            align: "center"
          },
          {
            title: "地址",
            key: "address",
            align: "center"
          },{
            title: "操作",
            key: "address",
            align: "center",
            render:(h,params)=>{
              return h('div',[
                h("Button",{
                  props:{
                    type: 'primary',
                    size: 'small'
                  },
                  style:{
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleUpdateStore(params)
                    }
                  }
                },'编辑'),
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
                        this.handleStoreDel(params);
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
              ])
            }
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
          .post("/api/store/serach", { store_name:searchForm.store_name })
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
      handleUpdateStore(params) {
        this.updateStoreModal = true;
        this.formUpdateStore = {
          id: params.row.id,
          store_number: params.row.store_number,
          store_name: params.row.store_name,
          address: params.row.address,
        };
      },
      handleStoreDel(params) {
        console.log(123)
        this.$http.post("/api/store/delete", { id: params.row.id }).then(res => {
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
      handleSearchSubmit() {
        this.current = 1;
        this.getTableData(this.searchForm);
      },
      handleStoreUpdateSubmit() {
        this.user_loading = true;
        this.$http
          .post("/api/store/update", this.formUpdateStore )
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.$Message.success({
                content: data.msg,
                duration: 1,
                onClose: () => {
                  this.getTableData();
                }
              });
              this.updateStoreModal = false;
            }else{

            }
            this.user_loading = false;
            this.loading = false;
          });
      },

      handleStoreCreateSubmit() {
        this.user_loading = true;
        this.$http
          .post("/api/store/create", this.formCreateStore )
          .then(res => {
            var data = res.data;
            if (data.code == 200) {
              this.$Message.success({
                content: data.msg,
                duration: 1,
                onClose: () => {
                  this.getTableData();
                }
              });
              this.createStoreModal = false;
            }else{

            }
            this.loading = false;
            this.user_loading = false;
          });
      },
      openStoreForm() {
        this.createStoreModal = true;
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
