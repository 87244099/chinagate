// 需要按秒执行的任务
let SecondTimer = (()=>{
  let taskList = [];

  setInterval(()=>{
    taskList.forEach(task=>task());
  }, 1000);

  return {
    add(task){
      task = Array.isArray(task) ? task : [task];
      taskList.push(...task);
    },
    remove(task){//支持数组或单个传入的用法
      task = Array.isArray(task) ? task : [task];
      task.forEach(item=>{
        let index = taskList.indexOf(item);
        if(index>=0){
          taskList.splice(index, 1);
        }
      });
    },
    clear(){
      taskList = [];
    }
  };
})();


//函数节流
function delay(handler, time) {
  var timer = null;
  let finalTime = time || 300;
  return function () {
    var args = arguments;
    clearTimeout(timer);
    let that = this;
    timer = setTimeout(function () {
      handler.apply(that, args);
    }, finalTime);
  };
}

module.exports = {
  SecondTimer,
  delay
};