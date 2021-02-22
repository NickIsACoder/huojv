// 滚动条记录， 适用于 keep-alive 组件
var _ = require('lodash');
export default {
  data() {
    return {
    };
  },

  mounted() {
  },
  methods:{
    // val 一级值
    // unit 单位
    // prop 二级值
    filterValInMinix(val, unit, prop){
      let _result = '',
          _unit = unit?'<span>'+unit+'</span>': ''
      if (_.isNull(val)||_.isUndefined(val)) {
        _result = '-'
      } else {
        _result = (prop ? val[prop] : val)+_unit
      }
      return _result
    },
  },
  activated() {
  }
};
