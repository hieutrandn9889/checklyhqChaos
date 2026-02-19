export const randomString = (length: number) => {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const randomStringNumber = () => {
  var result = ''
  var characters = '0123456789'
  var charactersLength = characters.length
  for (var i = 0; i <= 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const randomSpecial = (length: number) => {
  var result = ''
  var characters = '\'<>!@#$%^&*(){}[]-_+=;:|?"'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const splitNumberString = (str: string) => {
  var arr = str.match(/[\d\.]+|\D+/g)
  if (arr == null) return ''
  else return arr.filter((item) => Number(item)).join('')
}

export const validateEmail = (email: string) => {
  if (/\S+@\S+\.\S+/.test(email)) return true
  return false
}

export const getCurrentDate = () => {
  var today = new Date()
  var dateCurrent =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1) +
    '-' +
    (today.getDate() < 10 ? `0${today.getDate()}` : today.getDate())
  return dateCurrent
}

export const getCurrentDateDDMMYYYY = () => {
  var today = new Date()
  var dateCurrent = today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear()
  return dateCurrent
}

export const addDays = (dateStr: string, numDays: number) => {
  var dateObj = new Date(dateStr)
  dateObj.setDate(dateObj.getDate() + numDays)
  let result =
    dateObj.getFullYear() +
    '-' +
    (dateObj.getMonth() + 1 < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1) +
    '-' +
    (dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate())
  return result
}
