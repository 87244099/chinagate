// pages/indexStaff/indexStaff.js
const Fai = require("../../utils/util");
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";

const IndexCompany = require("../../templates/indexCompany/indexCompany");

Page(Fai.mixin(Fai.commPageConfig, IndexCompany, {
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.companyId": parseInt(options.companyId) || -1
    })
    if(this.data.setting.companyId>=0){
      this.loadIndexCompanyPageData();
    }else{
      Toast.fail("该企业不存在");
    }
  },
  
  onCompanyCollect(){
    Ajax.requestWithToast(async()=>{
      let response = Fai.promiseRequestPost({
        url:"/ajax/company/companyCollect?cmd=setCompanyCollect",
        data:{
          merchantForLevelAID: this.data.setting.companyId,
          merchantForLevelBID: 0
        }
      });

      return Promise.resolve(response);
    });
  }
}));
