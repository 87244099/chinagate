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
      success: resolve,
      fail: function(res){
        if(res.errMsg == "fail file not exist"){
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

async function getImageInfo(filePath){
  return new Promise((resolve, reject)=>{
    wx.getImageInfo({
      src: filePath,
      success:resolve,
      fail:reject
    });
  });
}

async function drawBase64ToImgPath(base64){
  let filePath = `${wx.env.USER_DATA_PATH}/tmp_base64src2`;
  var showImgData = base64;
  // showImgData = showImgData.replace(/\ +/g, ""); //去掉空格方法
  // showImgData = showImgData.replace(/[\r\n]/g, "");
  const buffer = wx.base64ToArrayBuffer(showImgData);
  let rt = wx.getFileSystemManager().writeFileSync( filePath, buffer, 'binary');
  let imgInfo = await getImageInfo(filePath);
  return imgInfo.path;
  console.log("rt", rt);
  return filePath;
}

function previewQrCode(page, scene, logoUrl){

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
    let imgData = response.data.imgData;

    let base64 = await genCompanyQrCodeBase64(imgData, logoUrl);
    Fai.MemoryCache.setCache(url, base64);
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
async function genCompanyQrCodeBase64(imgBase64, companyLogoUrl){
  let filePath = `${wx.env.USER_DATA_PATH}/tmp_base64src`; 
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
            // let width = 430*ratio;
            ctx.drawImage(res.path, 0, 0, 430, 430, 0, 0, width, height);
            console.log("companyLogoUrl", companyLogoUrl);
            ctx.beginPath()
            ctx.arc(215,215, 100, 0, 2*Math.PI);
            ctx.clip();
            // ctx.drawImage("./company.jpg", 115, 115, 200, 200);
            ctx.drawImage(companyLogoUrl, 115, 115, 200, 200);
            ctx.draw(false, ()=>{
              wx.canvasToTempFilePath({ //获取生成的临时图片
                canvasId: 'myCanvas',
                success: function (res) {
                  wx.getFileSystemManager().readFile({   // 文件管理系统按照base64方式读取生成的图片
                    filePath: res.tempFilePath, //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: res => { //成功的回调
                      // console.log('data:image/png;base64,' + res.data);
                      resolve(res.data);
                    },
                    fail:reject
                  })
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