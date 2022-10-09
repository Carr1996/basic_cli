<template>
  <span class="jump_number">
    {{ animatedNumber }}
    <span style="display: none" ref="hiddenNumber">
      <slot></slot>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    decimal: {
      // 数字保留几位小数
      type: Number,
      default: 0,
    },
    duration: {
      // 数字跳动时间
      type: Number,
      default: 3,
    },
    interval: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      tweenedNumber: 0,
      number: 0,
      slot: undefined,
    };
  },
  created() {
    this.number = this.$slots.default[0].text;
    this.slot = this.$slots.default[0];
  },
  computed: {
    animatedNumber() {
      return this.isNumber && !isNaN(+this.tweenedNumber)
        ? (+this.tweenedNumber / Math.pow(10, this.decimal)).toFixed(
            this.decimal
          )
        : "-";
    },
    isNumber() {
      return this.number !== "-";
    },
  },
  watch: {
    number() {
      this.runAnimation();
    },
  },
  beforeDestory() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.tweenedNumber = 0;
      gsap.to(this.$data, {
        duration: this.duration,
        tweenedNumber: +this.number,
      });
    }, this.interval);
    this.runAnimation();
    this.obverse();
  },
  methods: {
    runAnimation() {
      if (!this.isNumber) return;
      gsap.to(this.$data, {
        duration: this.duration,
        tweenedNumber: +this.number,
      });
    },
    obverse() {
      const that = this;
      let dom = that.$refs.hiddenNumber;
      let config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      };
      const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            console.log("A child node has been added or removed.");
          } else if (mutation.type === "attributes") {
            console.log(
              "The " + mutation.attributeName + " attribute was modified."
            );
          } else if (mutation.type === "characterData") {
            that.number = mutation.target.data;
          }
        }
      };
      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(dom, config);
    },
  },
};
</script>
<style lang='less' scoped>
.jump_number {
  position: relative;
}
</style>