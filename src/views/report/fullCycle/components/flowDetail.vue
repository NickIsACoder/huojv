<template>
	<div class="report-index pb-20">
		<van-nav-bar
				style="position: fixed; top: 0; width: 100%;"
				:title="title"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>
    <div class="padding-nav">
      <div class="huojv-detail-list mt-10">
        <van-tabs v-if="tabList.length>0" v-model="tab" color="#209B5C" line-width="30px" :ellipsis="false" title-active-color="#209B5C" sticky @change="changeTab">
          <van-tab v-for="(item,index) in tabList" :title="item.certificateType" :disabled="item.disabled" :key="index" title-style="margin:0 5px">
            <div slot="title">
              <span v-eventlisten="{isChangePage:false,pageEvent:'点击全周期-'+item.nodeName}">{{item.certificateType}}</span>
            </div>
            <div class="fileBox" v-if="item.fileList&&item.fileList.length>0">
              <p class="fileItem" v-for="(f,i) in item.fileList" :key="f.documentGuid+i">
                <span class="img" :class="f.suffix.toLowerCase()"></span>
                <span class="txt" @click="preview(f.attachUrl, i , f.suffix.toLowerCase())">{{f.name}}</span>
              </p>
            </div>
            <div v-else class="tipBox">本阶段暂未收集到任何证照</div>
          </van-tab>
        </van-tabs>
        <div v-else class="tipBox">本阶段暂未收集到任何证照</div>
      </div>
    </div>

    <div class="pdfBox" v-show="pdfShow">
      <div v-if="isLoading" class="mask">
        <loading size="30px" vertical color="#fff"></loading>
      </div>
      <div class="close">
        <van-icon name="close" @click="pdfShow = false" @progress="progress" />
      </div>
      <pdf ref="pdf" :src="pdfUrl" :key="1"></pdf>
    </div>
    

    <van-image-preview v-model="prevshow" :images="images"></van-image-preview>
	</div>
</template>

