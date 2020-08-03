const IndexCompany = require("../../templates/indexCompany/indexCompany");
// const Fai = require("../../ajax/index");
const Fai = require("../../utils/util");

Page(Fai.mixin(Fai.commPageConfig,IndexCompany, {
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "setting.companyId" : parseInt(options.companyId) || -1
    });
    this.loadIndexCompanyBPageData();
  },
  onCompanyCollect(){
    Ajax.requestWithToast(async()=>{
      let response = Fai.promiseRequestPost({
        url:"/ajax/company/companyCollect?cmd=setCompanyCollect",
        data:{
          merchantForLevelAID: 0,
          merchantForLevelBID: this.data.setting.companyId
        }
      });

      return Promise.resolve(response);
    });
  }

}));