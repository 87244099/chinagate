
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

async function isLogin(){
  
}