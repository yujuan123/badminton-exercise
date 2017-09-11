//面向对象思想：场地有一个schedule,cancel方法，一个类型
const rl = require('./src/readline');
const _ = require('lodash');
const chargeStandards = require('./src/charge-standards');
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
        console.log("获取预定");
        let bol = getScheduleTime(arr);
        console.log("bol" + bol);
        if (bol) {
          console.log("Success: the booking is accepted!");
        } else {
          console.log("Error: the booking conflicts with existing bookings!");
        }
      } else if (arr.length === 5 && arr[4] === 'C') {//输入是取消预定
        console.log("取消预定");
        getCancelTime(arr);
      }
    }
  } else {
    console.log("Error: the booking is valid");
  }
}

let books = [];
let cancelBooks = [];

//获取预定
function getScheduleTime(arr) {
  let date = arr[1];
  let start = parseInt(arr[2].slice(0, 2));
  let end = parseInt(arr[2].slice(6, 8));
  let schedule = {userId: arr[0], date: date, start: start, end: end, countType: arr[3]};
  if (books.length === 0) {
    books.push(schedule);
    return true;
  } else {
    let isSave = books.every((book)=> {
      if (book.date === schedule.date && book.countType === schedule.countType) {
        return schedule.end <= book.start || schedule.start >= book.end;
      } else {
        return true;
      }
    });
    if (isSave) {
      books.push(schedule);
      return true;
    } else {
      return false;
    }
  }
}

//取消预定
function getCancelTime(arr) {
  //判断之前预定存不存在
  let date = arr[1];
  let start = parseInt(arr[2].slice(0, 2));
  let end = parseInt(arr[2].slice(6, 8));
  let cancel = {userId: arr[0], date: date, start: start, end: end, countType: arr[3]};
  let i, flag = false;
  for (i = 0; i < books.length; i++) {
    if (_.isEqual(books[i], cancel)) {
      books.splice(i, 1);
      console.log("取消后" + books.length);
      cancelBooks.push(cancel);
      flag = true;
      console.log("Success: the booking is accepted!");
      break;
    }
  }
  if (!flag) {
    console.log("Error: the booking being cancelled does not exist!");
  }
}
//场地A,B,C,D分组:目前传来预定记录
function generateRecords() {
  //array: [{},{}...]
  let aBooked = [], bBooked = [], cBooked = [], dBooked = [],
    aCanceled = [], bCanceled = [], cCanceled = [], dCanceled = [];
  books.forEach((book)=> {
    switch (book.countType) {
      case 'A':
        aBooked.push(book);
        break;
      case 'B':
        bBooked.push(book);
        break;
      case 'C':
        cBooked.push(book);
        break;
      case 'D':
        dBooked.push(book);
        break;
    }
  });
  cancelBooks.forEach((cancelBook)=> {
    switch (cancelBook.countType) {
      case 'A':
        aCanceled.push(cancelBook);
        break;
      case 'B':
        bCanceled.push(cancelBook);
        break;
      case 'C':
        cCanceled.push(cancelBook);
        break;
      case 'D':
        dCanceled.push(cancelBook);
        break;
    }
  });
  [aBooked, bBooked, cBooked, dBooked].forEach((countBooked)=> {
    getSubTotal(countBooked);
  });
  [aCanceled, bCanceled, cCanceled, dCanceled].forEach((cancelBook)=> {
    getSubTotal(cancelBook, true);
  });
  //调用打印
  console.log("收入汇总");
  console.log("---");
  console.log("场地:A");
  printCharge(aBooked, aCanceled);
  console.log("场地:B");
  printCharge(bBooked, bCanceled);
  console.log("场地:C");
  printCharge(cBooked, cCanceled);
  console.log("场地:D");
  printCharge(dBooked, dCanceled);
  let allCharge = total.reduce((a, b)=> {
    return a + b;
  });
  console.log("---");
  console.log(`总计：${allCharge}元`);
}
//输入时间对比在给定时间的哪段
function calculateSubTotal(givenDays, start, end) {
  for (let day of givenDays) {
    let givenStart = parseInt(day.date.slice(0, 2));
    let givenEnd = parseInt(day.date.slice(6, 8));
    if (start >= givenStart && start < givenEnd && end <= givenEnd) {
      return (end - start) * day.price;
    }
    if (start >= givenStart && start < givenEnd && end > givenEnd) {
      return (givenEnd - start) * day.price + calculateSubTotal(givenDays, givenEnd, end);
    }
  }
}

function getSubTotal() {
  let args = Array.from(arguments);
  let flag = args[1];
  for (let record of args[0]) {
    let start = record.start,
      end = record.end;
    let days = [1, 2, 3, 4, 5];
    let d = new Date(record.date).getDay();
    if (days.indexOf(d) !== -1) {
      flag === undefined ? record.bookedSubtotal = calculateSubTotal(chargeStandards()[0].weekDays, start, end) :
        record.cancelSubtotal = calculateSubTotal(chargeStandards()[0].weekDays, start, end) * 0.5;
    } else {
      flag === undefined ? record.bookedSubtotal = calculateSubTotal(chargeStandards()[1].weekends, start, end) :
        record.cancelSubtotal = calculateSubTotal(chargeStandards()[1].weekends, start, end) * 0.25;
    }
  }
}

let total = [];
//打印订单
function printCharge() {
  let countRecords = Array.from(arguments);
  //console.log("场地:"+countRecords[0][0].countType);
  let bookedSum = 0,
    canceledSum = 0,
    countSubtotal = 0;
  countRecords.forEach((countRecord)=> {
    countRecord.forEach((record)=> {
      let date = record.date;
      let time = record.start + ":00" + "~" + record.end + ":00";
      if (record.bookedSubtotal) {
        bookedSum += record.bookedSubtotal;
        console.log(`${date} ${time} ${record.bookedSubtotal}元`);
      } else {
        canceledSum += record.cancelSubtotal;
        console.log(`${date} ${time} 违约金 ${record.cancelSubtotal}元`);
      }
    })
  });
  countSubtotal = bookedSum + canceledSum;
  console.log(`小计：${countSubtotal}元
  `);
  total.push(countSubtotal);
}
rl.on('line', function (time) {
  if (time !== "") {
    let arr = time.trim().split(" ");
    if (arr.length < 4 || arr.length > 5) {
      console.log("Error: the booking is valid");
    } else {
      isLegal(arr);
    }
  } else {
    generateRecords();
    rl.close();
  }
});

//Todo
//1.把node src/manage.js改了
//2.提交
//3.写readme,和测试
