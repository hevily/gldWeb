/**
 * 通过编码规则获取唯一编号
 */

import moment from 'moment'
import {db} from './db'

const pad = (num, n) => {
  var len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

function getPre(codeRule, businessType) {
  var pre = ''
  //替换日期
  var d = moment().format(codeRule.dateFormat)
  pre = codeRule.rule.replace('%日期%', d)
  //替换业务类型
  if (businessType) {
    const type = codeRule.businessType[businessType]
    pre = pre.replace('%业务%', type)
  }else {
    pre = pre.replace('%业务%', '')
  }
  //替换流水号为空
  pre = pre.replace('%流水号%', '')
  return pre
}

function generateNo(codeRule, businessType, lastSerial) {
  let no = ''
  //替换日期
  const d = moment().format(codeRule.dateFormat)
  no = codeRule.rule.replace('%日期%', d)
  //替换业务类型
  if (businessType) {
    const type = codeRule.businessType[businessType]
    no = no.replace('%业务%', type)
  }else {
    no = no.replace('%业务%', '')
  }
  //替换流水号
  const serial = lastSerial ? pad(lastSerial + 1, codeRule.serialLen) : pad(codeRule.serialStart, codeRule.serialLen)
  no = no.replace('%流水号%', serial)
  return no
}

export const getNo = async (dbRef, type, businessType) => {
  const dbConn = new db(dbRef)

  // 获取编码规则
  let res = await dbConn.query(`
        query {
          CodeRule(where: {type: {_eq: ${type}}}){
            type
            rule
            dateFormat
            serialStart
            serialLen
          }  
        }
      `)
  const codeRule = res.data.CodeRule[0]

  // 获取业务字典
  res = await dbConn.query(`
          query {
            Dict(where: {type: {_eq: "businessType"}}){
              type
              data
            }
          }
       `)
  codeRule.businessType = res.data.Dict[0].data
  // debugger
  codeRule.businessType = JSON.parse(codeRule.businessType.replace(/'/g,'"'))
  // 获取前缀
  const pre = getPre(codeRule, businessType)

  // 获取改前缀对应最后序列号
  let lastSerial = 0
  res = await dbConn.mutation(`
    mutation {
      insert_CodeSerial (objects: {
        pre: "${pre}"
        serial: 1
      }, on_conflict: {
        constraint: CodeSerial_pre_key
        update_columns: []
      }
      ){
        returning {
          serial
        }
      }
    }
  `)

  if(res.data.insert_CodeSerial.returning.length > 0){
    lastSerial = res.data.insert_CodeSerial.returning[0].serial
  }else{
    res = await dbConn.mutation(`
      mutation {
        update_CodeSerial(where: {
          pre: {_eq: "${pre}"}
        }, _inc: {
          serial: 1
        }){
          returning {
            serial
          }
        }
      }
    `)
    if(res.data.update_CodeSerial.returning.length > 0){
      lastSerial = res.data.update_CodeSerial.returning[0].serial
    }
  }
// debugger
  const lastNo = generateNo(codeRule, businessType, lastSerial)
  return lastNo
}

