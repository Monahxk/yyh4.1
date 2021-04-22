<template>
  <div class="wrapper">
  </div>
</template>

<script>
import { getTrendPatient, getTrendReturned, getTrendCharge } from '@/api'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data() {
    return {
      mStartTime: moment().startOf("month").format("YYYY-MM"), //  moment().startOf("month").format("YYYY-MM-DD")
      mEndTime: moment().startOf("month").format("YYYY-MM"),
      params: {
        queryFlag: 0,
        startTime: '2019-04-01',
        endTime: '2019-06-22'
        // startTime: moment()
        //   .startOf("month")
        //   .format("YYYY-MM-DD"),
        // endTime: moment().format("YYYY-MM-DD")
      },
      timeValue: ['2019-04-01', '2019-06-22'],
      chartSettings: {
        labelLine: {
          show: true
        },
        label: {
          show: true
        },
        area:true,
        lineStyle: {
          width: 5 //这里是为了突出显示加上的
        }
      },
      chartData: {
        columns: ["dateTime", "count"],
        rows: []
      }
    };
  },
  watch: {
    'params.queryFlag': {
      handler(val) {
        
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    handleTime() {},
    searchData() {
      if (!Number(this.params.queryFlag)) {   // 日
        let [start, end] = this.timeValue;
        this.params.startTime = start;
        this.params.endTime = end;
      } else {                               // 月
        if (moment(this.mEndTime).isBefore(this.mStartTime)) {
          this.$message.error('开始月份不应大于结束月份');
          return
        }
        this.params.startTime = this.mStartTime;
        this.params.endTime = this.mEndTime;
      }
      // switch(this.) {

      // }
      // this._initPatientData()
    },
    _initPatientData() {
      getTrendPatient( this.params ).then(res => {
        console.log( res )
        this.chartData.rows = res.data.data
      })
    }
  },
  mixins: [],
  mounted() {
    console.log(  )
    this._initPatientData()
  }
};
</script>
<style lang="less" scoped>
</style>
