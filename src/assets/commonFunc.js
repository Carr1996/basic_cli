// 寻找数组中最大值index, -1 为未找到或参数错误
Array.prototype.findIndexOfMax = function (key = undefined) {
  let empty = {
    value: undefined,
    index: -1,
  }
  if (!this.length) {
    console.warn("传递数据不为数组或数组为空!!!");
    return empty;
  }
  let maxValue = this[0];
  let maxIndex = 0;
  // 处理一般数组
  if (typeof key !== "string") {
    for (let i = 0, length = this.length; i < length; i++) {
      if (+this[i] > maxValue) {
        maxValue = +this[i];
        maxIndex = i;
      }
    }
    if (typeof this[maxIndex] !== 'number') {
      console.warn("数组包含无法转换数字类型, 无法使用 findIndexOfMax!!!")
      return empty;
    }
  }
  // 处理对象类数组
  else {
    for (let i = 0, length = this.length; i < length; i++) {
      if (+this[i][key] > maxValue[key]) {
        maxValue = this[i];
        maxIndex = i;
      }
    }
  }
  return {
    value: maxValue,
    index: maxIndex,
  } || empty;
};
// 寻找数组中最小值index, -1 为未找到或参数错误
Array.prototype.findIndexOfMin = function (key = undefined) {
  let empty = {
    value: undefined,
    index: -1,
  }
  if (!this.length) {
    console.warn("传递数据不为数组或数组为空!!!");
    return empty;
  }
  let minValue = this[0];
  let minIndex = 0;

  // 处理一般数组
  if (typeof key !== "string") {
    for (let i = 0, length = this.length; i < length; i++) {
      if (+this[i] < minValue) {
        minValue = +this[i];
        minIndex = i;
      }
    }
    if (typeof this[minIndex] !== 'number') {
      console.warn("数组包含无法转换数字类型, 无法使用 findIndexOfMin!!!")
      return empty;
    }
  }
  // 处理对象类数组
  else {
    for (let i = 0, length = this.length; i < length; i++) {
      if (+this[i][key] < minValue[key]) {
        minValue = this[i];
        minIndex = i;
      }
    }
  }

  return {
    value: minValue,
    index: minIndex,
  } || empty;
};
// 将数组由 n * 1 转换为 n * n
Array.prototype.reshape = function (row = -1, col = -1) {
  if (typeof row !== 'number' || typeof col !== 'number') {
    console.warn("参数不为数字类型,请检查参数传递");
  }
  if (row === -1 && col === -1) {
    return this;
  }
  let interval = row !== -1 ? Math.ceil(this.length / row) : col;
  let arr = [];
  for (let i = 0; i < this.length; i += interval) {
    i >= this.length - 2 ?
      arr.push(this.slice(i, this.length)) :
      arr.push(this.slice(i, i + interval))
  }
  return arr;
};

