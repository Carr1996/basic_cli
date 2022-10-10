<template>
  <div class='mapPane'>
    <div class="map" id="map" ref="map"></div>
  </div>
</template>

<script>
import MapConfig from "./MapConfig.js";
export default {
  name: "",
  components: {},
  data() {
    return {
      MapConfig,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.changeCss();
    // 常规版
    MapConfig.initMap();
    // echarts版
    // MapConfig.initEchartsMap(this.$refs.map);
    map.on("complete", () => {
      MapConfig.mapLoaded = true;
      map.setFitView(); // 调整视角将覆盖物放置在视野范围内
      // 将创建的点标记添加到已有的地图实例：
      MapConfig.districtMap()
    });
    map.on("zoomend", () => {
      console.info("中心点" + map.getCenter());
      console.info("缩放层级" + map.getZoom());
    });
    map.on("click", (e) => {
      console.info("点击坐标" + e.lnglat.getLng() + "," + e.lnglat.getLat());
    });
  },
  beforeDestroy() {},
  methods: {
    changeCss() {
      const scale = {
        scaleX: window.scale[0],
        scaleY: window.scale[1],
      };
      this.$refs.map.style.transform = `scale(${1 / scale.scaleX},${
        1 / scale.scaleY
      })`;
      this.$refs.map.style.width = `${scale.scaleX * 100}%`;
      this.$refs.map.style.height = `${scale.scaleY * 100}%`;
    },
  },
  watch: {},
};
</script>
<style lang='less'>
.mapPane {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 0 0;
  .map {
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
  }
  .amap-logo {
    right: 0 !important;
    left: auto !important;
    display: none;
    opacity: 0;
  }
}
</style>