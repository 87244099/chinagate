const Fai = require("../utils/util");
//登录后自动去个人中心
async function login(userDetail){
  const {
    encryptedData, iv
  } = userDetail;
  let code = await Fai.getLoginCodeNullIsEmpty();
  return new Promise((resolve, reject)=>{
    Fai.requestPost({
      url:"/ajax/logAction/action?cmd=login",
      data: {
        code: code,
        encryptedData, 
        iv
      },
      success(response){
        let result = response.data;
        if(result.success){
          Fai.MemoryCache.clearCache();//清空缓存
          resolve(response);
          getApp().globalData.isLogin=true;
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


//登录后自动去个人中心
async function loginByOpenId(openId){
  return new Promise((resolve, reject)=>{
    Fai.requestPost({
      url:"/ajax/logAction/action?cmd=loginByOpenId",
      data: {
        openId
      },
      success(response){
        let result = response.data;
        if(result.success){
          Fai.MemoryCache.clearCache();//清空缓存
          resolve(response);
          getApp().globalData.isLogin=true;
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
    });
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
    });
  });
}

async function reg(code, nickName, avatarPhoto, userDetail){
  const {
    encryptedData, 
    iv,
  } = userDetail;
  return Fai.promiseRequestPost({
    url:"/ajax/logAction/action?cmd=reg",
    data:{
      code,
      nickName,
      avatarPhoto,
      encryptedData, 
      iv
    }
  });
}

async function checkUserExist(){
  let code = await Fai.getLoginCodeNullIsEmpty();
  console.log("code", code);
  return Fai.promiseRequest({
    url: "/ajax/logAction/action?cmd=checkUserExist",
    data: {
      code: code
    }
  });
}

async function loginWithAutoReg(data){
  const { 
    code,
    nickName,
    avatarPhoto,
    iv,
    encryptedData
  } = data;
  return Fai.promiseRequestPost({
    url: "/ajax/logAction/action?cmd=loginWithAutoReg",
    data: {
      code,
      nickName,
      avatarPhoto,
      iv,
      encryptedData
    }
  }).then(()=>{ 
    getApp().globalData.isLogin=true; });
}

async function checkLogin(){
  return Fai.promiseRequest({
    url:"/ajax/logAction/action?cmd=checkLogin",
  });
}


//检查是否登录，没有登录则直接跳转登录页，带着回退链接
async function checkLoginWithRedirect(url, methodName){
  url = url || Fai.getCurrAbsPath();
  let response = await checkLogin();
  if(!response.data.data.isLogin){
    wx.navigateTo({
      url: '/pages/login/login?backUrl='+encodeURIComponent(url)+"&methodName="+methodName,
    })
  }

  return response.data.data.isLogin;
}

module.exports = {
  login,
  getMemberInfo,
  getMemberInfoById,
  reg,
  checkUserExist,
  loginWithAutoReg,
  checkLogin,
  checkLoginWithRedirect,
  loginByOpenId
};