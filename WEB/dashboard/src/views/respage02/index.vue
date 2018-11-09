<template>
  <div style="background: #c0c4cc;">
    <div style="font-size: 0px">placehold</div>
    <div class="page header">
      <ImageCard :text_title="showinfo.timeline" class="header_item" icon_name="respage02_timeline" @click_me="clickMe('timeline')"/>
      <ImageCard class="header_item" icon_name="respage02_move" text_title="今日流动" @click_me="clickMe('move')"/>
    </div>
    <div class="page map">
      <el-card>
        <ve-heatmap :data="chartDataMap" :settings="chartSettingsMap" height="600px"/>
      </el-card>
    </div>
  </div>
</template>

<script>
import ImageCard from '@/components/ImageCard'
export default {
  components: {
    ImageCard
  },
  data() {
    this.chartSettingsMap = {
      key: 'rL7OMKy4X4aeLCIbg0psT7fjO0z6biwi',
      bmap: {
        center: [119.65, 29.08],
        zoom: 14,
        roam: true,
        mapStyle: {
          style: 'dark'
        }
      },
      type: 'bmap'
    }
    return {
      chartDataMap: {
        columns: ['lng', 'lat'],
        rows: []
      },
      timelist: [],
      showinfo: {
        timeline: '今日回看'
      }
    }
  },
  mounted() {
    // 获取最新的数据
    this.getNowLocation()
    // 获取最新的时间列表
    this.getAllTimeList()
  },
  methods: {
    /**
     * 获取最新的数据
     */
    getNowLocation: function() {
      this.rouboapis.getRespage02Info('now', this.today('-'), null, {
        success: (res) => {
          this.chartDataMap.rows = res
        },
        fail: (err) => {
          console.log(JSON.stringify(err))
        }
      })
    },
    /**
     * 获取今天的日期'2018-09-09'
     * @param spacer 风格符
     * @returns {*}
     */
    today: function(spacer) {
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      if (m < 10 && d < 10) {
        return y + spacer + '0' + m + spacer + '0' + d
      } else if (m < 10) {
        return y + spacer + '0' + m + spacer + d
      } else if (d < 10) {
        return y + spacer + m + spacer + '0' + d
      }
      return y + spacer + m + spacer + d
    },
    /**
     * 点击复盘按钮事件
     */
    onPlay: function() {
      let index = 0
      const timer = setInterval(() => {
        this.showinfo.timeline = '今日回看 ' + this.timelist[index].time
        this.getLocation(this.timelist[index].time)
        index = index + 1
        if (index >= this.timelist.length) {
          clearInterval(timer)
          return
        }
      }, 5000)
    },
    clickMe: function(who) {
      switch (who) {
        case 'timeline':
          this.onPlay()
          break
        case 'move':
          break
      }
    },
    getAllTimeList: function() {
      this.rouboapis.getRespage02Info('timelist', this.today('-'), null, {
        success: (res) => {
          this.timelist = res
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    getLocation: function(time) {
      this.rouboapis.getRespage02Info('location', this.today('-'), time, {
        success: (res) => {
          this.chartDataMap.rows = res
          this.showinfo.timeline = this.showinfo.timeline + ' ' + res.length
        },
        fail: (err) => {
          console.log(err)
        }
      })
    }
  }
}
</script>

<style scoped>
  .page {
    margin-top: 20px;
    margin-left: 30px;
    margin-right: 30px;
  }
  .header {
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .header_item {
    flex-shrink: 0;
    flex-grow: 1;
  }

</style>
