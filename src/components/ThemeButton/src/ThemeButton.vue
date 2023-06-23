<template>
  <div class="theme-button">
    <div class="components" ref="components">
      <!-- 组件所有元素 -->
      <div class="main-button" ref="mainButton">
        <!-- 按钮主体(圆) -->
        <div class="moon" :ref="setmoon"></div>
        <div class="moon" :ref="setmoon"></div>
        <div class="moon" :ref="setmoon"></div>
        <!-- 月亮上的陨石坑 -->
      </div>
      <div class="daytime-backgrond" :ref="setdaytimeBackgrond"></div>
      <div class="daytime-backgrond" :ref="setdaytimeBackgrond"></div>
      <div class="daytime-backgrond" :ref="setdaytimeBackgrond"></div>
      <!-- 按钮底层的三个虚影 -->
      <div class="cloud" ref="cloud">
        <!-- 所有的云 -->
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
      </div>
      <div class="cloud-light" ref="cloudLight">
        <!-- 云的虚影 -->
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
        <div class="cloud-son"></div>
      </div>
      <div class="stars" ref="stars">
        <!-- 所有星星，每一个星星由四个div拼合而成 -->
        <div class="star big">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star big">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star medium">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star medium">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star medium">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star small">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star small">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star small">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star small">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star small">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
        <div class="star small">
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
          <div class="star-son"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const mainButton = ref();
// var mainButton.value = document.querySelector(".main-button"); //获取按钮主体
const daytimeBackgrond = ref<any>([]);
// var daytimeBackgrond = document.getElementsByClassName("daytime-backgrond"); //获取按钮背后的虚影
const cloud = ref();
// var cloud = document.querySelector(".cloud"); //获取云层
const cloudLight = ref();
// var cloudLight = document.querySelector(".cloud-light"); //获取云层虚影
const components = ref();
// var components = document.querySelector(".components"); //获取最外层元素
const moon = ref<any>([]);
// var moon = document.getElementsByClassName("moon"); //获取陨石坑
const stars = ref();
// var stars = document.querySelector(".stars"); //获取所有星星
let isMoved = false; //按钮状态，判断是否白天黑夜,默认为白天

const setdaytimeBackgrond = (el: any) => {
  daytimeBackgrond.value.push(el);
};

const setmoon = (el: any) => {
  moon.value.push(el);
};

window.onload = function () {
  mainButton.value.addEventListener("click", function () {
    if (isMoved) {
      //白天按钮样式
      mainButton.value.style.transform = "translateX(0)"; //水平平移距离为0px
      mainButton.value.style.backgroundColor = "rgba(255, 195, 35,1)"; //按钮主体的背景颜色变为黄色(太阳)
      // 盒子阴影
      mainButton.value.style.boxShadow =
        "3px 3px 5px rgba(0, 0, 0, 0.5), inset  -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset  4px 5px 2px -2px rgba(255, 230, 80,1)";
      //云朵上升-云朵显示
      daytimeBackgrond.value[0].style.transform = "translateX(0)";
      daytimeBackgrond.value[1].style.transform = "translateX(0)";
      daytimeBackgrond.value[2].style.transform = "translateX(0)";
      cloud.value.style.transform = "translateY(10px)";
      cloudLight.value.style.transform = "translateY(10px)";
      components.value.style.backgroundColor = "rgba(70, 133, 192,1)";
      //月亮陨石坑完全透明-隐藏
      moon.value[0].style.opacity = "0";
      moon.value[1].style.opacity = "0";
      moon.value[2].style.opacity = "0";
      //星星上升-星星隐藏
      stars.value.style.transform = "translateY(-125px)";
      stars.value.style.opacity = "0";
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      //黑夜按钮样式
      mainButton.value.style.transform = "translateX(110px)"; //水平平移距离为110px
      mainButton.value.style.backgroundColor = "rgba(195, 200,210,1)"; //按钮主体的背景颜色变为黄色(月亮)
      // 盒子阴影
      mainButton.value.style.boxShadow =
        "3px 3px 5px rgba(0, 0, 0, 0.5), inset  -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset  4px 5px 2px -2px rgba(255, 255, 210,1)";
      //云朵下降-云朵隐藏
      daytimeBackgrond.value[0].style.transform = "translateX(110px)";
      daytimeBackgrond.value[1].style.transform = "translateX(80px)";
      daytimeBackgrond.value[2].style.transform = "translateX(50px)";
      cloud.value.style.transform = "translateY(80px)";
      cloudLight.value.style.transform = "translateY(80px)";
      components.value.style.backgroundColor = "rgba(25,30,50,1)";
      //月亮陨石坑完全不透明-显示
      moon.value[0].style.opacity = "1";
      moon.value[1].style.opacity = "1";
      moon.value[2].style.opacity = "1";
      //星星下降-星星显示
      stars.value.style.transform = "translateY(-62.5px)";
      stars.value.style.opacity = "1";
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }

    isMoved = !isMoved;
  });
};
</script>