export default {
  xmlHttpRequest(url, param, method) {
    return new Promise((resolve, reject) => {
      let _method = (method || '').toUpperCase() || 'GET';

      if (!url) {
        reject();
      } else {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open(_method, url);
        xmlhttp.send(JSON.stringify(param));
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
              let json = JSON.parse(xmlhttp.responseText);
              resolve(json)
            }
          } else {
            let json = JSON.parse(xmlhttp.responseText);
            resolve(json)
          }
        }
      }
    })
  },
  copyText(copytext) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', copytext);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      return true;
    }
    document.body.removeChild(input);
  },
  /*
   * 通用日期相关functions
   */
  //当天
  get_now_day() {
    let d = new Date()
    let year = String(d.getFullYear())
    let month = String(d.getMonth() + 1)
    let day = String(d.getDate())
    if (month.length == 1) {
      month = '0' + month
    }
    if (day.length == 1) {
      day = '0' + day
    }
    let date = year + '-' + month + '-' + day
    return date
  },
  // 当天星期几
  get_today_week() {
    let date = new Date()
    const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return weeks[date.getDay()]
  },
  // 当周第一天
  get_now_week() {
    let d = new Date()
    let weekday = d.getDay() || 7
    d.setDate(d.getDate() - weekday + 1)
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDate()
    if (month.length == 1) {
      month = '0' + month
    }
    if (day.length == 1) {
      day = '0' + day
    }
    return year + '-' + month + '-' + day
  },
  // 当月第一天
  get_now_month() {
    let d = new Date()
    let year = String(d.getFullYear())
    let month = String(d.getMonth() + 1)
    if (month.length == 1) {
      month = '0' + month
    }
    let date = year + '-' + month + '-01'
    return date
  },
  // 获取n天前n天后的日期 exp: 今天：+GetDateStr(0)   昨天：+GetDateStr(-1)
  get_dayStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
    return y + "-" + m + "-" + d;
  },
  // 获取n月前n月后的日期 exp: 上个月：+get_monthStr(-1)
  get_monthStr(AddMonthCount) {
    let date = this.get_now_day()
    let dateArr = date.split('-');
    let year = dateArr[0]; //获取当前日期的年份
    let month = dateArr[1]; //获取当前日期的月份
    let day = dateArr[2]; //获取当前日期的日
    let days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    let year2 = year;
    let month2 = parseInt(month) + AddMonthCount;
    if (month2 <= 0) {
      year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12);
      month2 = 12 - (Math.abs(month2) % 12);
    }
    if (month2 > 12) {
      year2 = parseInt(year2) + parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12);
      month2 = (Math.abs(month2) % 12);
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
  },
  // 获取n年前n年后的日期 exp: 去年：+get_yearStr(-1)
  get_yearStr(AddYearCount) {
    let d = new Date()
    let year = String(d.getFullYear() + AddYearCount)
    let data = year + '-01-01'
    return data
  },
  // 根据年，周获取日期  exp: 2019 第一周 =》 2019-01-01 
  get_date_by_week(year, weeks) {
    Date.prototype.Format = function (fmt) { //需要JS格式化时间，后期做的时候方便使用   
      var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };
    var date = new Date(year, "0", "1");
    // 获取当前星期几,0:星期一 
    var time = date.getTime();
    //当这一年的1月1日为周日时则本年有54周,否则没有54周,没有则去除第54周的提示       
    var _week = date.getDay();

    if (_week != 0) { //一年53周情况 
      if (weeks == 54) {
        return '今年没有54周';
      }
      var cnt = 0; // 获取距离周末的天数    
      if (_week == 0) {
        cnt = 7;
      } else if (_week == 1) {
        cnt = 6;
      } else if (_week == 2) {
        cnt = 5;
      } else if (_week == 3) {
        cnt = 4;
      } else if (_week == 4) {
        cnt = 3;
      } else if (_week == 5) {
        cnt = 2;
      } else if (_week == 6) {
        cnt = 1;
      }
      cnt += 1; //加1表示以星期一为一周的第一天    // 将这个长整形时间加上第N周的时间偏移    
      time += cnt * 24 * 3600000; //第2周开始时间 
      var nextYear = new Date(parseInt(year, 10) + 1, "0", "1");
      var nextWeek = nextYear.getDay();
      var lastcnt = 0; //获取最后一周开始时间到周末的天数    
      if (nextWeek == 0) {
        lastcnt = 6;
      } else if (nextWeek == 1) {
        lastcnt = 0;
      } else if (nextWeek == 2) {
        lastcnt = 1;
      } else if (nextWeek == 3) {
        lastcnt = 2;
      } else if (nextWeek == 4) {
        lastcnt = 3;
      } else if (nextWeek == 5) {
        lastcnt = 4;
      } else if (nextWeek == 6) {
        lastcnt = 5;
      }
      if (weeks == 1) { //第1周特殊处理    // 为日期对象 date 重新设置成时间 time
        var start = date.Format("yyyy-MM-dd");
        date.setTime(time - 24 * 3600000);

        return start + "-----" + date;
      } else if (weeks == 53) { //第53周特殊处理  
        //第53周开始时间      
        var start = time + (weeks - 2) * 7 * 24 * 3600000;
        //第53周结束时间
        var end = time + (weeks - 2) * 7 * 24 * 3600000 + lastcnt * 24 * 3600000 - 24 * 3600000;
        date.setTime(start);
        var _start = date.Format("yyyy-MM-dd");
        date.setTime(end);
        var _end = date.Format("yyyy-MM-dd");
        return _start + "---" + _end;
      } else {
        var start = time + (weeks - 2) * 7 * 24 * 3600000; //第n周开始时间    
        var end = time + (weeks - 1) * 7 * 24 * 3600000 - 24 * 3600000; //第n周结束时间
        date.setTime(start);
        var _start = date.Format("yyyy-MM-dd");
        date.setTime(end);
        var _end = date.Format("yyyy-MM-dd");
        return _start + "---" + _end;
      }
    } else { //一年54周情况    
      var cnt = 0; // 获取距离周末的天数    
      if (_week == 0 && weeks == 1) { //第一周    
        cnt = 0;
      } else if (_week == 0) {
        cnt = 7;
      } else if (_week == 1) {
        cnt = 6;
      } else if (_week == 2) {
        cnt = 5;
      } else if (_week == 3) {
        cnt = 4;
      } else if (_week == 4) {
        cnt = 3;
      } else if (_week == 5) {
        cnt = 2;
      } else if (_week == 6) {
        cnt = 1;
      }
      cnt += 1; //加1表示以星期一为一周的第一天    
      // 将这个长整形时间加上第N周的时间偏移    
      time += 24 * 3600000; //第2周开始时间    
      var nextYear = new Date(parseInt(year, 10) + 1, "0", "1");
      var nextWeek = nextYear.getDay();
      var lastcnt = 0; //获取最后一周开始时间到周末的天数    
      if (nextWeek == 0) {
        lastcnt = 6;
      } else if (nextWeek == 1) {
        lastcnt = 0;
      } else if (nextWeek == 2) {
        lastcnt = 1;
      } else if (nextWeek == 3) {
        lastcnt = 2;
      } else if (nextWeek == 4) {
        lastcnt = 3;
      } else if (nextWeek == 5) {
        lastcnt = 4;
      } else if (nextWeek == 6) {
        lastcnt = 5;
      }
      if (weeks == 1) { //第1周特殊处理
        var start = date.Format("yyyy-MM-dd");
        date.setTime(time - 24 * 3600000);
        alert(start + '--' + date);
        return _start + "---" + date;
      } else if (weeks == 54) { //第54周特殊处理   
        //第54周开始时间    
        var start = time + (weeks - 2) * 7 * 24 * 3600000;
        //第53周结束时间 
        var end = time + (weeks - 2) * 7 * 24 * 3600000 + lastcnt * 24 * 3600000 - 24 * 3600000;
        date.setTime(start);
        var _start = date.Format("yyyy-MM-dd");
        date.setTime(end);
        var _end = date.Format("yyyy-MM-dd");
        return _start + "---" + _end;
      } else {
        var start = time + (weeks - 2) * 7 * 24 * 3600000; //第n周开始时间    
        var end = time + (weeks - 1) * 7 * 24 * 3600000 - 24 * 3600000; //第n周结束时间
        date.setTime(start);
        var _start = date.Format("yyyy-MM-dd");
        date.setTime(end);
        var _end = date.Format("yyyy-MM-dd");
        return _start + "---" + _end;
      }
    }
  }
}