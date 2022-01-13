const axios = require('axios')
const queryStr = process.argv[2]
const path = require('path')
const config = require(path.join(__dirname, '../config.json'))
const appKey = config.appKey
const appSecret = config.appSecret

const md5 = (str) => {
  const cr = require('crypto')
  const md5 = cr.createHash('md5')
  md5.update(str)
  const result = md5.digest('hex')
  return result.toUpperCase()  //32位大写
}

const buildLine = (title, subTitle = '', action = () => {}) => {
  return {
    title,
    subtitle: subTitle,
    arg: title,
    action
  }
}

let timeout

function getData (query) {
  if (timeout) clearTimeout(timeout)
  return new Promise(resolve => {
    timeout = setTimeout(() => {
      const salt = new Date().getTime()
      // appKey+q+salt+密钥
      const sign = md5(appKey + query + salt + appSecret)
      if (!appKey || !appSecret) return resolve([buildLine('未配置AppKey或者AppSecret', '请正确配置AppKey或者AppSecret')])

      const request = `http://openapi.youdao.com/api?q=${encodeURIComponent(query)}&appKey=${appKey}&from=auto&to=auto&salt=${salt}&sign=${sign}`
      axios.get(request).then((res) => {
        const resultList = []
        // 无结果处理
        if (!query) {
          return resultList
        }

        const { basic, translation: [translate] } = res.data
        // 查词成功
        if (basic) {
          const { explains, phonetic } = basic
          if (phonetic) {
            resultList.push(buildLine(translate, `[${phonetic}]`, () => {
              clipboard.writeText(translate)
            }))
          }
          explains.forEach(translate => {
            resultList.push(buildLine(translate, query, () => {
              clipboard.writeText(translate)
            }))
          })
        } else {
          // 查词失败
          // 翻译失败
          if (query === translate) {
            resultList.push(buildLine('暂时没有合适的结果', '继续输入可能会不一样哦'))
            return resolve(resultList)
          }
          // 翻译成功
          resultList.push(buildLine(translate, query))
        }
        resolve(resultList)
      })
    }, 200)
  })
}

let incrementNumber = 0
const getIncrementNumber = () => {
  incrementNumber++
  if (incrementNumber > 99999) incrementNumber = 0
  return incrementNumber
}
/**
 * 获取uuid
 * 时间戳-随机字符串-99999以内的自增
 */
const generateUUID = () => `${Date.now()}-${(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)}-${getIncrementNumber()}`
getData(queryStr).then(res => {
  console.log(JSON.stringify({items: res}))
})