<style scoped>
/* 最外层元素样式 */
.components {
  transform: scale(0.5);
  margin-left: -110px;
  margin-top: -20px; /* 按钮在页面中居中 */
  width: 180px;
  height: 70px;
  background-color: rgba(70, 133, 192, 1); /* 按钮背景颜色 */
  border-radius: 100px;
  box-shadow: inset 0 0 5px 3px rgba(0, 0, 0, 0.5); /* 按钮的内阴影,实现立体感 */
  overflow: hidden;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(
    0,
    0.5,
    1.3,
    1
  ); /* 过渡时间贝塞尔曲线,实现非线性动画 */
}

/* 主要按钮样式 */
.main-button {
  margin: 7.5px 0 0 7.5px;
  width: 55px;
  height: 55px;
  background-color: rgba(255, 195, 35, 1);
  border-radius: 50%;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5),
    inset -3px -5px 3px -3px rgba(0, 0, 0, 0.5),
    inset 4px 5px 2px -2px rgba(255, 230, 80, 1);
  cursor: pointer;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(0, 0.5, 1.3, 1);
}

/* 陨石坑样式 */
.moon {
  box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  transition: 0.5s;
  opacity: 0;
  transition-timing-function: cubic-bezier(0, 0.5, 1.3, 1);
}

/* 第一个陨石坑 */
.moon:nth-child(1) {
  position: absolute;
  top: 7.5px;
  left: 25px;
  width: 12.5px;
  height: 12.5px;
  background-color: rgba(150, 160, 180, 1);
}

/* 第二个陨石坑 */
.moon:nth-child(2) {
  position: absolute;
  top: 20px;
  left: 7.5px;
  width: 20px;
  height: 20px;
  background-color: rgba(150, 160, 180, 1);
}

/* 第三个陨石坑 */
.moon:nth-child(3) {
  position: absolute;
  top: 32.5px;
  left: 32.5px;
  width: 12.5px;
  height: 12.5px;
  background-color: rgba(150, 160, 180, 1);
}

/* 按钮背后的第一个虚影 */
.daytime-backgrond:nth-child(2) {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 110px;
  height: 110px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  z-index: -2;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(0, 0.5, 1.3, 1);
}

/* 按钮背后的第二个虚影 */
.daytime-backgrond:nth-child(3) {
  position: absolute;
  top: -35px;
  left: -15px;
  width: 135px;
  height: 135px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: -3;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(0, 0.5, 1.3, 1);
}

/* 按钮背后的第三个虚影 */
.daytime-backgrond:nth-child(4) {
  position: absolute;
  top: -45px;
  left: -15px;
  width: 160px;
  height: 160px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  z-index: -4;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(0, 0.5, 1.3, 1);
}

/* 云和云层虚影的动画过渡时间和非线性动画 */
.cloud,
.cloud-light {
  transition: 0.7s;
  transition-timing-function: cubic-bezier(0, 0.5, 1.3, 1);
}

/* 云和虚影由6个圆形组成，第1个圆形和第7个圆形大小相同 */
.cloud-son:nth-child(1),
.cloud-son:nth-child(7) {
  position: absolute;
  right: -20px;
  bottom: 10px;
  width: 50px;
  height: 50px;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
}

/* 云和虚影由6个圆形组成，第2个圆形和第8个圆形大小相同 */
.cloud-son:nth-child(2),
.cloud-son:nth-child(8) {
  position: absolute;
  right: -10px;
  bottom: -25px;
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
}

/* 云和虚影由6个圆形组成，第3个圆形和第9个圆形大小相同 */
.cloud-son:nth-child(3),
.cloud-son:nth-child(9) {
  position: absolute;
  right: 20px;
  bottom: -40px;
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
}

/* 云和虚影由6个圆形组成，第4个圆形和第10个圆形大小相同 */
.cloud-son:nth-child(4),
.cloud-son:nth-child(10) {
  position: absolute;
  right: 50px;
  bottom: -35px;
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
}

/* 云和虚影由6个圆形组成，第5个圆形和第11个圆形大小相同 */
.cloud-son:nth-child(5),
.cloud-son:nth-child(11) {
  position: absolute;
  right: 75px;
  bottom: -60px;
  width: 75px;
  height: 75px;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
}

