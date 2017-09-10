//面向对象思想：场地有一个schedule,cancel方法，一个类型
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function Count(user, time, type, idCancel) {

}

//预订
Count.prototype.schedule = function () {

};

//取消
Count.prototype.cancel = function () {

};

//验证输入合法
function isLegal(arr) {
  let dateReg = /^(\d{4})-(\d{2})-(\d{2})$/,
    hourReg = /^([0][8-9]|[1][0-9]|[2][0-2]):([0]{2})~([0][8-9]|[1][0-9]|[2][0-2]):([0]{2})$/,
    countTypeReg = /[A-D]/;
  let start = parseInt(arr[2].slice(0, 2));
  let end = parseInt(arr[2].slice(6, 8));
  if (dateReg.test(arr[1]) && hourReg.test(arr[2]) && countTypeReg.test(arr[3])) {
    if (start >= end) {
      console.log("Error: the booking is valid");
    } else {
      if (arr.length === 4) {//输入是预定
        console.log("Success: the booking is accepted!")
      } else if (arr.length === 5 && arr[4] === 'C') {//输入是取消预定
        console.log("Success: the booking is accepted!")
      } else {
        console.log("Error: the booking is valid");
      }
    }
  } else {
    console.log("Error: the booking is valid");
  }
}

rl.on('line', function (time) {
  if(time){
    let arr = time.trim().split(" ");
    if(arr.length < 4 || arr.length > 5) {
      console.log("Error: the booking is valid");
    }else {
      isLegal(arr);
    }
  }else{
    rl.close();
  }
});
