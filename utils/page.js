const tools = require("./tools");
function getCurrAbsPath(){
  let page = getCurrentPages()[getCurrentPages().length-1];
  let queryObject = page.options;
  let queryStr = Object.keys(queryObject).map(key=>{
    return key+"="+queryObject[key];
  }).join("&");
  return "/" + page.route + "?" + queryStr;
}

function getCurrPage(){
  let p = getCurrentPages()[getCurrentPages().length-1];
  return p;
}



// 所有页面共享的配置
let commPageConfig = {
  onPageScroll: tools.delay((event)=>{
    let scrollTop = event.scrollTop;
    let systemInfo = wx.getSystemInfoSync();
    let windowHeight = systemInfo.windowHeight;
    let _rollbackVisible = false;
    if(scrollTop > windowHeight){
      _rollbackVisible = true;
    }else{
      _rollbackVisible = false;
    }
    
    let page = getCurrPage();
    let _commPageConfigData = page.data._commPageConfigData || {};
    if(_commPageConfigData.rollbackVisible!=_rollbackVisible){
      page.setData({
        "_commPageConfigData.rollbackVisible":_rollbackVisible
      });
    }

  }, 500)
}

module.exports = {
  commPageConfig,
  getCurrAbsPath,
  getCurrPage
}