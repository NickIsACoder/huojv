<template>
  <div class="building-page">
    <img src="../../assets/images/bg-jianshe@2x.png">
    <div class="building-text">正在建设中...</div>
  </div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import tabbar from '@/components/Tabbar/index'


export default {
  mixins: [scrollFixed],

  data() {
    return {
      isLoading: false
    };
  },

  created() {

  },

  methods: {},

  components: {
    tabbar
  }
};
</script>


<style lang="scss" scoped>
.building-page{
  text-align: center;
  padding-top: 150px;

  & > img{
    width: 134px;
    height: 134px;
  }

  .building-text{
    font-size: 14px;
    color: #999999;
    margin-top: 30px;
  }
}
</style>
