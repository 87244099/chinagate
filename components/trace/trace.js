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
        staffID: this.data.staffID
      }
      // Ajax.reportTrace(traceParam);

      // response = await Ajax.getTrace(traceParam);
      // this.setData({
      //   "traceData": response.data.data
      // });
    }
  }
})
