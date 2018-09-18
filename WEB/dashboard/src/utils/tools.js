
/*
 * 组装Get请求参数
 */
function BaseArgument(initArgument = '') {
  this.arguments = initArgument
  this.setArgument = function(key, value) {
    this.arguments += this.arguments.indexOf('?') === -1 ? '?' : '&'
    this.arguments += encodeURIComponent(key) + '=' + encodeURIComponent(value)
  }
}

const tools = {
  BaseArgument
}

export default tools
