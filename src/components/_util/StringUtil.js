// import { start } from "repl";

export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}



export const ObjectToString = function (obj, single) {
  var type = Object.prototype.toString.call(obj)
  var result = ''
  if (type === '[object Object]') {
    result += '{'
    for (var o in obj) {
      if (Object.prototype.toString.call(obj[o]) === '[object String]') {
        if (single == 1) {
          result += `'${o}'` + ': "' + obj[o] + '",'
        } else {
          result += o + ': "' + obj[o] + '",'
        }
      } else if (Object.prototype.toString.call(obj[o]) === '[object Object]') {
        result += o + ': ' + ObjectToString(obj[o]) + ','
      } else if (Object.prototype.toString.call(obj[o]) === '[object Array]') {
        result += o + ': ' + ArrayToString(obj[o]) + ','
      } else {
        if (single == 1) {
          result += `'${o}'` + ': ' + obj[o] + ','
        } else {
          result += o + ': ' + obj[o] + ','
        }

      }
    }
    result += '}'
  }else if(type == '[object String]'){
    result += `"${obj}",`
  }
  return result
}
//数组转字符串
export const ArrayToString = function (obj) {
  var type = Object.prototype.toString.call(obj)
  var result = ''
  if (type === '[object Array]') {
    result = '['
    obj.forEach(ele => {
      result += ObjectToString(ele)
    })
    result += ']'
  } else if (type === '[object Object]') {
    result += ObjectToString(obj)
  }
  return result
}

/**
 * 
 * @param {*开始时间} sDay 
 * @param {*天数} time 
 * @param {*类型1、自然日2、工作日）} type 
 */
export const countEndDate = function (sDay, time, type) {
  if (type == 1) {  //自然日
    var sDay = new Date(sDay)
    sDay = sDay.valueOf()
    sDay += 1000 * 60 * 60 * 24 * time
    sDay = new Date(sDay)
  } else { //工作日
    sDay = new Date(sDay)
    for (var i = 0; i < time; i++) {
      // console.log(i, sDay, sDay.getDay())
      sDay = sDay.valueOf()
      sDay += 1000 * 60 * 60 * 24
      sDay = new Date(sDay)
      if (sDay.getDay() == 0 || sDay.getDay() == 6) {
        i--
      }

    }
  }
  var y_m_d = sDay.getFullYear() + '-' + (sDay.getMonth() + 1) + '-' + sDay.getDate()
  // console.log(sDay.getFullYear(), sDay.getMonth(), sDay.getDate())
  return y_m_d
}


//获取工作日/自然日
export const countWorkDay = function (sDay, eDay, type) {
  console.log(sDay, eDay, 'sDay,eDay')
  var sDay = new Date(Date.parse(sDay.replace(/-/g, "/")));
  var eDay = new Date(Date.parse(eDay.replace(/-/g, "/")));
  var s_t_w = sDay.getDay(), e_t_w = eDay.getDay();
  console.log(sDay, eDay, 'sDay,eDay')
  // 总相差天数
  var diffDay = (eDay - sDay) / (1000 * 60 * 60 * 24) + 1;
  if (parseInt(diffDay) == 0)
    return parseInt(diffDay);
  // 周末天数
  var weekEnds = 0;
  if (type == 2) {
    for (var i = 0; i < diffDay; i++) {
      if (sDay.getDay() == 0 || sDay.getDay() == 6)
        weekEnds++;
      sDay = sDay.valueOf();
      sDay += 1000 * 60 * 60 * 24;
      sDay = new Date(sDay);
    }
  }

  return parseInt(diffDay - weekEnds);
}



export const getDuration = function (endDate, startDate) {
  var endTime = new Date(endDate).getTime()
  var startTime = new Date(startDate).getTime()
  var seconds = (endTime - startTime) / 1000 / 60
  return parseFloat(seconds.toFixed(2))
}