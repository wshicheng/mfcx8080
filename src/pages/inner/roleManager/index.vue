<template>
  <div>
    <div v-title data-title="角色管理"></div>
    <div id="am_search">
      <label>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="角色名称">
            <el-input v-model="roleName" v-on:blur="initRole" placeholder="请输入角色名称"></el-input>
          </el-form-item>
        </el-form>
      </label>
      <el-button @click="queryRole" id="roleSearchBtn">查询</el-button>
    </div>

    <!-- account -->
    <div class="account" id="addAccount">
      <h1>
        <button type="button" @click="openAddRole">添加角色</button>
        <el-dialog class="addRole" title="添加角色" :visible.sync="dialogFormVisible" :modal-append-to-body="false" :modal="true">
          <el-form :model="form" :rules="rules" ref="ruleForm">
            <el-form-item label="角色名称" prop="roleName" class="rolename" :label-width="formLabelWidth">
              <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="备注" class="rolename" prop="description" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="权限列表" class="rolename" :label-width="formLabelWidth">
              <el-tree :data="rolePowerList" show-checkbox ref="tree" node-key="id" :props="defaultProps">
              </el-tree>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer addfooter">
            <el-button class="addRoleBtn" type="primary" @click="handleAddRole">立即创建</el-button>
            <el-button class="addRoleBtn" @click="cancleForm">取消</el-button>
          </div>
        </el-dialog>
      </h1>

      <!-- 表单 -->
      <el-table :data="tableData" style="width: 100%; font-size:13px;" :empty-text="emptyText" v-loading="loading2" element-loading-text="拼命加载中">
        <el-table-column prop="roleName" label="角色名称" min-width="160"></el-table-column>
        <el-table-column prop="description" label="备注" min-width="160"></el-table-column>
        <el-table-column label="包含用户" min-width="170">
          <template scope="scope">
            <ul class="roleList">
              <el-tag v-for="name in scope.row.franchiseeUserList" :key="name" type="gray">
                {{name + ''}}
              </el-tag>
              <!-- <li :key="name" v-for="name of scope.row.names">{{name}}</li> -->
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="del" label="操作">
          <template scope="scope">
            <i class="el-icon-edit" style="margin-right:10px;" @click="openEditRole(scope)" title="修改"></i>
            <i class="el-icon-close" title="删除" @click="handleDeleteRole(scope)"></i>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog id="modifyRoles" v-loading="loading2" title="修改角色" :visible.sync="dialogEditVisible" :modal-append-to-body="false" :modal="true">

        <el-form :model="editForm" :rules="editRules" ref="editRuleForm">
          <el-form-item label="角色名称" prop="roleName" class="rolename" :label-width="formLabelWidth">
            <el-input v-model="editForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="description" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="editForm.description"></el-input>
          </el-form-item>
          <el-form-item label="权限列表" :label-width="formLabelWidth">
            <el-tree :data="editForm.rolePowerList" show-checkbox ref="tree" node-key="id" :props="defaultProps2" :default-checked-keys="fathCode">
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer editfooter">

          <el-button class="eidtRoleBtn" @click="handleEditRole">确定</el-button>
          <el-button class="eidtRoleBtn" @click="handleCancelEdit">取消</el-button>
        </div>
      </el-dialog>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="10" layout="prev, pager, next, jumper" v-show="pageShow" :total="totalItems">
      </el-pagination>
    </div>

    <!--<div v-show='router_show' >-->
    <router-view id="account_router"></router-view>
    <!--</div>-->
  </div>
</template>

