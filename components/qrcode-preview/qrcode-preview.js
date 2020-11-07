// components/qrcode-preview/qrcode-preview.js
const Ajax = require("../../ajax/index");
const Fai = require("../../utils/util");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    setting:{
      type: Object,
      value:  {}
    },
    logo: {
      type: String,
      value: ""
    },
    companyInfo: {
      type: Object,
      value: {}
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
    belongMember(memberInfo, setting){
      return memberInfo.merchantForLevelAID == setting.companyAID 
      && memberInfo.merchantForLevelBID == setting.companyBID;
    },
    async previewQrCode(){
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;
      let setting = Fai.deepCopy(this.data.setting);
      if(this.belongMember(memberInfo, setting)){
        setting.staffID = memberInfo.staffID;
        console.log("员工生成产品码")
      }else{
        console.log("普通人生成产品码")
      }

      let url = Fai.getCurrAbsPath();
      let urlArr = url.split("?");
      let qr = Ajax.stringifyQrCodeArg({
        ...this.data.setting,
        id: this.data.setting.productId
      });
      Ajax.previewQrCode(urlArr[0], "qr="+qr,  this.data.logo, this.data.companyInfo.shortName);
    }
  }
})
