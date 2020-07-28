const Fai = require("../utils/util");
//登录后自动去个人中心
async function login(){
  let code = await Fai.getLoginCodeNullIsEmpty();
  return new Promise((resolve, reject)=>{
    Fai.request({
      url:"/ajax/logAction/action?cmd=login",
      data: {
        code: code
      },
      success(response){
        let result = response.data;
        if(result.success){
          Fai.MemoryCache.clearCache();//清空缓存
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

async function getMemberInfo(){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url: "/ajax/logAction/action?cmd=getMemberInfo",
      success:(response)=>{
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail:()=>{
        reject();
      }
    })
  });
}
async function getMemberInfoById(id){
  return new Promise((resolve, reject)=>{
    Fai.request({
      url: "/ajax/logAction/action?cmd=getMemberInfoById",
      data:{
        memberId:id
      },
      success:(response)=>{
        let result = response.data;
        if(result.success){
          resolve(response);
        }else{
          reject(response);
        }
      },
      fail:()=>{
        reject();
      }
    })
  });
}



module.exports = {
  login,
  getMemberInfo,
  getMemberInfoById
}