<script>
import $ from 'jquery'
import request from 'superagent'
import { host } from '../../../config/index'
export default {
  data() {
    var validateRoleName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色名'));
      } else {
        callback();
      }
    }
    return {
      rowMenuList: [],
      timer: null,
      emptyText: ' ',
      flag: false,
      isQuery: false,
      currentPage3: 1,
      totalItems: 1,
      pageShow: false,
      roleName: '',
      loading: false,
      loading2: false,
      input: '',
      dialogFormVisible: false,
      dialogEditVisible: false,
      currentPage: 1,
      totalPage: 1,
      tableData: [],
      initData: [],
      fathCode: [],
      menuStr: '',
      menuList: [],
      childrenCode: [],
      router_show: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultProps2: {
        children: 'children',
        label: 'label'
      },
      rolePowerList: [
        {
          id: 1100,
          label: '首页'
        },
        {
          id: 1200,
          label: '车辆管理'
        },
        {
          id: 1401,
          label: '订单明细'
        },
        {
          id: 1300,
          label: '报表统计',
          children: [
            {
              id: 1301,
              label: '订单数据'
            },
            // {
            //   id: 1302,
            //   label: '24小时数据走势'
            // },
            // {
            //   id: 1303,
            //   label: '热力图'
            // },
            // {
            //   id: 1304,
            //   label: '异常数据'
            // }
          ]
        },
        //  {
        //   id: 2000,
        //   label: '账号管理'
        // },
        {
          id: 1402,
          label: '结算管理'
        },
        // {
        //   id: 2000,
        //   label: '合伙人管理'
        // },
        // {
        //   id: 1400,
        //   label: '营收管理',
        //   children: [
        //     {
        //       id: 1401,
        //       label: '收益明细'
        //     },
        //     {
        //       id: 1402,
        //       label: '结算记录'
        //     },
        //   ]
        // },
        {
          id: 1600,
          label: '个人中心'
        },
        {
          id: 1500,
          label: '账号管理'
        },
        {
          id: 1700,
          label: '角色管理'
        },
        // {
        //   id: 1800,
        //   label: '信息中心'
        // },
        // {
        //   id: 1900,
        //   label: '日志管理',
        //   children: [
        //     {
        //       id: 1901,
        //       label: '登录日志'
        //     },
        //     {
        //       id: 1902,
        //       label: '操作日志'
        //     },
        //   ]
        // }
      ],
      form: {
        roleName: '',
        description: ''
      },
      formLabelWidth: '120px',
      editForm: {
        roleName: '',
        des: '',
        id: '',
        index: '',
        roleType: '',
        rolePowerList: [
          {
            id: 1100,
            label: '首页'
          },
          {
            id: 1200,
            label: '车辆管理'
          },
          {
            id: 1401,
            label: '订单明细'
          },
          {
            id: 1300,
            label: '报表统计',
            children: [
              {
                id: 1301,
                label: '订单数据'
              },
              // {
              //   id: 1302,
              //   label: '24小时数据走势'
              // },
              // {
              //   id: 1303,
              //   label: '热力图'
              // },
              // {
              //   id: 1304,
              //   label: '异常数据'
              // }
            ]
          },
          //  {
          //   id: 2000,
          //   label: '账号管理'
          // },
          {
            id: 1402,
            label: '结算管理'
          },
          // {
          //   id: 2000,
          //   label: '合伙人管理'
          // },
          // {
          //   id: 1400,
          //   label: '营收管理',
          //   children: [
          //     {
          //       id: 1401,
          //       label: '收益明细'
          //     },
          //     {
          //       id: 1402,
          //       label: '结算记录'
          //     },
          //   ]
          // },
          {
            id: 1600,
            label: '个人中心'
          },
          {
            id: 1500,
            label: '账号管理'
          },
          {
            id: 1700,
            label: '角色管理'
          },
          // {
          //   id: 1800,
          //   label: '信息中心'
          // },
          // {
          //   id: 1900,
          //   label: '日志管理',
          //   children: [
          //     {
          //       id: 1901,
          //       label: '登录日志'
          //     },
          //     {
          //       id: 1902,
          //       label: '操作日志'
          //     },
          //   ]
          // }
        ]
      },
      rules: {
        roleName: [
          { validator: validateRoleName, trigger: 'blur', required: true }
        ]
      },
      editRules: {
        roleName: [
          { message: '角色名称不能为空', trigger: 'blur', required: true }
        ]
      },
      isSearch: false
    }
  },
  methods: {
    cancleForm(){
      this.dialogFormVisible = false
      this.$refs.ruleForm.resetFields()
       this.$refs.tree.setCheckedKeys([]);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    loadRole() {
      var that = this
      this.loading2 = true
      this.emptyText = ' '
      request
        .post(host + 'beepartner/franchisee/Role/findFranchiseeRole')
        .withCredentials()
        .set({
          'content-type': 'application/x-www-form-urlencoded'
        })
        .send({
          currentPage: 1,
          roleName: this.roleName.trim()
        })
        .end((err, res) => {
          if (err) {
            console.log(err)
            this.loading2 = false
            this.emptyText = '暂无数据'
          } else {
            this.loading2 = false
            var code = JSON.parse(res.text).resultCode;
            if (code != -1) {
              var result = JSON.parse(res.text).data
              var totalPage = JSON.parse(res.text).totalPage

              var message = JSON.parse(res.text).message
              if (message == '用户登录超时') {
                this.emptyText = '暂无数据'
                return;
              }
              var newArr = result.map((item) => {
                var arr = item.franchiseeUserList.map((item) => {
                  return item.userName
                })
                return Object.assign({}, item, { franchiseeUserList: arr })
              })
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
                this.emptyText = '暂无数据'
              }
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              that.tableData = newArr
            }else{
              this.pageShow = false
              that.tableData = []
              this.emptyText = '暂无数据'
            }

            //that.initData = that.tableData
          }
        })
    },
    initRole() {
      this.isQuery = false
      this.currentPage3 = 1
      if (this.roleName.trim().length === 0) {
        this.isSearch = false
        var that = this
        request
          .post(host + 'beepartner/franchisee/Role/findFranchiseeRole')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            currentPage: 1,
            roleName: this.roleName.trim()
          })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              var result = JSON.parse(res.text).data
              var totalPage = JSON.parse(res.text).totalPage
              var newArr = result.map((item) => {
                var arr = item.franchiseeUserList.map((item) => {
                  return item.userName
                })
                return Object.assign({}, item, { franchiseeUserList: arr })
              })
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              that.tableData = newArr
              that.initData = that.tableData
            }
          })
      }
    },
    queryRole() {
      this.isSearch = true
      var that = this
      if (this.roleName.trim().length !== 0) {
        this.isQuery = true
        request
          .post(host + 'beepartner/franchisee/Role/findFranchiseeRole')
          .withCredentials()
          .set({
            'content-type': 'application/x-www-form-urlencoded'
          })
          .send({
            currentPage: 1,
            roleName: this.roleName.trim()
          })
          .end((err, res) => {
            if (err) {
              console.log(err)
            } else {
              var result = JSON.parse(res.text).data
              var totalPage = JSON.parse(res.text).totalPage
              var newArr = result.map((item) => {
                var arr = item.franchiseeUserList.map((item) => {
                  return item.userName
                })
                return Object.assign({}, item, { franchiseeUserList: arr })
              })
              if (totalPage > 1) {
                this.pageShow = true
              } else {
                this.pageShow = false
              }
              this.totalItems = Number(JSON.parse(res.text).totalItems)
              that.tableData = newArr
              that.initData = that.tableData
            }
          })
      }
    },
    openAddRole() {
      this.dialogFormVisible = true
      this.flag = false
    },
    openEditRole(scope) {
      
      this.rowMenuList = scope.row.menuList.map((item) => { return item * 1 })
      var that = this;
      setTimeout(function() {
        that.setCheckedKeys()
      }, 200)
      //this.$refs.tree.setCheckedKeys([]);
      this.dialogEditVisible = true
      this.editForm.roleName = scope.row.roleName
      this.editForm.description = scope.row.description
      this.editForm.id = scope.row.id
      this.editForm.index = scope.$index
      this.editForm.roleType = scope.row.roleType
      this.fathCode = []
      this.childrenCode = []
    },
    handleEditRole() {
      var that = this
      this.flag = false
      this.menuList = this.getCheckedKeys().map((item) => {
        return item
      })
      this.menuStr = this.menuList.join('-')
      this.$refs.editRuleForm.validate((valid) => {
        if (valid) {
          request
            .post(host + 'beepartner/admin/Role/updateRole')
            .withCredentials()
            .set({
              'content-type': 'application/x-www-form-urlencoded'
            })
            .send({
              id: that.editForm.id,
              roleName: that.editForm.roleName,
              description: that.editForm.description,
              menuStr: this.menuStr
            })
            .end(function(err, res) {
              if (err) {
                console.log(err)
              } else {
                that.loading2 = false
                var code = JSON.parse(res.text).resultCode
                if (code === 1) {
                  that.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  that.flag = true
                  //that.tableData.splice(that.editForm.index,1,{roleName: that.editForm.roleName,des: that.editForm.des, id: that.editForm.id})
                  that.dialogEditVisible = false
                } else {
                  var message = JSON.parse(res.text).message
                  that.$message({
                    type: 'error',
                    message: message
                  })
                }
              }
            })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    handleDeleteRole(scope) {
      var that = this
      
       if(scope.row.franchiseeUserList.length>0){
        this.$message({
          type:'error',
          message:'该角色下有用户，禁止删除！'
        })
        return;
      }
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.loading2 = true
        if (scope.row.franchiseeUserList.length > 0) {
          that.$message({
            type: 'error',
            message: '该角色下有用户，不可删除!'
          })
        } else {
          request
            .post(host + 'beepartner/franchisee/Role/deleteFranchiseeRole')
            .withCredentials()
            .set({
              'content-type': 'application/x-www-form-urlencoded'
            })
            .send({
              id: scope.row.id,
            })
            .end((err, res) => {
              if (err) {
                console.log(err)
              } else {
                var code = JSON.parse(res.text).resultCode
                if (code === 1) {
                  that.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                  that.tableData.splice(scope.$index, 1)
                  that.loading2 = false
                } else {
                  that.loading2 = false
                  that.$message({
                    type: 'error',
                    message: '删除失败!'
                  })
                }
              }
            })
        }
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })   
      })
    },
    handleAddRole() {
      this.menuList = this.getCheckedKeys().map((item) => {
        return item
      })
      this.menuStr = this.menuList.join('-')
      var that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          clearTimeout(this.timer)
          this.timer = setTimeout(function() {
            request
              .post(host + 'beepartner/franchisee/Role/addFranchiseeRole')
              .withCredentials()
              .set({
                'content-type': 'application/x-www-form-urlencoded'
              })
              .send({
                description: that.form.description,
                roleName: that.form.roleName,
                menuStr: that.menuStr,
              })
              .end((err, res) => {
                if (err) {
                  console.log(err)
                } else {
                  var code = JSON.parse(res.text).resultCode
                  if (code === 1) {
                    that.$message({
                      type: 'success',
                      message: '恭喜您！添加角色成功'
                    })
                    that.flag = true
                    that.dialogFormVisible = false
                    that.$refs.ruleForm.resetFields()
                    that.$refs.tree.setCheckedKeys([]);
                    
                    //that.tableData.unshift({description: that.form.description,franchiseeUserList:[],roleName:that.form.roleName})
                  } else {
                    that.$refs.ruleForm.resetFields()
                    that.$refs.tree.setCheckedKeys([]);
                    that.dialogFormVisible = false
                    that.$message({
                      type: 'error',
                      message: 'sorry!添加角色失败'
                    })
                  }
                }
              })
          }, 200)
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys()
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys(this.rowMenuList)
    },
    handleCancelEdit() {
      this.dialogEditVisible = false
      this.$refs.tree.setCheckedKeys([])
      this.rowMenuList = [];
    }
  },
  mounted() {
    this.loadRole()
    $(".sign").removeClass('is-active')
    $('.sign[name="1700"]').addClass('is-active')


  },
  watch: {
    'flag': {
      handler: function() {
        if (this.flag) {
          this.loadRole()
        } else {
          this.loading2 = false
          return
        }
      },
      deep: true
    },
    currentPage3: {
      handler: function(val, oldVal) {
        var that = this
        if (this.isQuery === false) {
          this.loading2 = true
          // 初始化查询
          request
            .post(host + 'beepartner/franchisee/Role/findFranchiseeRole')
            .withCredentials()
            .set({
              'content-type': 'application/x-www-form-urlencoded'
            })
            .send({
              currentPage: val,
              roleName: this.isSearch === false?'':this.roleName.trim()
            })
            .end((err, res) => {
              if (err) {
                this.loading2 = false
                console.log(err)
              } else {
                this.loading2 = false
                var result = JSON.parse(res.text).data
                var totalPage = JSON.parse(res.text).totalPage
                var newArr = result.map((item) => {
                  var arr = item.franchiseeUserList.map((item) => {
                    return item.userName
                  })
                  return Object.assign({}, item, { franchiseeUserList: arr })
                })
                if (totalPage > 1) {
                  this.pageShow = true
                } else {
                  this.pageShow = false
                }
                this.totalItems = Number(JSON.parse(res.text).totalItems)
                that.tableData = newArr
                that.initData = that.tableData
              }
            })
        } else {
          // 筛选查询
          this.loading2 = true
          request
            .post(host + 'beepartner/franchisee/Role/findFranchiseeRole')
            .withCredentials()
            .set({
              'content-type': 'application/x-www-form-urlencoded'
            })
            .send({
              currentPage: val,
              roleName: this.isSearch === false?'':this.roleName.trim()
            })
            .end((err, res) => {
              if (err) {
                this.loading2 = false
                console.log(err)
              } else {
                this.loading2 = false
                var result = JSON.parse(res.text).data
                var totalPage = JSON.parse(res.text).totalPage
                var newArr = result.map((item) => {
                  var arr = item.franchiseeUserList.map((item) => {
                    return item.userName
                  })
                  return Object.assign({}, item, { franchiseeUserList: arr })
                })
                if (totalPage > 1) {
                  this.pageShow = true
                } else {
                  this.pageShow = false
                }
                this.totalItems = Number(JSON.parse(res.text).totalItems)
                that.tableData = newArr
                that.initData = that.tableData
              }
            })
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.el-pagination {
  padding-left: 0;
  border-left: 0;
  margin-top: 20px;
  margin-bottom: 10px;
}

html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
td,
tr,
th,
table,
thead,
tbody,
dl,
dt,
dd,
p,
span,
ul,
li,
ol {
  margin: 0;
  padding: 0;
}

body {
  background: #f2f2f2;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}


/*#account_router_cover {
  width: 100%;
  height: 100%;
  background: rgba(128,128,128,0.6);
  position: fixed;
  left: 0;
  top: 0;
}*/

#account_router {
  width: 100%;
  height: 100%;
  background: rgba(68, 68, 68, 0.6);
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}


div.account {
  /* width: 100%; */
  padding: 0 20px 10px 20px;
  background: #fff;
  margin-top: 20px;
  border: 1px solid #e7ecf1;
  border-bottom: none;
}

div.account>h1 {
  width: 90%;
  height: 68px;
  line-height: 55px;
}

div.account>h1 button {
  width: 100px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  border: none;
  outline: none;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
  background: rgba(66, 66, 66, 0.8);
  transition: all .2s linear 0s;
}

div.account>h1 button:hover {
  background: rgb(66, 66, 66);
  cursor: pointer;
}

#am_search {
  width: 100%;
  height: 70px;
  background: #fff;
  border: 1px solid #e7ecf1;
}

.account_my_input {
  width: 320px;
  height: 30px;
  outline: none;
  border-radius: 4px;
  margin-top: 4px;
  border: 1px solid #ddd;
  display: inline-block;
}

#am_search label {
  /* width: 190px; */
  margin-top: 15px;
  margin-left: 20px;
  float: left;
}

#am_search label span {
  line-height: 70px;
  font-weight: 400;
  font-size: 14px;
  display: block;
  margin-right: 10px;
  float: left;
}

#am_search button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  float: right;
  background: #fff;
  border: 1px solid #c4c4c4;
  color: #1f2d3d;
  margin: 18px 34px;
  padding: 10px 15px;
  border-radius: 4px;
}

