

const cacheUtils = require("./cache.js");
const requestUtils = require("./request.js");

async function getGlobalData(){

  let globalData = cacheUtils.MemoryCache.getCache("globalData");
  if(globalData){
    return globalData;
  }
  
  return new Promise((resolve, reject)=>{
    requestUtils.request({
      url:"/ajax/common/GetCommData?cmd=getGlobalData",
      success(response){
        let result = response.data;
        if(result.success){
          cacheUtils.MemoryCache.setCache("globalData", result.data);
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

async function getQrCode(page, scene){
  return new Promise((resolve,reject)=>{
    requestUtils.request({
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

const loginUtils = require("./login");

const Fai = {
  ...require("./tools.js"),
  ...require("./cookie.js"),
  ...requestUtils,
  ...cacheUtils,
  ...loginUtils,
  getGlobalData,
  getQrCode
}


module.exports = Fai;