import axios from '../axios/axios'
import tools from '../utils/tools'

/**
 * 获取respage01相关的数据
 * @param type
 * @param start_time
 * @param end_time
 * @param callback
 */
const getRespage01Info = (type, start_time, end_time, callback) => {
  const args = new tools.BaseArgument()
  args.setArgument('type', type)
  args.setArgument('start_time', start_time)
  args.setArgument('end_time', end_time)
  axios.get('v1/respage01' + args.arguments).then(res => {
    callback.success(res.data)
  }).catch(err => {
    callback.fail(err)
  })
}

/**
 * 获取respage02相关的数据
 * @param type
 * @param day
 * @param time
 * @param callback
 */
const getRespage02Info = (type, day, time, callback) => {
  const args = new tools.BaseArgument()
  args.setArgument('type', type)
  args.setArgument('day', day)
  args.setArgument('time', time)
  axios.get('v1/respage02' + args.arguments).then(res => {
    callback.success(res.data)
  }).catch(err => {
    callback.fail(err)
  })
}

const rouboapis = {
  getRespage01Info,
  getRespage02Info
}

export default rouboapis
