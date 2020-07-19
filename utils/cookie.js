//getter
// 封装getCookie
const getCookie = key => {
  let cookieObj = wx.getStorageSync(key);
  if (!cookieObj) {
    return null;
  }
  if (!cookieObj.isCookie) {
    return null;
  }
  if (typeof cookieObj["expires"] != undefined) {
    let expiresDate = new Date(cookieObj.expires);
    if (expiresDate) {
      let nowDate = new Date();
      if (nowDate.getTime() >= expiresDate.getTime()) {
        wx.removeStorageSync(key);
        return null;
      }
    }
  }

  return cookieObj["value"];
}
//setter
// 封装setCookie 和wx.setStorageSync的区别在于发起请求的时候会带上
const setCookie = (key, value, maxAge) => {
  maxAge = parseInt(maxAge);
  // 如果是maxAge为数字而且<=0,则删除这个cookie
  if (!isNaN(maxAge) && maxAge <= 0) {
    wx.removeStorage({
      key: key,
      success: function (res) { }
    });
    return;
  }

  let cookieObj = {
    value: value
  }

  if (!isNaN(maxAge) && maxAge > 0) {
    let nowDate = new Date();
    let expires = new Date(nowDate.getTime() + maxAge);
    cookieObj["expires"] = expires.toGMTString();
  }
  cookieObj["isCookie"] = true;

  wx.setStorage({
    key: key,
    data: cookieObj
  });
}

module.exports = {
  getCookie,
  setCookie
}