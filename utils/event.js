
const Event = (function(){
  let cache = {};
  return {
    cache,
    on(key, handler){
      let namespace = getNamespace(key);
      get(key).push(handler);
      return this;
    },
    off(key){
      get(key).length = 0;
      return this;
    },
    emit(key, isOnce){
      init(key);
      let namespace = getNamespace(key);
      if(namespace.sub.length>0){
        let handlers = get(key);
        handlers.forEach(item=>item());
        if(isOnce){
          handlers.length = 0;
        }
      }else{
        Object.keys(cache[namespace.main]).forEach(sub=>{
          cache[namespace.main][sub].forEach(item=>item())
        });
        if(isOnce){
          cache[namespace.main] = {};
        }
      }

      return this;
    },
    // 触发一次性函数
    emitOnce(key){
      this.emit(key, true);
      return this;
    },
    clear(){
      cache = {};
      return this;
    }
  };

  function init(key){
    let namespace = getNamespace(key);
    if(!cache[namespace.main]){
      cache[namespace.main] = {};
    }
    if(!cache[namespace.main][namespace.sub]){
      cache[namespace.main][namespace.sub] = [];
    }
  }

  function get(key){
    init(key);
    let namespace = getNamespace(key);
    return cache[namespace.main][namespace.sub];
  }

  function getNamespace(key){
    let arr = key.split(".");

    return {
      main: arr[0] || '',
      sub: arr[1] || ''
    }
  }

})();

global.EventTool = Event;

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