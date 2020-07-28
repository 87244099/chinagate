// 需要按秒执行的任务
let SecondTimer = (()=>{
  let taskList = [];

  let timer = setInterval(()=>{
    taskList.forEach(task=>task());
  }, 1000);

  return {
    add(task){
      taskList.push(task);
    },
    remove(task){
      let index = taskList.indexOf(task);
      if(index>=0){
        taskList.splice(task, 1);
      }
    }
  }
})();


module.exports = {
  SecondTimer
}