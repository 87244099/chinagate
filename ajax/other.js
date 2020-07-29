const Fai = require("../utils/util");

async function getQrCode(page, scene){
  return new Promise((resolve,reject)=>{
    Fai.request({
      url: "/ajax/common/getCommData?cmd=getQrCode",
      data:{
        page,
        scene
      },
      success(response){
        let result = response.data;
        if(result.success){
          resolve(result);
        }else{
          reject(result);
        }
      },
      fail(){
        reject();
      }
    })
  });
}

async function getGlobalData(){
  let globalData = Fai.MemoryCache.getCache("globalData");
  if(globalData){
    return globalData;
  }
  
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/common/GetCommData?cmd=getGlobalData",
      success(response){
        let result = response.data;
        if(result.success){
          Fai.MemoryCache.setCache("globalData", result.data);
          resolve(result.data);
        }else{
          resolve({});
        }
      },
      fail(){
        resolve({});
      }
    })
  })
}

async function setNormalTitle(key){
  let globalData = await getGlobalData();
  wx.setNavigationBarTitle({
    title: globalData.titleData[key],
  });
}

async function getUserCollectInfo(memberId){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/user/userCollection?cmd=getUserCollectInfo&id="+memberId,
      success:(response)=>{
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail:reject
    })
  })
}
async function setUserCollect(memberId){
  return new Promise((resolve, reject)=>{
    Fai.requestPost({
      url: "/ajax/user/userCollection?cmd=setUserCollect",
      data:{
        id:memberId
      },
      success(response){
        if(response.data.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail(){
        reject();
      }
    })
  });
}

import Toast from "../miniprogram_npm/@vant/weapp/toast/toast";
async function requestWithToast(requestHandler, message){
  if(message){
    Toast.loading({
      message:message,
      duration: 0
    });
  }

  try{
    let response = await requestHandler();
    Toast.success(response.data.msg);
  }catch(errorOrResponse){
    if(errorOrResponse instanceof Error){
      console.log("errorOrResponse err", errorOrResponse);
      Toast.fail("网络繁忙，请稍后重试");
    }else if(errorOrResponse){
      Toast.fail(errorOrResponse.data.msg);
    }else{
      Toast.fail("网络繁忙，请稍后重试");
    }
  }
}

async function loadWithToast(requestHandler){
  return requestWithToast(requestHandler, "加载中...");
};


async function setUserCollectCancel4Staff(memberId, staffId, companyId){
  return new Promise((resolve, reject)=>{
    Fai.requestPost({
      url:"/ajax/user/userCollection?cmd=setUserCollectCancel4Staff",
      data: {
        id:memberId,
        staffId:staffId,
        companyId: companyId
      },
      success: (response)=>{
        let result = response.data;
        if(result.success){
          Toast.success(result.msg);
          resolve(response);
        }else{
          resolve(response);
        }
      },
      fail(){
        reject()
      }
    })
  });
}

module.exports = {
  getQrCode,
  getGlobalData,
  setNormalTitle,
  getUserCollectInfo,
  loadWithToast,
  setUserCollect,
  requestWithToast,
  setUserCollectCancel4Staff
}