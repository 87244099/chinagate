// pages/indexStaff/indexStaff.js
const Fai = require("../../utils/util");
const Ajax = require("../../ajax/index");

const IndexCompany = require("../../templates/indexCompany/indexCompany");

Page(Fai.mixin(Fai.commPageConfig, IndexCompany, {
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMyCompanyPageData();
  },
  loadMyCompanyPageData: async function(){
    Ajax.loadWithToast(async()=>{
      let response = await Ajax.getMemberInfo();
      let memberInfo = response.data.data;
      //如果拿不到，说明自己不是企业的员工
      response = await Ajax.getCompanyAIndexPageData(memberInfo.merchantForLevelAID);
      this.setData({
        "pageData":response.data.data,
        "setting.companyId": memberInfo.merchantForLevelAID,
        "setting.memberInfo": memberInfo
      });
      wx.setNavigationBarTitle({
        title: this.data.pageData.companyInfo.companyName,
      });

      return Promise.resolve(response);
    });
  },
}));