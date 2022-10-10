import 'echarts-extension-amap'
import Bus from '../../assets/Bus'
export default {
  mapLoaded: false,
  mapOption: {
    mapStyle: 'amap://styles/f51a90e811475feb6bc667a16809a635',
    zoom: 14.99,
    zooms: [9.5, 16],
    rotateEnable: true,
    center: [121.476799, 31.245575],
    viewMode: '3D',
    pitch: 0,
    resizeEnable: true,
    doubleClickZoom: false,
    touchZoom: true
  },
  // 图层合集
  layer_obj: {},
  // 基础高德地图
  initMap() {
    const map = new AMap.Map('map', this.mapOption);
    window.map = map
  },
  // echarts高德地图
  initEchartsMap(ref) {
    const mapCharts = echarts.init(ref, null, {
      renderer: 'canvas'
    });
    mapCharts.setOption({
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      amap: this.mapOption,
      animation: false,
      series: []
    });
    const map = mapCharts.getModel().getComponent('amap').getAMap();
    window.map = map
    window.mapCharts = mapCharts
  },
  // 限制地图范围
  districtMap(resolve) {
    const map = window.map
    AMap.plugin('AMap.DistrictSearch', function () {
      let districtSearch = new AMap.DistrictSearch({
        // 关键字对应的行政区级别，country表示国家
        extensions: 'all',
        //  显示下级行政区级数，1表示返回下一级行政区
        subdistrict: 0
      })
      districtSearch.search('上海市', function (status, result) {
        let outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true)
        ]
        let holes = result.districtList[0].boundaries
        let pathArray = [outer]
        pathArray.push.apply(pathArray, holes)
        let polygon = new AMap.Polygon({
          pathL: pathArray,
          strokeColor: 'red', // 城市边界颜色
          strokeOpacity: 0,
          fillColor: '#1C44b3', // 遮罩背景色黑色
          fillOpacity: 0.8,
        })
        polygon.setPath(pathArray)
        map.add(polygon)
        resolve()
      })
    })
  },
  // 点位点击事件
  mapPointClick(e) {
    console.log(e.target)
    Bus.$emit('mapPointClick', e.target)
  },
  // 地图移动
  gotoPosition(coord, zoom) {
    const map = window.map
    if (zoom) {
      map.setZoomAndCenter(zoom, coord)
    } else {
      map.panTo(coord)
    }
  },
  // 地图缩放
  setZoom(zoom) {
    const map = window.map
    map.setZoom(zoom)
  },
  // 飞线效果
   drawFlyLine(data, color) {
    const series = [
      {
        "coordinateSystem": "amap",
        "type": "lines",
        "zlevel": 1,
        "polyline": true,
        "effect": {
          "show": true,
          "constantSpeed": 100,
          "trailLength": 0.1,
          "color": color,
          "symbol": "circle",
          "symbolSize": 5,
          "loop": true
        },
        "lineStyle": {
          "normal": {
            "color": "#a6c84c",
            "width": 0,
            "curveness": 0
          }
        },
        "data": data
      },
    ]
    mapCharts.setOption({
      series: series
    });
  },
  // 撒点
  addMarkerLayer(data,layerName) {
    if(this.layer_obj[layerName] && this.layer_obj[layerName].length === data.length) return
    const map = window.map
    this.layer_obj[layerName] = []
    let layerList = []
    data.forEach(i => {
      const marker = new AMap.Marker({
        position: i.position,
        // icon: '',
        title: i.title,
        extData: i,
        label: i.title
      })
      marker.on('click', this.mapPointClick)
      layerList.push(marker)

    })
    map.add(layerList)
    this.layer_obj[layerName] = layerList
  },
  // 删除点位图层
  deleteMarkerLayer(layerName) {
    if (!this.layer_obj[layerName]) return
    const map = window.map
    map.remove(this.layer_obj[layerName])
    delete this.layer_obj[layerName]
  }
}