<script>
    import scrollFixed from '@/mixin/scroll-fixed';
    import {PullRefresh, NavBar, Tab, Tabs, ImagePreview, Toast, Icon,Loading } from 'vant';
    import $ from 'jquery';
    import request from '@/utils/request';
    // import pdfNoPage from '@/views/report/fullCycle/components/pdfNoPage'
    import pdf from 'vue-pdf'

    export default {
        mixins: [scrollFixed],

        data() {
            return {
                orgId:'',
	              orgType:'',
                title:'',
                tab: 0,
                tabList: [],
                prevshow: false,
                images: [],
                pdfShow: false,
                pdfUrl: '',
                isLoading: false,
                result: ''
            };
        },
        mounted() {
          this.init();
        },
        watch: {
          '$store.state.orgId': function(newVal, oldVal) {
            this.init();
          }
        },
        methods: {
          init(){
            this.orgId = this.$route.query.orgId;
            this.orgType = this.$route.query.orgType;
            this.title = this.$route.query.name+'阶段证照';

            this.getCertificateList()
          },
          onClickLeft(){
            window.history.go(-1);
          },
          changeTab(idx){
            this.fileList = []
            if (!this.tabList[idx].fileList) {
              const type = this.tabList[idx].certificateType
              this.getCertificateDataListByNode(type)
            }
          },
          // 检测图片能否加载成功
          checkImgExists(imgurl) {
            return new Promise(function(resolve, reject) {
              var ImgObj = new Image();
              ImgObj.src = imgurl;
              ImgObj.onload = function(res) {
                resolve(res);
              }
              ImgObj.onerror = function(err) {
                reject(err)
              }
            })
          },
          // 获取证件类型列表
          getCertificateList() {
            request({
              url: '/app-api/allPeriod/getCertificateListByNode',
              method: 'get',
              params:{
                orgId: this.orgId,
                nodeName: this.$route.query.name,
              }
            }).then(({data}) => {
                if (data.code === 0) {
                  // data.data = [{}]
                  this.tabList = data.data ? data.data : []
                  if (this.tabList.length>0) {
                    const type = this.tabList[0].certificateType
                    this.getCertificateDataListByNode(type)
                  }
                }
            }).catch((e) => {
                console.log('getCertificateListByNode-err', e);
            });
          },
          // 获取附件列表
          getCertificateDataListByNode(type) {
            request({
              url: '/app-api/allPeriod/getCertificateDataListByNode',
              method: 'get',
              params:{
                orgId: this.orgId,
                nodeName: this.$route.query.name,
                certificateType: type
              }
            }).then(({data}) => {
              // data.data = [{"name":"测试pdf1格式.pdf","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=d0e37d76-b25d-411f-a38e-7d874b0b885c","suffix":"pdf","documentGuid":"d0e37d76-b25d-411f-a38e-7d874b0b885c"},{"name":"测试bmp1格式.bmp","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=df9c9727-e2a5-4946-b6a9-0ee60eac66a8","suffix":"bmp","documentGuid":"df9c9727-e2a5-4946-b6a9-0ee60eac66a8"},{"name":"测试doc1格式.doc","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=f19f2a39-33ae-4207-9c8b-79227b3908ac","suffix":"doc","documentGuid":"f19f2a39-33ae-4207-9c8b-79227b3908ac"},{"name":"测试docx1格式.docx","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=7c5ee3f4-f097-4a03-987a-c406c106deb8","suffix":"docx","documentGuid":"7c5ee3f4-f097-4a03-987a-c406c106deb8"},{"name":"测试jpg1格式.jpg","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=fde55f74-4e65-44cf-bcc9-073113b08a74","suffix":"jpg","documentGuid":"fde55f74-4e65-44cf-bcc9-073113b08a74"},{"name":"测试png1格式.png","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=8ad59291-ab64-4690-9291-be94818a68a0","suffix":"png","documentGuid":"8ad59291-ab64-4690-9291-be94818a68a0"},{"name":"测试ppt1格式.ppt","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=138b5be7-dbae-4c07-ac76-01efddb11119","suffix":"ppt","documentGuid":"138b5be7-dbae-4c07-ac76-01efddb11119"},{"name":"测试pptx1格式.pptx","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=b4d9aa88-fe05-4187-9e74-cbc2968ef3b6","suffix":"pptx","documentGuid":"b4d9aa88-fe05-4187-9e74-cbc2968ef3b6"},{"name":"测试rar1格式.rar","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=3a5e4ecf-2b09-451c-952d-5d8ea1ccf699","suffix":"rar","documentGuid":"3a5e4ecf-2b09-451c-952d-5d8ea1ccf699"},{"name":"测试tif1格式.tif","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=15cd8f8e-b152-4c7b-9a0a-a01e444a1942","suffix":"tif","documentGuid":"15cd8f8e-b152-4c7b-9a0a-a01e444a1942"},{"name":"测试xls1格式.xls","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=70f28b07-28e3-4174-9a3a-82071340b4cb","suffix":"xls","documentGuid":"70f28b07-28e3-4174-9a3a-82071340b4cb"},{"name":"测试xlsx1格式.xlsx","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=66a0761a-6984-4d7c-ab3f-b1e3b84e65a6","suffix":"xlsx","documentGuid":"66a0761a-6984-4d7c-ab3f-b1e3b84e65a6"},{"name":"1格式.zip","attachUrl":"https://pc.zthuang.com/doc/download?documentGuid=2868def7-5d90-40fe-b7a7-7dfaac106391","suffix":"zip","documentGuid":"2868def7-5d90-40fe-b7a7-7dfaac106391"}]
                if (data.code === 0) {
                  this.$set( this.tabList[this.tab], 'fileList', data.data )
                }
            }).catch((e) => {
                console.log('getCertificateDataListByNode-err', e);
            });
          },
          preview(src, idx, type){
            if (['bmp','jpg','jpeg','png','pdf'].indexOf(type)==-1) {
                Toast({
                  message: '该文件类型不支持在线预览，请移步PC端下载查看',
                  duration: 2000
                });

                return false
            }

            const u = navigator.userAgent;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isiOS&&type=='pdf') {
              Toast({
                  message: '该文件类型不支持在线预览，请移步PC端下载查看',
                  duration: 2000
                });

                return false
            }
            
             request({
              url: '/app-api/allPeriod/getAttachToken',
              method: 'get',
            }).then(({data}) => {
              let _url = src + data.data
              if (['bmp','jpg','jpeg','png'].indexOf(type)!=-1) {
                this.images = [_url]
                this.prevshow = true
              } else if(type=='pdf'){
                this.isLoading = true
                this.pdfShow = true
                
                let loadingTask = pdf.createLoadingTask(_url+'&.pdf')
                
                loadingTask.promise.then(pdf => {
                  this.isLoading = false
                  this.pdfUrl = loadingTask
                }).catch((err) => {
                  console.log(err)
                })
              }
                
            }).catch((e) => {
                console.log('getCertificateDataListByNode-err', e);
            });
          },
          progress(n){
           console.log(n)
          }
        },
        components: {
          [NavBar.name]: NavBar,
          [PullRefresh.name]: PullRefresh,
          [Tab.name]: Tab,
          [Tabs.name]: Tabs,
          [Icon.name]: Icon,
          [ImagePreview.Component.name]: ImagePreview.Component,
          // pdfNoPage,
          pdf,
          Loading
        }
    };
</script>


<style lang="scss" scoped>
.fileBox{
  padding: 20px 0;
}
.fileItem{
  font-size: 12px;
  color: #006E38;
  margin: 15px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .img{
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 10px;
    background: url('../../../../assets/images/link.png') no-repeat 100% 100%
    // background: url('/src/assets/images/link.png') no-repeat 100% 100%;
  }
  span.jpg,span.jpeg{
    background: url('../../../../assets/images/jpg.png') no-repeat 100% 100%;
  }
  span.png{
    background: url('../../../../assets/images/png.png') no-repeat 100% 100%;
  }
  span.bmp{
    background: url('../../../../assets/images/bmp.png') no-repeat 100% 100%;
  }
  span.pdf{
    background: url('../../../../assets/images/pdf.png') no-repeat 100% 100%;
  }
  .txt{
    text-decoration: underline;
    // border-bottom: 1px solid #006E38
  }
}
.pdfBox{
  position: absolute;
  top: 7%;
  width: 100%;
  left: 0;
  height: 100%;
  background: rgba(132, 132, 132, .8);
  z-index: 2;
}
.close{
  position: fixed;
  top: 10%;
  right: 7%;
  z-index: 999;
}
.van-loading {
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.tipBox{
  text-align: center;
  font-size: 14px;
  color: #9c9c9c;
  padding: 20px 0;
}
</style>
