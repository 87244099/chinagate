// 内存缓存
let MemoryCache = (function(){

  let cache = {};
  let lifeCycle = 60 * 1000;//默认缓存1分钟

  return {
    getCache(key){
      clearExpire();
      return (cache[key] || {}).value;
    },
    setCache(key, value){
      clearExpire();

      cache[key] = {
        timestamp:new Date().getTime(),
        value: value
      }
    },
    clearCache(){
      cache = {};//清空
    }
  }

  function clearExpire(){
    let now = new Date().getTime();
    Object.keys(cache).forEach(key=>{
      let info = cache[key] || {};
      if(!info.timestamp){
        delete cache[key];
        return;
      }

      let oldTimeStamp = info.timestamp;
      if(now-oldTimeStamp>lifeCycle){
        delete cache[key];
      }
    });
  }
})();

// storage缓存


module.exports = {
  MemoryCache
}