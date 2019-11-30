/**
 * @Author: Sam
 * @Date: 2019/11/30
 * @Version: 1.0
 **/
import originJSONP from 'jsonp'

// use jsonp to encapsulate data
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  // Promise
  // Success => resolve
  // Failure => reject
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// add the data to the url
function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
