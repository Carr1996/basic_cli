<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/icon/logo.png">
    <jump-number>100</jump-number>
  </div>
</template>

<script>
import JumpNumber from '@components/common/JumpNumber'
export default {
  name: 'App',
  components: {JumpNumber
  },
  data() {
    return {
      Share,
    };
  },
  created() {
    window.addEventListener("resize", this.changeCss);
    this.changeCss();
  },
  mounted() {
    
  },
  destroyed() {
    window.removeEventListener("resize", this.changeCss);
  },
  methods: {
    changeCss() {
      let innerWidth = window.innerWidth;
      let innerHeight = window.innerHeight;
      let dom = document.getElementById("app");
      let domW = dom.clientWidth;
      let domH = dom.clientHeight;
      let scaleX = innerWidth / domW;
      let scaleY = ((domH / domW) * innerWidth) / domH;
      let tranformOrigin = (innerHeight - (domH / domW) * innerWidth) / 2;
      window.scale = [scaleX, scaleY];
      let body = document.getElementsByTagName("body")[0];
      body.style["transform"] = "scale(" + scaleX + "," + scaleY + ")";
      body.style["-webkit-transform-origin-x"] = "left";
      body.style["-webkit-transform-origin-y"] = tranformOrigin + "px";
    },
    close() {
      window.parent.postMessage({"from":"thirdLevel", "type":"精准救助", "method": "close"}, "*");
      // window.open("about:blank", "_self").close();
    },
  },
  watch: {
    "Share.mapLoad"(newVal, old) {
      Share.mapLoad = true;
      window.parent.postMessage({"from":"thirdLevel", "type":"精准救助", "method": "loaded"}, "*");
    },
  },
}
</script>

<style lang="less">
</style>
