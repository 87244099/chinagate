const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



//保留页面间的函数继承引用
function mixin(){
  let objList = [...arguments];
  let obj = {};
  objList.forEach(item=>{
    Object.keys(item).forEach(key=>{

      let value = item[key];
      let oldValue = obj[key];

      if(value && oldValue && (value instanceof Function)&& (oldValue instanceof Function)){
        obj[key] = function(){
          value.apply(this, arguments);
          oldValue.apply(this, arguments);
        };
      }else{
        obj[key] = value;
      }

    })
  }); 

  return obj;
}

module.exports = {
  formatTime,
  mixin
}