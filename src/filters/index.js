import dayjs from 'dayjs'

// 过滤时间
export const formaTime = (val) => {
  return dayjs(val).format('YYYY-MM-DD')
}
