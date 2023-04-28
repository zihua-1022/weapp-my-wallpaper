// components/customSwiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrls: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    swiperChange(e) {
      this.setData({
        currentIndex: e.detail.current,
      });
    },
  },
});

<swiper indicator-dots="false" 
        autoplay="{{true}}" 
        interval="5000" 
        indicator-dots="{{false}}" 
        indicator-color='#8a8a8a' 
        indicator-active-color='#333' 
        circular="true" 
        class="swiper-block" 
        bindchange="swiperChange" 
        previous-margin="100rpx" 
        next-margin="100rpx" 
        current="{{0}}">
  <block wx:for="{{imgUrls}}" wx:index="{{index}}" wx:key="index">
    <swiper-item class="swiper-item ">
      <image mode="aspectFill" src="{{item}}" class="slide-image {{currentIndex == index ? 'active' : 'common'}}" />
    </swiper-item>
  </block>
</swiper>




{
    "component": true,
    "usingComponents": {}
  }
  