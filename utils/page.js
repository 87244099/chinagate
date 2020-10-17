const Typer = require("./typer");
const Timer = require("./timer");
const Cacher = require("./cache");
const Event = require("./event").Event;

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
  onShow(){
    console.log("Event", Event);
    // debugger;
    let page = getCurrPage();
    console.log("page", page);
    Event.emit("onShow."+page.getPageId());
  },
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
  onHide(){
    Event.emit("onHide");
  },
  onUnload(){

    // 释放各类事件
    let page = getCurrPage();
    Event.off("onShow."+page.getPageId());
    Event.off("onHide."+page.getPageId());
    
    // 避免缓存泄漏
    Cacher.MemoryCache.clearCache();
    
    // 清除掉内存缓存

    let taskList = Object.keys(page).filter(key=>Typer.isFunction(page[key])).map(key=>page[key]);
    Timer.SecondTimer.remove(taskList);//回收各个页面注入的定时任务
  }
};
function isPaginationEndBySetting(setting){
  const {
    pageNo,
    pageSize,
    totalSize
  } = setting;
  return isPaginationEnd(pageNo, pageSize, totalSize);
}
function isPaginationEnd(pageNo, pageSize, totalSize){
  if(totalSize<0){
    return false;
  }
  return pageNo*pageSize>=totalSize;
}

function addPageQuery(url, name, value){
  let urlArr = url.split("?");
  if(urlArr.length===1){
    return urlArr[0] + "?" + (name+"="+value);
  }else{
    return url + "&" + (name+"="+value);
  }
}

function getPrevPage(){
  let pages = getCurrentPages();
  if(pages.length>1){
    return pages[getCurrentPages().length - 2];
  }
  return;
}

module.exports = {
  commPageConfig,
  getCurrAbsPath,
  getCurrPage,
  isPaginationEnd,
  isPaginationEndBySetting,
  addPageQuery,
  getPrevPage
};