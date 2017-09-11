'use strict';
let {isLegal, getScheduleTime, getCancelTime, generateRecords, calculateSubTotal, getSubTotal, printCharge} = require('../index');
let chargeStandards = require('../src/charge-standards');

//输入测试
describe('input is legal', ()=> {
  it('#1 | should return false when date is not yyyy-mm-dd',()=>{
    let expected = false;
    let result = isLegal(['U002', '2017.08.01','19:00~22:00','A']);
    expect(result).toEqual(expected);
  });
  it('#2| should return false when start equals end', ()=> {
    let expected = false;
    let result = isLegal(['U002', '2017-08-01', '19:00~19:00', 'A']);
    expect(result).toEqual(expected);
  });
  it('#3| should return false when start more than end', ()=> {
    let expected = false;
    let result = isLegal(['U002', '2017-08-01', '19:00~15:00', 'A']);
    expect(result).toEqual(expected);
  });
  it('#4| should return false when countType is not including',()=>{
    let expected = false;
    let result = isLegal(['U002', '2017-08-01','19:00~22:00','Z']);
    expect(result).toEqual(expected);
  });
  //取消预定
  it('#5| should return false when C is wrong',()=>{
    let expected = false;
    let result = isLegal(['U002', '2017-08-01','19:00~22:00','A','c']);
    expect(result).toEqual(expected);
  });
  //预定正确
  it('#6| should return true when booking is legal',()=>{
    let expected = true;
    let result = isLegal(['U002', '2017-08-01','19:00~22:00','A']);
    expect(result).toEqual(expected);
  });
  //取消正确
  it('#7| should return true when cancel booking is legal',()=>{
    let expected = true;
    let result = isLegal(['U002', '2017-08-01','19:00~22:00','A','C']);
    expect(result).toEqual(expected);
  });
});

describe('the booking is accepted', ()=> {
  it('#8 | should return true when time is proper', ()=> {
    let expected = true;
    let result = getScheduleTime(['U002', '2017-08-01', '19:00~22:00', 'A']);
    expect(result).toEqual(expected);
  });
  it('#9 | should return false when time is overlap', ()=> {
    let expected = false;
    let result = getScheduleTime(['U002', '2017-08-01', '20:00~22:00', 'A']);
    expect(result).toEqual(expected);
  });
});

describe('the cancel booking is accepted', ()=> {
  it('#10| should return true when time is proper', ()=> {
    let expected = true;
    let result = getCancelTime(['U002', '2017-08-01', '19:00~22:00', 'A','C']);
    expect(result).toEqual(expected);
  });
  it('#11 | should return false when time')
  //Todo
});
