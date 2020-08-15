const Fai = require("../utils/util");

async function getQrCode(page, scene){
  return new Promise((resolve,reject)=>{
    Fai.request({
      url: "/ajax/common/getCommData?cmd=getQrCode",
      data:{
        page:encodeURIComponent(page),
        scene:encodeURIComponent(scene)
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
    });
  });
}

// 产品详情页那边的参数太长了，只能使用这种处理方式
// 从页面的setting里面把参数简化
function parseQrCodeArg(options){
  options = Object.assign(options, Fai.parseSharedOption(options));
  let qr = options.qr || '';

  let arr = qr.split(",");//数据格式1,2,3,4
  let companyAID = arr[0] || -1;//一级商家
  let companyBID = arr[1] || -1;//二级商家
  let staffID = arr[2] || -1;//员工id
  let id = arr[3] || -1;//产品id
  
  let data = {};
  companyAID>=0 && (data["companyAID"] = companyAID);
  companyBID>=0 && (data["companyBID"] = companyBID);
  staffID>=0 && (data["staffID"] = staffID);
  id>=0 && (data["id"] = id);

  options = Object.assign(options, data);
  return options;
}

function stringifyQrCodeArg(setting){
  const {
    companyAID,
    companyBID,
    staffID,
    id
  } = setting;

  let qr = [];
  companyAID!=undefined && qr.push(companyAID);
  companyBID!=undefined && qr.push(companyBID);
  staffID!=undefined && qr.push(staffID);
  id!=undefined && qr.push(id);
  return qr.join(",");
};

function previewQrCode(page, scene){

  if(page.startsWith("/")){
    page = page.slice(1);
  }

  let url = page+"?"+scene;
  let imgData = Fai.MemoryCache.getCache(url);
  if(imgData){
    wx.previewImage({
      urls: ['data:image/jpeg;base64,'+imgData],
    })
    return;
  }

  requestWithToast(async()=>{
    let response = await getQrCode(page, scene);
    imgData = response.data.imgData;
    Fai.MemoryCache.setCache(url, imgData);
    
    wx.previewImage({
      urls: ['data:image/jpeg;base64,'+imgData],
    })

    return Promise.resolve(response);
  }, {
    message:"加载中..."
  });
}

async function getGlobalData(){
  let globalData = Fai.MemoryCache.getCache("globalData");
  if(globalData){
    return globalData;
  }
  
  return new Promise((resolve)=>{
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
    });
  });
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
    });
  });
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
    });
  });
}

import Toast from "../miniprogram_npm/@vant/weapp/toast/toast";
async function requestWithToast(requestHandler, message){

  let isMsgObj = message instanceof Object;
  let messageCfg = isMsgObj ? message : {
    message
  };

  if(messageCfg.message){ 
    Toast.loading({
      message: messageCfg.message,
      duration: 0
    });
  }

  try{
    let response = await requestHandler();
    if(messageCfg.tip4Success){
      Toast.success(response.data.msg);
    }else{
      Toast.clear();
    }
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
}


async function setUserCollectCancel4Staff(staffId, companyId){
  return new Promise((resolve, reject)=>{
    Fai.requestPost({
      url:"/ajax/user/userCollection?cmd=setUserCollectCancel4Staff",
      data: {
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
        reject();
      }
    });
  });
}

async function parseWxPhone(data){
  return Fai.promiseRequestPost({
    url:"/ajax/common/getCommData?cmd=parseWxPhone",
    data: data
  });
}

async function reportTrace(data){
  const  {
    typeID,
    merchantForLevelAID,
    merchantForLevelBID,
    staffID,
    subID
  } = data;
  return Fai.promiseRequestPost({
    url:"/ajax/common/getCommData?cmd=reportTrace",
    data: {
      typeID,
      merchantForLevelAID,
      merchantForLevelBID,
      staffID,
      subID
    }
  });
}
async function getTrace(data){
  const  {
    typeID,
    merchantForLevelAID,
    merchantForLevelBID,
    staffID,
    subID
  } = data;
  return Fai.promiseRequest({
    url:"/ajax/common/getCommData?cmd=getTrace",
    data: {
      typeID,
      merchantForLevelAID,
      merchantForLevelBID,
      staffID,
      subID
    }
  });
}

module.exports = {
  getQrCode,
  previewQrCode,
  getGlobalData,
  setNormalTitle,
  getUserCollectInfo,
  loadWithToast,
  setUserCollect,
  requestWithToast,
  setUserCollectCancel4Staff,
  parseWxPhone,
  reportTrace,
  getTrace,
  parseQrCodeArg,
  stringifyQrCodeArg
};