#am_search button:hover {
  color: #20a0ff;
  border-color: #20a0ff;
}

.el-table__body,
.el-table__footer,
.el-table__header {
  border: 2px solid red;
}

#account_page {
  padding: 4px 10px 0 20px;
  padding-bottom: 100px;
  background: #fff;
  border: 1px solid #e7ecf1;
  border-top: none;
  min-height: 230px;
}

.el-switch__label,
.el-switch__label * {
  font-size: 12px;
}
ul.roleList{margin-left:-7px;}
ul.roleList li {
  list-style-type: none;
  float: left;
}

span.el-tag {
  margin-left: 10px;
  padding: 0 10px;
  margin-bottom: 5px;
  margin-top: 5px;
}

i.el-icon-edit,
i.el-icon-close {
  cursor: pointer
}

.eidtRoleBtn {
  width: 120px;
  height: 50px;
}

.eidtRoleBtn:nth-of-type(1):hover {
  background: rgba(248, 126, 43, 0.9);
  color: #fff;
}

.eidtRoleBtn:nth-of-type(1) {
  background: #f87e2b;
  border: none;
  color: #fff;
}

.eidtRoleBtn:nth-of-type(2) {
  background: #fff;
  color: #444;
  border: 1px solid rgba(196, 196, 196, 1)
}

