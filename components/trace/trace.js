const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    companyAID:{
      type:Number,
      value: 0
    },
    fixRollback:{
      type: Boolean,
      value: true
    },
    companyBID:{
      type:Number,
      value: 0
    },
    typeID:{
      type:Number,
      value: 0
    },
    staffID:{
      type:Number,
      value: 0
    },
    subID: {
      type:Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes:{
    attached(){
      let that = this;
      (async()=>{
        let traceParam = {
          merchantForLevelAID: this.data.companyAID,
          merchantForLevelBID: this.data.companyBID,
          typeID: this.data.typeID,
          staffID: this.data.staffID,
          subID: this.data.subID
        }
        this.setData({
          "traceParam": traceParam
        })
        const app = getApp();

        if(app.globalData.openId){
          try{
            await Ajax.loginByOpenId(app.globalData.openId);
          } catch(e){}
            console.log("aaaaaaaaaaa");
            report(that);
        }else{
          Fai.Waiter.then("onOpenIdLoaded", ()=>{
            console.log("bbbbbbbbbb");
            report(that);
          });
        }
      })();
      
    }
  }
})


async function report(that){
  let traceParam = that.data.traceParam;
  traceParam.openId = getApp().globalData.openId;
  try{//可能需要登录权限
    await Ajax.reportTrace(traceParam);//直接上报，不管数据
  }catch(e){
    console.log("report err", e);
  }
  let response = await Ajax.getTrace(traceParam);
  that.setData({
    "traceData": response.data.data
  });
}
