import 'echarts-extension-amap'
import Bus from '../../assets/Bus'
import streetJson from './streetGeometry.json'
export default {
  mapLoaded: false,
  mapOption: {
    mapStyle: 'amap://styles/83b2f040019ceae4dffa9f805923aac8',
    zoom: 9.87,
    rotateEnable: true,
    center: [121.646228, 31.126809],
    viewMode: '3D',
    animateEnable: true,
    showBuildingBlock: true,
    buildingAnimation: true,
    pitch: 0,
    pitchEnable: false,
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
          color: '@white'
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
  // 区级边界
  districtPolygon: null,
  districtMap(boolean) {
    if (boolean) {
      // 街道边界颜色 #48FFFF（绿色）、#FFC200（黄色）
      const map = window.map
      const _this = this
      AMap.plugin('AMap.DistrictSearch', function () {
        let districtSearch = new AMap.DistrictSearch({
          extensions: 'all',
          level: 'district',
          subdistrict: 0
        })
        districtSearch.search('浦东新区', function (status, result) {
          let holes = result.districtList[0].boundaries
          const polygons = []
          holes.forEach(i => {
            const polygon = new AMap.Polygon({
              path: i,
              strokeColor: '#E8BE2A', // 城市边界颜色
              strokeWeight: 1,
              fillColor: '#fff', // 遮罩背景色黑色
              fillOpacity: 0.03,
            })
            polygons.push(polygon)
          })

          _this.districtPolygon = polygons
          map.add(polygons)
        })
      })
    } else {
      this.districtPolygon.forEach(i => {
        i.setMap(null)
      })
      this.districtPolygon = null
    }
  },
  // 街道边界
  streetPolygons: null,
  districtMap_street(boolean) {
    if (boolean) {
      // 街道边界颜色 #48FFFF（绿色）、#FFC200（黄色）
      const map = window.map
      console.log(streetJson.features)
      let holes = streetJson.features.map(i => i.geometry.coordinates[0])
      const polygons = []
      holes.forEach(i => {
        const polygon = new AMap.Polygon({
          path: i,
          strokeColor: '#48FFFF', // 城市边界颜色
          strokeWeight: 1,
          strokeStyle: 'dashed',
          fillColor: '#fff', // 遮罩背景色黑色
          fillOpacity: 0.03,
        })
        polygons.push(polygon)
      })
      this.streetPolygons = polygons
      map.add(polygons)
    } else {
      this.streetPolygons.forEach(i => {
        i.setMap(null)
      })
      this.streetPolygons = null
    }
  },
  // 点位点击事件
  mapPointClick(e) {
    console.log(e.target)
    Bus.$emit('mapPointClick', e.target)
  },
  // 地图移动
  gotoPosition(coord, zoom) {
    const map = window.map
    // 返回默认视角
    if (!coord) {
      map.setZoomAndCenter(9.87, [121.646228, 31.126809])
    }
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
  // 地图俯仰角
  setPitch(deg) {
    const map = window.map
    if (deg === 0) {
      map.setPitch(deg)
      map.setStatus({
        pitchEnable: false
      })
    } else {
      map.setStatus({
        pitchEnable: true
      })
      map.setPitch(deg)
    }

  },
  // 飞线效果
  drawFlyLine(data, color) {
    const series = [{
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
    }, ]
    mapCharts.setOption({
      series: series
    });
  },
  // 撒点
  addMarkerLayer(data, layerName) {
    if (this.layer_obj[layerName] && this.layer_obj[layerName].length === data.length) return
    const map = window.map
    this.layer_obj[layerName] = []
    let layerList = []
    data.forEach(i => {
      i.layerName = layerName
      const marker = new AMap.Marker({
        position: i.position,
        icon: i.icon,
        extData: i,
        label: i.title
      })
      marker.on('click', this.mapPointClick)
      marker.on('mouseover', (e) => {
        marker.setLabel({
          direction:'bottom',
          offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
          content: `<div class='labelInfo'>${i.title}</div>`, //设置文本标注内容
      });
      });
      marker.on('mouseout', (e) => {
        marker.setLabel(null);
      });
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
  },
  // 聚合撒点
  addClusterMarkerLayer(data, layerName) {

    if (this.layer_obj[layerName] && this.layer_obj[layerName].length === data.length) return
    const map = window.map
    this.layer_obj[layerName] = []
    let layerList = []

    data.forEach(i => {
      i.layerName = layerName
      const marker = new AMap.Marker({
        position: i.position,
        icon: i.icon,
        extData: i,
        label: i.title
      })
      marker.on('click', this.mapPointClick)
      marker.on('mouseover', (e) => {
        marker.setLabel({
          direction:'bottom',
          offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
          content: `<div class='labelInfo'>${i.title}</div>`, //设置文本标注内容
      });
      });
      marker.on('mouseout', (e) => {
        marker.setLabel(null);
      });
      layerList.push(marker)

    })
    var count = data.length;
    var _renderClusterMarker = function (context) {
      var div = document.createElement('div');
      var size = Math.round(10 + Math.pow(context.count / count, 1 / 5) * 20);
      div.style.width = div.style.height = size + 'px';
      div.innerHTML = context.count;
      div.style.lineHeight = size + 30 + 'px';
      div.style.color = '#fff';
      div.style.fontSize = '14px';
      div.style.textAlign = 'center';
      div.style.backgroundImage = `url(${data[0].icon})`
      div.style.backgroundSize = '100% 100%'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
      context.marker.setContent(div)
    };

    const cluster = new AMap.MarkerClusterer(map, layerList, {
      gridSize: 80,
      maxZoom: 11,
      renderClusterMarker: _renderClusterMarker
    });
    this.layer_obj[layerName] = cluster
    // this.cluster.on('click', this.mapPointClick)
  },
  // 实时路况
  trafficLayer: null,
  drawTrafficLayer(boolean) {
    const map = window.map
    if (boolean) {
      if (this.trafficLayer) return;
      this.trafficLayer = new AMap.TileLayer.Traffic({
        zooms: [3, 15],
        opacity: 0.7
      });
      map.add(this.trafficLayer); // 添加图层到地图
    } else {
      if (!this.trafficLayer) return;
      map.remove(this.trafficLayer);
      this.trafficLayer = null
    }
  },
  // 卫星地图
  satelliteLayer: null,
  drawSatelliteLayer(boolean) {
    if (boolean) {
      const map = window.map;
      this.satelliteLayer = new AMap.TileLayer.Satellite({
        map: map,
      });
    } else {
      this.satelliteLayer.setMap(null);
      this.satelliteLayer = null
    }
  }
}