.eidtRoleBtn:nth-of-type(2):hover {
  border: 1px solid rgb(248, 126, 43);
  color: rgb(248, 126, 43);
}

div.account>h1 .addRoleBtn {
  width: 120px;
  height: 50px;
  font-size: 14px;
}

div.account>h1 .addRoleBtn:nth-of-type(1):hover {
  background: rgba(248, 126, 43, 0.9)
}

div.account>h1 .addRoleBtn:nth-of-type(1) {
  background: #f87e2b;
  border: none;
  color: #fff;
  margin-left: 100px;
}

div.account>h1 .addRoleBtn:nth-of-type(2) {
  background: #fff;
  color: #444;
  border: 1px solid rgba(196, 196, 196, 1)
}

div.account>h1 .addRoleBtn:nth-of-type(2):hover {
  border: 1px solid rgb(248, 126, 43);
  color: rgb(248, 126, 43);
}

button#roleSearchBtn {
  width: 80px;
  /* float: right; */
  height: 36px;
  line-height: 11px;
  margin-right: 30px;
  color: #fff;
  margin-top: 18px;
  outline: none;
  border: none;
  /* border-radius: 4px; */
  background: rgba(52, 52, 67, 0.8);
}

button#roleSearchBtn:hover {
  color: #fff
}

div.editfooter {
  text-align: left;
  padding-left: 220px;
  margin-top: -43px;
}

div.addfooter {
  text-align: left;
  padding-left: 120px;
  margin-top: -51px;
  margin-bottom: 8px;
}

div.rolename {
  font-weight: normal;
}

div.el-tree {
  width: 340px;
}

div.el-textarea {
  width: 340px;
}

span.el-tag {
  padding: 0;
  background-color: transparent;
  border: none;
}
</style>

