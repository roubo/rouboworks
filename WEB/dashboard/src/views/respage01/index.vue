<template>
  <div style="background: #c0c4cc;">
    <div style="font-size: 0px">placehold</div>
    <div class="page header">
      <ImageCard :text_count="todayCount.all" class="header_item" icon_name="respage01_count" text_title="今日门店总数" @click_me="clickMe('all')"/>
      <ImageCard :text_count="todayCount.new" class="header_item" icon_name="respage01_new" text_title="今日新增门店" @click_me="clickMe('new')"/>
      <ImageCard :text_count="todayCount.gone" class="header_item" icon_name="respage01_gone" text_title="今日消失门店" @click_me="clickMe('gone')"/>
      <ImageCard :text_count="todayCount.union" class="header_item" icon_name="respage01_max" text_title="历史累计总数" @click_me="clickMe('union')"/>
      <ImageCard :text_count="totalDays" :text_title="playTextTitle" class="header_item" icon_name="respage01_play" @click_me="onPlay"/>
    </div>
    <div class="page map">
      <el-card>
        <ve-heatmap :data="chartDataMap" :settings="chartSettingsMap" height="600px"/>
      </el-card>
    </div>
    <div class="page charts">
      <el-card>
        <ve-line :data="chartDataChart" :settings="chartSettingsChart" width="90%"/>
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
    this.chartSettingsChart = {
      labelMap: {
        'count': '全市门店数量'
      }
    }
    return {
      chartDataMap: {
        columns: ['lng', 'lat'],
        rows: []
      },
      chartDataChart: {
        columns: ['time', 'count'],
        rows: []
      },
      todayCount: {
        all: 0,
        union: 0,
        new: 0,
        gone: 0
      },
      unionList: [],
      newList: [],
      goneList: [],
      allList: [],
      totalDays: 0,
      playTextTitle: '可回放的天数'
    }
  },
  mounted() {
    // 获取当天的数据
    const today = this.today('_')
    this.getLocations(today, today)
    this.getCount('2018_09_13', today)
    this.getTodayCount()
    this.getTodayStat()
  },
  methods: {
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
     *  获取时间段内的时间列表
     */
    getDateList: function(start_time, end_time) {
      let res = []
      const start_time_str = start_time.replace(/_/g, '/')
      const end_time_str = end_time.replace(/_/g, '/')
      const start_date = new Date(start_time_str)
      const end_date = new Date(end_time_str)
      const Days = parseInt(Math.abs(end_date - start_date) / 1000 / 60 / 60 / 24)
      for (let i = 0; i <= Days; i++) {
        const dd = new Date(start_time_str)
        dd.setDate(start_date.getDate() + i)
        const y = dd.getFullYear()
        const m = dd.getMonth() + 1
        const d = dd.getDate()
        if (m < 10 && d < 10) {
          res = res.concat(y + '_0' + m + '_0' + d)
        } else if (m < 10) {
          res = res.concat(y + '_0' + m + '_' + d)
        } else if (d < 10) {
          res = res.concat(y + '_' + m + '_0' + d)
        } else {
          res = res.concat(y + '_' + m + '_' + d)
        }
      }
      return res
    },
    /**
     * 获取某个时间区间的位置信息
     * @param start_time
     * @param end_time
     */
    getLocations: function(start_time, end_time) {
      this.rouboapis.getRespage01Info('location', start_time, end_time, {
        success: (res) => {
          this.chartDataMap.rows = res
          this.allList = res
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    /**
     * 获取某个时间段的统计数据
     * @param start_time
     * @param end_time
     */
    getCount: function(start_time, end_time) {
      this.rouboapis.getRespage01Info('count', start_time, end_time, {
        success: (res) => {
          this.chartDataChart.rows = res
          this.totalDays = res.length
        }
      })
    },
    getTodayCount: function() {
      const today = this.today('_')
      this.rouboapis.getRespage01Info('count', today, today, {
        success: (res) => {
          console.log(JSON.stringify(res))
          this.todayCount.all = res[0].count
        }
      })
    },
    getTodayStat: function() {
      const today = this.today('_')
      this.rouboapis.getRespage01Info('stat', today, today, {
        success: (res) => {
          this.todayCount.union = res.union.length
          this.unionList = res.union
          this.todayCount.new = res.new.length
          this.newList = res.new
          this.todayCount.gone = res.gone.length
          this.goneList = res.gone
        }
      })
    },

    /**
     * 点击复盘按钮事件
     */
    onPlay: function() {
      const dateList = this.getDateList('2018_09_13', this.today('_'))
      let index = 0
      this.playTextTitle = '正在回看...'
      const timer = setInterval(() => {
        this.getLocations(dateList[index], dateList[index])
        this.getCount('2018_09_13', dateList[index])
        index = index + 1
        if (index >= dateList.length) {
          this.playTextTitle = '可回看的天数'
          clearInterval(timer)
          return
        }
      }, 3000)
    },

    clickMe: function(who) {
      switch (who) {
        case 'new':
          this.chartDataMap.rows = this.newList
          break
        case 'gone':
          this.chartDataMap.rows = this.goneList
          break
        case 'union':
          this.chartDataMap.rows = this.unionList
          break
        case 'all':
          this.chartDataMap.rows = this.allList
          break
      }
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
