
const requestUtils = require("./request");

async function getLoginCodeNullIsEmpty(){
  return new Promise((resolve, reject)=>{
    wx.login({
      complete: (res) => {
        if(res.errMsg === "login:ok"){
          resolve(res.code);
        }else{
          resolve("");
        }
      },
    })
  })
}

async function checkSession(){
  return new Promise((resolve, reject)=>{
    wx.checkSession({
　　　　success: resolve,
　　　　fail: reject
　　});
  })
}


async function login(){
  let code = await getLoginCodeNullIsEmpty();
  return new Promise((resolve, reject)=>{
    requestUtils.request({
      url:"/ajax/logAction/action?cmd=login",
      data: {
        code: code
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

module.exports = {
  login
}