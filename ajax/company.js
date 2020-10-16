
const Fai = require("../utils/util");
async function getCompanyAIndexPageData(companyId){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url: "/ajax/company/company?cmd=getCompanyAIndexPageData&id="+companyId,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail(){
        reject();
      }
    });
  });
}


async function getCompanyBIndexPageData(companyId){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url: "/ajax/company/company?cmd=getCompanyBIndexPageData&id="+companyId,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail(){
        reject();
      }
    });
  });
}

async function getInfo4CompanyA(id){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/company/companyInfo?cmd=getInfo4CompanyA",
      data:{
        id:id
      },
      success(response){
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail(){
        reject();
      }
    });
  });
}
async function getInfo4CompanyB(id){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/company/companyInfo?cmd=getInfo4CompanyB",
      data:{
        id:id
      },
      success(response){
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail(){
        reject();
      }
    });
  });
}

async function getBrandCompanyList(pageNo, pageSize){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/Company/Company?cmd=getBrandCompanyList",
      data:{
        pageNo,
        pageSize
      },
      success(response){
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail(){
        reject();
      }
    });
  });

}
async function getBrandCompanyListByName(pageNo, pageSize, word){
  return Fai.promiseRequest({
    url:"/ajax/Company/Company?cmd=getBrandCompanyListByName",
    data:{
      pageNo,
      pageSize,
      word
    }
  });
}

async function getInvitationStaffPageData(staffID){
  return Fai.promiseRequest({
    url:"/ajax/company/companyInfo?cmd=getInvitationStaffPageData",
    data:{
      staffID
    }
  });
}
async function getInvitationVipPageData(vipCustomerInvitationID){
  return Fai.promiseRequest({
    url:"/ajax/company/companyInfo?cmd=getInvitationVipPageData",
    data:{
      vipCustomerInvitationID
    }
  });
}

async function memberUpToStaff(staffID, memberPhone){
  return Fai.promiseRequestPost({
    url: "/logAction/action?cmd=memberUpToStaff",
    data: {
      staffID,
      memberPhone
    }
  });
}
async function memberUpToVipA(vipCustomerInvitationID, memberPhone){
  return Fai.promiseRequestPost({
    url: "/logAction/action?cmd=memberUpToVipA",
    data: {
      vipCustomerInvitationID,
      memberPhone
    }
  });
}

function getInfo4Staff(id){
  return Fai.promiseRequest({
    url:"/ajax/user/userInfo?cmd=getInfo4Staff",
    data: {
      id
    }
  });
}

async function belongVip(merchantForLevelAID=0, merchantForLevelBID=0){
  return Fai.promiseRequest({
    url:"/ajax/company/companyInfo?cmd=belongVip",
    data: {
      merchantForLevelAID,
      merchantForLevelBID,
      openId: getApp().globalData.openId
    }
  });
}

module.exports = {
  getCompanyAIndexPageData,
  getInfo4CompanyA,
  getInfo4CompanyB,
  getCompanyBIndexPageData,
  getBrandCompanyList,
  memberUpToStaff,
  memberUpToVipA,
  getBrandCompanyListByName,
  getInfo4Staff,
  getInvitationStaffPageData,
  getInvitationVipPageData,
  belongVip
};