/* 云和虚影由6个圆形组成，第6个圆形和第12个圆形大小相同 */
.cloud-son:nth-child(6),
.cloud-son:nth-child(12) {
  position: absolute;
  right: 110px;
  bottom: -50px;
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
}

/* 云层在-2层 */
.cloud {
  z-index: -2;
}

/* 云层虚影在云层下方,并且整体上移,逆时针旋转5度 */
.cloud-light {
  position: absolute;
  right: 0px;
  bottom: 25px;
  opacity: 0.5;
  z-index: -3;
  transform: rotate(-5deg);
}

/* 所有星星样式 */
.stars {
  transform: translateY(-125px);
  z-index: -2;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(0, 0.5, 1.3, 1);
}

/* 星星绝对定位 */
.star {
  position: absolute;
}

/* 大星星的宽高 */
.big {
  width: 15px;
  height: 15px;
}

/* 中星星的宽高 */
.medium {
  width: 10px;
  height: 10px;
}

/* 小星星的宽高 */
.small {
  width: 6px;
  height: 6px;
}

/* 所有星星的位置 */
.star:nth-child(1) {
  top: 10px;
  left: 40px;
}

.star:nth-child(2) {
  top: 20px;
  left: 95px;
}

.star:nth-child(3) {
  top: 20px;
  left: 20px;
}

.star:nth-child(4) {
  top: 35px;
  left: 50px;
}

.star:nth-child(5) {
  top: 50px;
  left: 80px;
}

.star:nth-child(6) {
  top: 50px;
  left: 20px;
}

.star:nth-child(7) {
  top: 40px;
  left: 27.5px;
}

.star:nth-child(8) {
  top: 55px;
  left: 45px;
}

.star:nth-child(9) {
  top: 20px;
  left: 75px;
}

.star:nth-child(10) {
  top: 32.5px;
  left: 67.5px;
}

.star:nth-child(11) {
  top: 40px;
  left: 95px;
}

/* 每一个星星由四个div向左浮动,拼合而成 */
.star-son {
  float: left;
}

/* 大星星 */
.big .star-son:nth-child(1) {
  width: 7.5px;
  height: 7.5px;
  background-image: radial-gradient(
    circle 7.5px at left 0,
    transparent 7.5px,
    #fff
  );
}

.big .star-son:nth-child(2) {
  width: 7.5px;
  height: 7.5px;
  background-image: radial-gradient(
    circle 7.5px at right 0,
    transparent 7.5px,
    #fff
  );
}

.big .star-son:nth-child(3) {
  width: 7.5px;
  height: 7.5px;
  background-image: radial-gradient(
    circle 7.5px at 0 bottom,
    transparent 7.5px,
    #fff
  );
}

.big .star-son:nth-child(4) {
  width: 7.5px;
  height: 7.5px;
  background-image: radial-gradient(
    circle 7.5px at right bottom,
    transparent 7.5px,
    #fff
  );
}

/* 中星星 */
.medium .star-son:nth-child(1) {
  width: 5px;
  height: 5px;
  background-image: radial-gradient(
    circle 5px at left 0,
    transparent 5px,
    #fff
  );
}

.medium .star-son:nth-child(2) {
  width: 5px;
  height: 5px;
  background-image: radial-gradient(
    circle 5px at right 0,
    transparent 5px,
    #fff
  );
}

.medium .star-son:nth-child(3) {
  width: 5px;
  height: 5px;
  background-image: radial-gradient(
    circle 5px at 0 bottom,
    transparent 5px,
    #fff
  );
}

.medium .star-son:nth-child(4) {
  width: 5px;
  height: 5px;
  background-image: radial-gradient(
    circle 5px at right bottom,
    transparent 5px,
    #fff
  );
}

/* 小星星 */
.small .star-son:nth-child(1) {
  width: 3px;
  height: 3px;
  background-image: radial-gradient(
    circle 3px at left 0,
    transparent 3px,
    #fff
  );
}

.small .star-son:nth-child(2) {
  width: 3px;
  height: 3px;
  background-image: radial-gradient(
    circle 3px at right 0,
    transparent 3px,
    #fff
  );
}

.small .star-son:nth-child(3) {
  width: 3px;
  height: 3px;
  background-image: radial-gradient(
    circle 3px at 0 bottom,
    transparent 3px,
    #fff
  );
}

.small .star-son:nth-child(4) {
  width: 3px;
  height: 3px;
  background-image: radial-gradient(
    circle 3px at right bottom,
    transparent 3px,
    #fff
  );
}
</style>
