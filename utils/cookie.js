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
};
//setter
// 封装setCookie 和wx.setStorageSync的区别在于发起请求的时候会带上
const setCookie = (key, value, maxAge) => {
  maxAge = parseInt(maxAge);
  // 如果是maxAge为数字而且<=0,则删除这个cookie
  if (!isNaN(maxAge) && maxAge <= 0) {
    wx.removeStorage({
      key: key,
      success: function () { }
    });
    return;
  }

  let cookieObj = {
    value: value
  };

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
};
//从响应体里面读取cookie，设置进入缓存
function cacheResponseCookie(response){
  let header = response.header;
  //将cookie转为localStorage
  let { "Set-Cookie": cookieStr = "" } = header;
  cookieStr = cookieStr.split("GMT,").join("GMT;,");
  let cookies = cookieStr.split(";,");
  cookies.forEach(function (item) {
    let cookie = item.split("; "),
      cookieObj = {},
      cookieKey = "";

    for (let v of cookie) {
      if (!v.includes("=")) {
        continue;
      }
      let cookieProp = v.split("="),
        key = cookieProp[0].trim(),
        value = cookieProp[1].trim(),
        tmpKey = key.toLowerCase().trim();
      if (tmpKey == "max-age") {
        value = parseInt(value) || 0;
        if (value > 0) {
          let nowDate = new Date();
          let expires = new Date(nowDate.getTime() + value);
          cookieObj["expires"] = expires.toGMTString();
        }
      } else if (tmpKey != "path" && tmpKey != "domain" && tmpKey != "expires") {
        if (tmpKey == "memberdeleted") {
          let globalData = getApp().globalData;
          globalData.isLogin = false;
          let aid = globalData.aid || 0;
          let memberId = globalData.memberId || 0;
          wx.removeStorageSync('_FSESSIONID');
          wx.removeStorageSync('loginMemberAcct');
          wx.removeStorageSync('lastLoginTime' + aid + memberId);
          wx.removeStorageSync('loginIntegralTip' + aid + memberId);
        } else {
          cookieKey = key;
          cookieObj["value"] = value;
        }
      } else {
        cookieObj[tmpKey] = value;
      }
    }

    // 如果这个cookie是没有标注时间的，强制2小时过期
    if (!("expires" in cookieObj)) {
      let nowDate = new Date();
      let expires = new Date(nowDate.getTime() + 7200000); // 2 * 60 * 60 * 1000
      cookieObj["expires"] = expires.toGMTString();
    }
    // 表示是否是Cookie
    cookieObj.isCookie = true;
    if (cookieKey != "") {
      wx.setStorageSync(cookieKey, cookieObj);
    }
  });
}

//获取发送请求所需要的cookie
function getRequestCookie(header){
  let { Cookie: cookie = "" } = header;
  let storageCookie = wx.getStorageInfoSync();
  let keys = storageCookie ? (storageCookie.keys || []) : [];
  keys.forEach(function (key) {
    let tmpInfo = getCookie(key);
    if (tmpInfo) {
      cookie += ";" + key + "=" + tmpInfo;
    }
  });
  return cookie;
}

module.exports = {
  getCookie,
  setCookie,
  cacheResponseCookie,
  getRequestCookie
};