import login from '../pages/login/index.vue'
import index from '../pages/index/index.vue'
import pageIndex from '../pages/inner/pageIndex/index.vue'

// [ ====== partnerManager ====== ]
import carManager from '../pages/inner/carManager/index.vue'
import carUseDetail from '../pages/inner/carUseDetail/index.vue'

// [ ====== consumeData ====== ]
import consumeData from '../pages/inner/consumeData/index.vue'
import queryCharts from '../pages/inner/queryCharts/index.vue'
import queryLists from '../pages/inner/queryLists/index.vue'

import allDaysData from '../pages/inner/alldaysData/index.vue'
import hotMap from '../pages/inner/hotMap/index.vue'
import abnormalData from '../pages/inner/abnormalData/index.vue'

// [ ====== partnerManager ====== ]
import partnerManager from '../pages/inner/partnerManager/index.vue'
import addpartner from '../pages/inner/partnerManager/addpartner.vue'
import checkpartner from '../pages/inner/partnerManager/checkpartner.vue'

import earningsDetail from '../pages/inner/earningsDetail/index.vue'

// [ ====== settlementRecord ====== ]
import settlementRecord from '../pages/inner/settlementRecord/index2.vue'
import applyaccount from '../pages/inner/settlementRecord/applyaccount.vue'
import applysubmitted from '../pages/inner/settlementRecord/applysubmitted.vue'
import settlementRecordDetail from '../pages/inner/settlementRecord/settlementRecordDetail.vue'

// [ ====== accountManager ====== ]
import accountManager from '../pages/inner/accountManager/index.vue'
import addaccount from '../pages/inner/accountManager/addaccount.vue'

// [ ====== memberCenter ====== ]
import memberCenter from '../pages/inner/memberCenter/index.vue'
import bindEamil from '../pages/inner/memberCenter/bindEamil.vue'
import updateEmail from '../pages/inner/memberCenter/updateEmail.vue'
import bindTel from '../pages/inner/memberCenter/bindTel.vue'
import updateTel from '../pages/inner/memberCenter/updateTel.vue'
import amendPassword from '../pages/inner/memberCenter/amendPassword.vue'

// [ ====== roleManager ====== ]
import roleManager from '../pages/inner/roleManager/index.vue'
import addrole from '../pages/inner/roleManager/addrole.vue'

import messageCenter from '../pages/inner/messageCenter/index.vue'

// [ ====== logManager ====== ]
import logManager from '../pages/inner/logManager/index.vue'
import loginlog from '../pages/inner/logManager/loginlog.vue'
import operationLog from '../pages/inner/logManager/operationLog.vue'

import NotFoundPage from '../pages/404/index.vue'
import stautsError from '../pages/500/index.vue'
export default [{
    path: '/',
    component: index,
    children: [{
        path: '/system/office',
        name: '首页',
        auth: 1100,
        component: pageIndex
      },
      {
        path: '/index/carManager',
        name: '车辆管理',
        auth: 1200,
        component: carManager
      },
      {
        path: '/index/earningsDetail',
        name: '订单明细',
        auth: 1401,
        component: earningsDetail
      },
      {
        path: '/index/consumeData',
        auth: 1301,
        component: consumeData,
        children: [{
            path: '/',
            name: '查看列表',
            component: queryLists
          },
          {
            path: '/index/consumeData/queryCharts',
            name: '查看统计图',
            component: queryCharts
          }
        ]
      },
     
      {
        path: '/index/settlementRecord',
        name: '结算记录',
        auth: 1402,
        component: settlementRecord
      },
      {
        auth: 1402,
        path: '/index/applyaccount',
        name: '申请结算(单月待结算)',
        component: applyaccount
      },
      {
        auth: 1402,
        path: '/index/applysubmitted/:id',
        name: '申请结算(结算状态)',
        component: applysubmitted
      },
      {
        path: '/index/memberCenter',
        auth: 1600,
        name: '个人中心',
        component: memberCenter,
        children: [{
            path: '/index/memberCenter/bindEamil',
            name: '绑定邮箱',
            component: bindEamil
          },
          {
            path: '/index/memberCenter/updateEmail',
            name: '修改邮箱',
            component: updateEmail
          },
          {
            path: '/index/memberCenter/bindTel',
            name: '绑定手机号',
            component: bindTel
          },
          {
            path: '/index/memberCenter/updateTel',
            name: '修改手机号',
            component: updateTel
          },
          {
            path: '/index/memberCenter/amendPassword',
            name: '修改密码',
            component: amendPassword
          }
        ]
      },
      {
        path: '/index/accountManager',
        name: '账号管理',
        auth: 1500,
        component: accountManager,
        children: [{
          path: '/index/accountManager/addaccount',
          name: '添加账号',
          component: addaccount
        }]
      },
   
      {
        path: '/index/roleManager',
        name: '角色管理',
        auth: 1700,
        component: roleManager,
        children: [{
          path: '/index/roleManager/addrole',
          name: '添加角色',
          component: addrole
        }]
      }
    ]
  },
  {
    auth: 1200,
    path: '/index/carManager/carUseDetail',
    name: '车辆明细',
    component: carUseDetail
  },
  {
    path: '/index/settlementRecord/detail',
    name: '结算记录明细',
    auth: 1402,
    component: settlementRecordDetail
  },
]
