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
// 加一层内存缓存，临时缓存同一个页面多次调用
async function getMemberInfo(){
  return new Promise((resolve, reject)=>{
    let memberInfo = Fai.MemoryCache.getCache("memberInfo");
    if(memberInfo){
      resolve({
        data: {
          data: memberInfo
        }
      });
    }else{
      Fai.request({
        url: "/ajax/logAction/action?cmd=getMemberInfo",
        success:(response)=>{
          let result = response.data;
          if(result.success){
            memberInfo = response.data.data;
            Fai.MemoryCache.setCache("memberInfo", memberInfo);
            
            resolve(response);
          }else{
            reject(response);
          }
        },
        fail:()=>{
          reject();
        }
      });
    }

    
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
  return Fai.promiseRequest({
    url: "/ajax/logAction/action?cmd=checkUserExist",
    data: {
      openId: getApp().globalData.openId
    }
  });
}

async function checkUserExistBoolean(){
  let response = await checkUserExist();
  return response.data.data.exist;
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
// 检查当前是否处于登录状态
async function checkLogin(){
  return Fai.promiseRequest({
    url:"/ajax/logAction/action?cmd=checkLogin",
  });
}
// 检查当前是否处于登录状态, 并且返回布尔值
async function checkLoginBoolean(){
  let response = await checkLogin();
  return response.data.data.isLogin;
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
async function checkLoginWithRedirect4Invitation(url, methodName){
  url = url || Fai.getCurrAbsPath();
  let response = await checkLogin();
  if(!response.data.data.isLogin){
    wx.navigateTo({
      url: '/pages/login4Invitation/login4Invitation?backUrl='+encodeURIComponent(url)+"&methodName="+methodName,
    })
  }

  return response.data.data.isLogin;
}
//自动授权登录
async function autoEmpowerLogin(setting){
  setting = setting ||{};
  return new Promise(async(resolve, reject)=>{
    let isLogin = await checkLoginBoolean();//检查有没有会话
    if(isLogin){//有会话
      resolve();
    }else{//没有会话
      let exist = await checkUserExistBoolean();
      if(exist){//如果用户存在, 走静默登录
        await loginByOpenId(getApp().globalData.openId);//不可能不成功
        resolve();
      }else{
        let backUrl = Fai.getCurrAbsPath();
        console.log("setting", setting);
        let queryArr = Object.keys(setting).map(key=>{
          return key + '=' + setting[key];
        });
        queryArr.push("backUrl="+encodeURIComponent(backUrl));
        let queryString = queryArr.join("&");
        console.log("queryString", queryString);
        let url = `/pages/login4Empower/login4Empower?${queryString}`;
        console.log("url", url);
        wx.navigateTo({
          url: url,
        });
        reject();
      }
    }
  });
}

module.exports = {
  login,
  getMemberInfo,
  getMemberInfoById,
  reg,
  checkUserExist,
  loginWithAutoReg,
  checkLogin,
  checkLoginBoolean,
  checkLoginWithRedirect,
  loginByOpenId,
  checkUserExistBoolean,
  autoEmpowerLogin,
  checkLoginWithRedirect4Invitation
};