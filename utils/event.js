
// 只存在于一个页面周期中
const Event = (function(){
  let cache = {};
  return {
    on(name, handler){
      init(name);
      cache[name].push(handler);
    },
    off(name){
      delete cache[name];
    },
    emit(name){
      init(name);
      cache[name].forEach(item=>item());
    },
    // 触发一次性函数
    emitOnce(){
      init(name);
      cache[name].forEach(item=>item());
      this.off(name);
    },
    clear(){
      cache = {};
    }
  };

  function init(name){
    if(!cache[name]){
      cache[name] = [];
    }
  }

})();

const Waiter = (function(){
  // 等待某件事情结束
  let cache = {};
  return {
    cache,
    wait(name, noticeHandler){
      init(name);
      // 函数外部触发了回调，通知结束
      let that = this;
      noticeHandler(function(){
        cache[name].pendding = false;
        cache[name].eventArgs = [...arguments];
        that.resolve(name);
      });
    },
    resolve(name){
      init(name);
      cache[name].callbacks.forEach(callback=>{
        callback(...cache[name].eventArgs);
      })
      cache[name].callbacks = [];
    },
    then(name, handler){
      init(name);
      if(!cache[name].callbacks.includes(handler)){//不推入重复的函数
        cache[name].callbacks.push( handler );
      };
      if(!cache[name].pendding){//如果已经结束，则无需等待了
        this.resolve(name);
      }
    }
  }

  function init(name){
    if(!cache[name]){
      cache[name] = {
        pendding: true,//是否处于等待状态(默认),
        eventArgs: [],
        callbacks: [],//事件结束后的回调集合
      };
    }
  }
})();

module.exports = {
  Event,
  Waiter
}

global.Waiter  = Waiter;
console.log(Math.random());