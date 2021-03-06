import Vue from 'vue'
import Vuex from 'vuex'



const state = {
    consumeData: [],
    earningsDate: [],
    settlementDate: [],
    timeline: {},
    allData: [],
    partnerList: [],
    platTableData: [],
    joinTableData: [],
    keepParnterAccount:[],
    consumeDataType: '',
    userName:'',
    cityName:'',
    franchiseeUserIconUrl:'',
    settelListId:'',
    recodeCityId:'',
}

const mutations = {
    recodeCityId(state,cityId){
        state.recodeCityId = cityId
    },
    updatLoginName(state,name){
        state.userName = name
    },
    updatCityName(state,cityName){
        state.cityName = cityName
    },
    updatefranchiseeUserIconUrl(state,franchiseeUserIconUrl){
        state.franchiseeUserIconUrl = franchiseeUserIconUrl
    },
    addPlatAcount(state, {obj}) {
        state.platTableData.push(obj)
    },
    addJoinAcount(state, {obj}) {
        state.joinTableData.push(obj)
    },
    consumeData_evaluation(state, arr) {
        state.consumeData =arr
    },
    earningDate_detail(state, { arr }) {
        state.earningsDate = arr
    },
    settlementDate_detail(state, { arr }) {
        state.settlementDate = arr
    },
    setTimeLine(state, obj) {
        state.timeline = obj
    },
    setAllData(state, { obj }) {
        state.allData = obj
    },
    setPartnerList(state, { arr }) {
        var arr2 = arr.newArr
        var arrDeled = []
        for (var i = 0; i < arr2.length; i++) {
            var newoObj = {}
            newoObj.name = arr2[i].name
            newoObj.sex = arr2[i].sex
            newoObj.IDcard = arr2[i].idCard
            newoObj.tel = arr2[i].phoneNo
            newoObj.email = arr2[i].email
            newoObj.cars = arr2[i].bikeNum
            newoObj.partnerId = arr2[i].id
            arrDeled.push(newoObj)
        }
        state.partnerList = arrDeled
    },
    keepParnterAccount(state,obj){
        state.keepParnterAccount.unshift(obj)
    },
    recodeConsumeDataType(state,str){
        state.consumeDataType =  str
    },
    recodeSettelListId(state,id){
        state.settelListId = id
    }
}
const actions = {
  setCityId(context,id){
      context.commit('recodeCityId',id)
  },
  setSettleListId(context,id){
    context.commit('recodeSettelListId',id)
  },  
  setUserName(context,userName){
    context.commit('updatLoginName',userName)
  },
  setCityName(context,cityName){
    context.commit('updatCityName',cityName)
  },
  setfranchiseeUserIconUrl(context,franchiseeUserIconUrl){
    context.commit('updatefranchiseeUserIconUrl',franchiseeUserIconUrl)
  },
   //  报表管理 消费数据模块 
  consumeData_action:({ commit }, newArr) => commit('consumeData_evaluation', newArr),
      // 营收记录 收益明细 结算记录模块 start
  earningsDate_action : ({ commit }, arr) => commit('earningDate_detail', { arr }),
  settlementDate_action : ({ commit }, arr) => commit('settlementDate_detail', { arr }),
      // 报表管理时间段传递  start 
  timeline_action : ({ commit }, obj) => commit('setTimeLine', { obj }),
      // 报表管理走势图数据  start  
  alldata_action : ({ commit }, obj) => commit('setAllData', { obj }),
      // 合伙人管理模块 start
  partner_action : ({ commit }, arr) => commit('setPartnerList', { arr })
}
const userName = state => state.userName
const getters = {
    userName : userName,
    cityName: state => state.cityName,
    franchiseeUserIconUrl: state => state.franchiseeUserIconUrl,
    settelListId: state => state.settelListId,
    cityId: state => state.recodeCityId
}
export default {
  state,
  mutations,
  actions,
  getters
}