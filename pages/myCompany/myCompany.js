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
      if(memberInfo.staffID==0){
        wx.redirectTo({
          url: '/pages/createComapny/createCompany',
        });
        return;
      }
      //如果拿不到，说明自己不是企业的员工
      response = await Ajax.getCompanyAIndexPageData(memberInfo.merchantForLevelAID);
      this.setData({
        "pageData":response.data.data,
        "setting.companyId": memberInfo.merchantForLevelAID,
        "setting.companyAID": memberInfo.merchantForLevelAID,
        "setting.memberInfo": memberInfo
      });

      if(this.data.pageData.companyInfo.companyName){
        wx.setNavigationBarTitle({
          title: this.data.pageData.companyInfo.companyName,
        });
      }
      

      return Promise.resolve(response);
    });
  },
  onCompanyCollect(){
    Ajax.requestWithToast(async()=>{
      let response = Fai.promiseRequestPost({
        url:"/ajax/company/companyCollect?cmd=setCompanyCollect",
        data:{
          merchantForLevelAID: this.data.setting.companyAID,
          merchantForLevelBID: 0
        }
      });
      return Promise.resolve(response);
    },{
      tip4Success:true
    });
  },
}));