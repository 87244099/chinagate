const Ajax = require("../../ajax/index");
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
    async attached(){
      let traceParam = {
        merchantForLevelAID: this.data.companyAID,
        merchantForLevelBID: this.data.companyBID,
        typeID: this.data.typeID,
        staffID: this.data.staffID,
        subID: this.data.subID
      }
      try{//可能需要登录权限
        await Ajax.reportTrace(traceParam);//直接上报，不管数据
      }catch(e){}
      
      let response = await Ajax.getTrace(traceParam);
      this.setData({
        "traceData": response.data.data
      });
    }
  }
})
