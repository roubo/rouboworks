<template>
  <div>
    <div style="height: 100%">
      <button @click="onPlay">复盘</button>
      <ve-heatmap :data="chartDataMap" :settings="chartSettingsMap" height="600px"/>
    </div>
    <div>
      <ve-line :data="chartDataChart" :settings="chartSettingsChart"/>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    this.chartSettingsMap = {
      key: 'rL7OMKy4X4aeLCIbg0psT7fjO0z6biwi',
      bmap: {
        center: [119.65, 29.08],
        zoom: 14,
        roam: true,
        mapStyle: {
          style: 'midnight'
        }
      },
      type: 'bmap'
    }
    this.chartSettingsChart = {
      area: true
    }
    return {
      chartDataMap: {
        columns: ['lng', 'lat'],
        rows: []
      },
      chartDataChart: {
        columns: ['time', 'count'],
        rows: []
      }
    }
  },
  mounted() {
    // 获取当天的数据
    const today = this.today('_')
    this.getLocations(today, today)
    this.getCount('2018_09_13', today)
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
        }
      })
    },

    /**
     * 点击复盘按钮事件
     */
    onPlay: function() {
      const dateList = this.getDateList('2018_09_13', this.today('_'))
      let index = 0
      const timer = setInterval(() => {
        console.log(index)
        console.log(dateList.length)
        this.getLocations(dateList[index], dateList[index])
        this.getCount('2018_09_13', dateList[index])
        index = index + 1
        if (index >= dateList.length) {
          clearInterval(timer)
          return
        }
      }, 5000)
    }
    // }
  }
}
</script>

<style scoped>

</style>
