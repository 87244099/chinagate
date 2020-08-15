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
        "setting.staffID": memberInfo.staffID,
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
  previewQrCode(){
    //这里是因为去了其他页面，所以就不需要在 onload对参数解析了
    let qr = Ajax.stringifyQrCodeArg(this.data.setting);
    console.log(qr);
    Ajax.previewQrCode("/pages/indexCompany/indexCompany", "qr="+qr);
  }
}));