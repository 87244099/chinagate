
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
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/Company/Company?cmd=getBrandCompanyList",
      data:{
        pageNo,
        pageSize,
        word
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

async function memberUpToStaff(staffID, memberPhone){
  return Fai.promiseRequestPost({
    url: "/logAction/action?cmd=memberUpToStaff",
    data: {
      staffID,
      memberPhone
    }
  });
}
async function memberUpToVip(vipCustomerInvitationID, memberPhone){
  return Fai.promiseRequestPost({
    url: "/logAction/action?cmd=memberUpToVip",
    data: {
      vipCustomerInvitationID,
      memberPhone
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
  memberUpToVip
};