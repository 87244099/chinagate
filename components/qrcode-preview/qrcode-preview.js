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
    previewQrCode(){
      let url = Fai.getCurrAbsPath();
      let urlArr = url.split("?");
      let qr = Ajax.stringifyQrCodeArg({
        ...this.data.setting,
        id: this.data.setting.productId
      });
      Ajax.previewQrCode(urlArr[0], "qr="+qr,  this.data.logo, companyInfo.shortName);
    }
  }
})
