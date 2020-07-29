const Typer = require("./typer");
const Timer = require("./timer");

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
  onPageScroll: Timer.delay((event)=>{
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

  }, 500),
  onReady(){
    Timer.SecondTimer.clear();
  },
  onUnload(){
    let page = getCurrPage();
    let taskList = Object.keys(page).filter(key=>Typer.isFunction(page[key])).map(key=>page[key]);
    Timer.SecondTimer.remove(taskList);//回收各个页面注入的定时任务
  }
}

module.exports = {
  commPageConfig,
  getCurrAbsPath,
  getCurrPage
}