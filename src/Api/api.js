const enviro = process.env.NODE_ENV === "development" ? "development" : "production"
export default {
  lowerKey(data) {
    let result = []
    data.forEach((i, index) => {
      result[index] = {}
      _.forEach(i, (value, key) => {
        result[index][key.toLocaleLowerCase()] = value
      })
    })
    return result
  },
  upperKey(data) {
    let result = []
    data.forEach((i, index) => {
      result[index] = {}
      _.forEach(i, (value, key) => {
        result[index][key.toLocaleUpperCase()] = value
      })
    })
    return result
  },
  toLine(data) {
    let result = []
    data.forEach((i, index) => {
      result[index] = {}
      _.forEach(i, (value, key) => {
        result[index][key.replace(/([A-Z])/g,"_$1").toLowerCase()] = value
      })
    })
    return result
  }
}