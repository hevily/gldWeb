export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor((Math.random()*arr.length))
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.getElementById(id).remove()
  }, timeout)
}

//对象转字符串
// f/对象转字符串
function ObjectToString(obj) {
  var type = Object.prototype.toString.call(obj)
  var result = ''
  if (type === '[object Object]') {
    result += '{'
    for (var o in obj) {
      if(o !== '__typename'){
        if (Object.prototype.toString.call(obj[o]) === '[object String]') {
          result += o + ': "' + obj[o] + '",'
        } else {
          result += o + ': ' + obj[o] + ','
        }
      }
    }
    result += '}'
  }
  return result
}
//数组转字符串
export function ArrayToString(obj) {
  var type = Object.prototype.toString.call(obj)
  var result = ''
  if (type === '[object Array]') {
    result = '['
    obj.forEach(ele => {
      var type = Object.prototype.toString.call(ele)
      if(type === '[object Object]'){
        result += ObjectToString(ele)
      }else{
        result += '"' + ele + '",'
      }
    })
    result += ']'
  } else if (type === '[object Object]') {
    result += ObjectToString(obj)
  }
  return result
}