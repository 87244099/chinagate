let CacheFactory = (cache, lifeCycle)=>{
  return {
    cache: cache,
    getData(){
      return this.cache;
    },
    getCache(key){
      this.clearExpire();
      if(this.cache[key]){
        console.log("hit cache", key);
        return this.cache[key].value;
      }else{
        console.log("init ");
        return ({}).value;
      }
      // return (this.cache[key] || {}).value;
    },
    setCache(key, value){
      this.clearExpire();

      this.cache[key] = {
        timestamp:new Date().getTime(),
        value: value
      };
    },
    clearCache(){
      console.log("clear");
      Object.keys(this.cache).forEach(key=>{
        delete this.cache[key];
      });
    },
    init(newCache){
      Object.assign(this.cache, newCache);
    },
    clearExpire(){
      let now = new Date().getTime();
      Object.keys(this.cache).forEach(key=>{
        let info = this.cache[key] || {};
        if(!info.timestamp){
          delete this.cache[key];
          return;
        }

        let oldTimeStamp = info.timestamp;
        if(now-oldTimeStamp>lifeCycle){
          delete this.cache[key];
        }
      });
    }
  };
};

// 内存缓存
let MemoryCache = (function(){
  let cache = {};
  let lifeCycle = 60 * 1000;//默认缓存1分钟
  return CacheFactory(cache, lifeCycle);
})();

// 磁盘缓存
let DiskCache = (function(){
  const DISK_CACHE_KEY = "_diskCache";
  let cache = wx.getStorageSync(DISK_CACHE_KEY) || {};//初始化的时候从本地缓存读取数据
  let lifeCycle = 60 * 1000 * 100;//默认缓存100分钟
  let Cacher = CacheFactory(cache, lifeCycle);

  return {
    getCache(key){
      return Cacher.getCache(key);//再从内存数据里面获取
    },
    setCache(key, value){
      Cacher.setCache(key, value);//缓存进行去
      wx.setStorageSync(DISK_CACHE_KEY, Cacher.getData());//写入本地
    },
    clearCache(){
      Cacher.clearCache();
      wx.removeStorageSync(DISK_CACHE_KEY);
    }
  };

})();

module.exports = {
  MemoryCache,
  DiskCache,
  CacheFactory
};