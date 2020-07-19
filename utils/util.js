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
  formatTime: formatTime,
  delay,
  ...require("./request.js"),
  ...require("./cookie.js"),
}
