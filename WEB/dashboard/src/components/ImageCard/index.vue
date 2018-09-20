<template>
  <div :style="contain_style" @click="click_me">
    <el-card>
      <div class="container">
        <div class="item">
          <svg-icon :icon-class="icon_name" :style="icon_style"/>
        </div>
        <div class="item">
          <div class="text_title">{{ text_title }}</div>
          <Count_to :start-val="0" :end-val="text_count" :duration="3000" class="text_count" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Count_to from 'vue-count-to'
export default {
  name: 'ImageCard',
  components: {
    Count_to
  },
  props: {
    click_me: {
      type: Function,
      require: false,
      default: function() {
        return
      }
    },
    /**
     * card 的样式
     */
    contain_style: {
      type: Object,
      require: false,
      default: function() {
        return {
          height: '100px',
          width: '300px'
        }
      }
    },
    /**
     *  icon 的样式
     */
    icon_style: {
      type: Object,
      require: false,
      default: function() {
        return {
          fontSize: '45px'
        }
      }
    },
    /**
     * icon 名
     */
    icon_name: {
      type: String,
      require: true,
      default: ''
    },
    /**
     *  title 内容
     */
    text_title: {
      type: String,
      require: true,
      default: ''
    },
    /**
     * 数值内容
     */
    text_count: {
      type: Number,
      require: true,
      default: 0
    }
  }
}
</script>

<style scoped>
.container {
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.item {
  align-self: center;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
}
.text_title {
  line-height: 18px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 16px;
  margin-bottom: 12px;
}
.text_count {
  font-size: 20px;
  font-weight: bolder;
}
</style>
