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

async function removeSavedFile(option){
  return new Promise((resolve, reject)=>{
    wx.getFileSystemManager().removeSavedFile({
      filePath: option.filePath,
      data: option.data,
      encoding: option.encoding,
      success(){
        resolve(...arguments)
      },
      fail: function(res){
        console.log(res, option);
        if(res.errMsg == "removeSavedFile:fail file not exist"){
          resolve();
        }else{
          reject();
        }
      }
    });
  })
}
async function writeFile(option){
  await removeSavedFile({
    filePath : option.filePath
  });

  return new Promise((resolve, reject)=>{
    wx.getFileSystemManager().writeFile({
      filePath: option.filePath,
      data: option.data,
      encoding: option.encoding,
      success: resolve,
      fail: reject
    });
  })
}



function previewQrCode(page, scene, logoUrl){

  if(page.startsWith("/")){
    page = page.slice(1);
  }

  let url = page+"?"+scene;

  console.log("url", url);

  let imgData = Fai.MemoryCache.getCache(url);
  if(imgData){
    wx.previewImage({
      urls: ['data:image/jpeg;base64,'+imgData],
    })
    return;
  }

  requestWithToast(async()=>{
    let response = await getQrCode(page, scene);
    let imgData = response.data.imgData;
    if(logoUrl){
      imgData = await genCompanyQrCodeBase64(imgData, logoUrl);
    }
    Fai.MemoryCache.setCache(url, imgData);
    wx.previewImage({
      urls: ['data:image/jpeg;base64,'+imgData],
    })

    return Promise.resolve(response);
  }, {
    message:"加载中..."
  }).catch(res=>{
    console.log("err", res);
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

async function getUserCollectInfo(){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/user/userCollection?cmd=getUserCollectInfo",
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
async function getUserCollectInfoById(id){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/user/userCollection?cmd=getUserCollectInfoById",
      data:{
        id
      },
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
      console.log(errorOrResponse);
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
      typeID: typeID||0,
      merchantForLevelAID:merchantForLevelAID||0,
      merchantForLevelBID:merchantForLevelBID||0,
      staffID:staffID||0,
      subID: subID||0,
      openId: getApp().globalData.openId
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

async function getImageInfo(url){
  return new Promise((resolve, reject)=>{
    wx.getImageInfo({
      src: url,
      success:(result)=>{
        resolve(result.path);
      },
      fail: reject
    })
  });
}

async function genCompanyQrCodeBase64(imgBase64, companyLogoUrl){
  let filePath = `${wx.env.USER_DATA_PATH}/tmp_base64src`; 

  console.log("companyLogoUrl", companyLogoUrl);
  let loadedCompanyLogoUrl = await getImageInfo(companyLogoUrl);
  try{
    await removeSavedFile({
      filePath: filePath
    });
  }catch(e){
    console.log(e);
  }


  return new Promise((resolve, reject)=>{
    wx.getFileSystemManager().writeFile({
      filePath: filePath,
      data: wx.base64ToArrayBuffer(imgBase64),
      encoding: 'binary',
      success: (res) => { 
        wx.getImageInfo({
          src: filePath,
          success:(res)=>{
            var ctx = wx.createCanvasContext('myCanvas');
            const sysInfo = wx.getSystemInfoSync();
            let windowWidth = sysInfo.windowWidth;
            let ratio = windowWidth/750;
            let width = 430;
            let height = 430;
            ctx.save();
            // let width = 430*ratio;
            ctx.drawImage(res.path, 0, 0, 430, 430, 0, 0, width, height);
            console.log("loadedCompanyLogoUrl", loadedCompanyLogoUrl);
            ctx.beginPath()
            ctx.arc(215,215, 100, 0, 2*Math.PI);
            ctx.clip();
            ctx.setFillStyle("#fff");
            ctx.fillRect(0, 0, width, height);
            // ctx.drawImage("./company.jpg", 115, 115, 200, 200);
            ctx.drawImage(loadedCompanyLogoUrl, 115, 115, 200, 200);
            ctx.restore();
            ctx.draw(false, ()=>{
              wx.canvasToTempFilePath({ //获取生成的临时图片
                canvasId: 'myCanvas',
                success: function (res) {
                  console.log("res", res.tempFilePath);
                  wx.getFileSystemManager().readFile({   // 文件管理系统按照base64方式读取生成的图片
                    filePath: res.tempFilePath, //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: res => { //成功的回调
                      resolve(res.data);
                    },
                    fail:reject
                  })
                },
                async complete(){
                  await removeSavedFile({
                    filePath: loadedCompanyLogoUrl
                  });
                }
              })
              // wx.canvasGetImageData({
              //   canvasId: 'myCanvas',
              //   x: 0,
              //   y: 0,
              //   width: width,
              //   height: height,
              //   success: function(res) {
              //     let arrayBuffer = Fai.UPNG.encode([res.data.buffer], res.width, res.height)
              //     var imageBase64 = wx.arrayBufferToBase64(arrayBuffer);
              //     console.log("imageBase64", imageBase64);
              //     resolve(imageBase64);
              //   },
              //   fail: reject
              // })
            });
          }
        })
      },
      fail: reject
    });
  })
}
//分享行为上报
async function reportShare(data){
  const app = getApp();
  data = data || {};
  const {
    typeID,
    merchantForLevelAID,
    merchantForLevelBID,
    staffID,
    subID
  } = data;

  return Fai.promiseRequestPost({
    url: "/ajax/common/getCommData?cmd=reportShare",
    data: {
      typeID: typeID||0,
      merchantForLevelAID: merchantForLevelAID||0,
      merchantForLevelBID: merchantForLevelBID||0,
      staffID: staffID||0,
      xcxOpenID: app.globalData.openId||"",
      subID: subID||0
    }
  });
}

//分享行为上报
async function reportVisit4Share(data){
  const app = getApp();

  data = data || {};
  const {
    xcxOpenID,
    typeID,
    merchantForLevelAID,
    merchantForLevelBID,
    staffID,
    subID
  } = data;
  /*
    分享到单人是1007
    分享到群是：1044
    去掉shareTicket 后分享到群：1008
  */
  // //进入只统计这2种渠道的流量
  // if(![1044, 1007, 1008].includes(app.globalData.showOptions.scene)){
  //   return Promise.resolve();
  // }
  // // 如果没有当前的访问入口的分享者openId，则不上报
  // if(!xcxOpenID){
  //   return Promise.resolve();
  // }

  let sourceTypeID = 1;
  if([1044, 1008].includes(app.globalData.showOptions.scene)){
    sourceTypeID = 2;
  }
  return Fai.promiseRequestPost({
    url: "/ajax/common/getCommData?cmd=reportVisit4Share",
    data: {
      sourceTypeID:sourceTypeID||0,
      xcxAccessOpenID:app.globalData.openId,//访问者openid
      typeID:typeID||0,
      merchantForLevelAID:merchantForLevelAID||0,
      merchantForLevelBID:merchantForLevelBID||0,
      staffID:staffID||0,
      xcxOpenID:xcxOpenID,//分享者openid
      subID:subID||0
    }
  });
}

async function getOpenIdByCode(code){
  return Fai.promiseRequestPost({
    url:"/ajax/common/getCommData?cmd=getOpenIdByCode",
    data: {
      code
    }
  })
}

async function getShareRank(type){
  type = (type===undefined ? 1 : type);//默认为当月
  console.log("type2", type);
  return Fai.promiseRequest({
    url: "/ajax/common/getCommData?cmd=getShareRank",
    data: {
      type
    }
  });
}

async function getLastLocus(openId){
  return Fai.promiseRequest({
    url: "/ajax/common/getCommData?cmd=getLastLocus",
    data: {
      openId
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
  stringifyQrCodeArg,
  getUserCollectInfoById,
  reportShare,
  reportVisit4Share,
  getOpenIdByCode,
  getShareRank,
  getLastLocus
};