<script setup>
import Button from "@/components/home/Button.vue";
import testImage from "@/assets/테스트.png";
import chartImage from "@/assets/차트.png";
import challengeImage from "@/assets/챌린지.png";
</script>

<template>
  <div>
    <div class="max-w-7.5xl mx-auto flex font-jamsil">
      <div class="text-left">
        <p class="text-7xl font-black text-transparent blue mt-10 mb-6">
          MZ 세대인 당신,
        </p>
        <span class="text-7xl text-customNavy mb-6"></span>
        <span class="text-7xl text-customNavy mb-6">&nbsp;&nbsp;&nbsp;지금 당신의 </span>
        <span class="text-7xl text-customNavy"><span class="text-transparent stroke">자산</span>은</span>
        <p class="text-7xl font-bold blue ml-48 mt-6 mb-40">안녕하신가요?</p>
      </div>
    </div>

    <div class="max-w-7.5xl mx-auto flex justify-between">
      <div class="flex space-x-36">
        <div class="max-w-7.5xl mx-auto space-x-12 flex font-jamsil">
          <Button :img-src="testImage" :router-to="{ name: 'testStart' }" text-above="소비 심리" text-below="테스트" />
          <Button :img-src="chartImage" :router-to="{ name: 'guestAnalysis' }" text-above="나의 소비" text-below="습관 분석" />
          <Button :img-src="challengeImage" :router-to="{ name: 'guestChallenge' }" text-above="돈과의 전쟁"
            text-below="챌린지의 서막" />
        </div>
        <div class='content center text-customNavy font-jamsil'>
          <div style="height: 60px;"></div>
          <h1 id='master'>
            <div id='master-container-scroller'>
              <div class='master-container-scroller_item text-end'>즐겁게</div>
              <div class='master-container-scroller_item text-end'>똑똑하게</div>
              <div class='master-container-scroller_item text-end'>현명하게</div>
              <div class='master-container-scroller_item text-end'>즐겁게</div>
              <div class='master-container-scroller_item text-end'>똑똑하게</div>
              <div class='master-container-scroller_item text-end'>현명하게</div>
              <div class='master-container-scroller_item text-end'>즐겁게</div>
              <div class='master-container-scroller_item text-end'>똑똑하게</div>
              <div class='master-container-scroller_item text-end'>현명하게</div>
              <div class='master-container-scroller_item text-end'>즐겁게</div>
            </div>
            <div class="mt-4">나를 들여다 보는 방법</div>
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#master {
  font-size: 60px;
  line-height: 1;
  font-weight: bold;
  letter-spacing: 0;
  -webkit-font-smoothing: inherit
}

#master {
  text-rendering: optimizeLegibility
}

#master-container {
  -webkit-animation: master-container-bg 15s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
  animation: master-container-bg 15s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  height: 100vmin;
  min-height: 0;
  max-height: 100%;
}

#master-container .content {
  height: auto;
  margin-left: inherit;
  margin-right: inherit
}

#master-container-scroller {
  height: 60px;
  margin-bottom: -6px;
  overflow: hidden;
  position: relative
}

#master-container-scroller .master-container-scroller_item {
  display: block;
  padding-bottom: 6px;
  -webkit-animation: scroll 15s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
  animation: scroll 15s cubic-bezier(0.645, 0.045, 0.355, 1) infinite
}

#master-container-scroller .master-container-scroller_item[href]:hover {
  text-decoration: underline
}

#master-container-grid .master-container-grid_item .img {
  position: relative
}

#master-container-grid .master-container-grid_item .grid_item-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  opacity: 0;
  transition: opacity .3s ease-in-out;
  text-decoration: none
}

#master-container-grid .master-container-grid_item .grid_item-overlay:hover {
  opacity: 1
}

#master-container-grid .master-container-grid_item .grid_item-overlay .link {
  display: inline-block;
  box-shadow: 0 1px 0 0 #fff, inset 0 0 0 #fff;
  transition: box-shadow .2s ease
}

#master-container-grid .master-container-grid_item .grid_item-overlay .link:hover {
  box-shadow: 0 2px 0 0 #fff, inset 0 -1px 0 0 #fff
}

@-webkit-keyframes scroll {
  0.0% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px)
  }

  3.7037037037037037% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px)
  }

  11.11111111111111% {
    -webkit-transform: translateY(-66px);
    transform: translateY(-66px)
  }

  14.814814814814815% {
    -webkit-transform: translateY(-66px);
    transform: translateY(-66px)
  }

  22.22222222222222% {
    -webkit-transform: translateY(-132px);
    transform: translateY(-132px)
  }

  25.925925925925927% {
    -webkit-transform: translateY(-132px);
    transform: translateY(-132px)
  }

  33.333333333333336% {
    -webkit-transform: translateY(-198px);
    transform: translateY(-198px)
  }

  37.03703703703704% {
    -webkit-transform: translateY(-198px);
    transform: translateY(-198px)
  }

  44.44444444444444% {
    -webkit-transform: translateY(-264px);
    transform: translateY(-264px)
  }

  48.148148148148145% {
    -webkit-transform: translateY(-264px);
    transform: translateY(-264px)
  }

  55.55555555555556% {
    -webkit-transform: translateY(-330px);
    transform: translateY(-330px)
  }

  59.25925925925926% {
    -webkit-transform: translateY(-330px);
    transform: translateY(-330px)
  }

  66.66666666666667% {
    -webkit-transform: translateY(-396px);
    transform: translateY(-396px)
  }

  70.37037037037037% {
    -webkit-transform: translateY(-396px);
    transform: translateY(-396px)
  }

  77.77777777777777% {
    -webkit-transform: translateY(-462px);
    transform: translateY(-462px)
  }

  81.48148148148148% {
    -webkit-transform: translateY(-462px);
    transform: translateY(-462px)
  }

  88.88888888888889% {
    -webkit-transform: translateY(-528px);
    transform: translateY(-528px)
  }

  92.5925925925926% {
    -webkit-transform: translateY(-528px);
    transform: translateY(-528px)
  }

  100.0% {
    -webkit-transform: translateY(-594px);
    transform: translateY(-594px)
  }
}

@keyframes scroll {
  0.0% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px)
  }

  3.7037037037037037% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px)
  }

  11.11111111111111% {
    -webkit-transform: translateY(-66px);
    transform: translateY(-66px)
  }

  14.814814814814815% {
    -webkit-transform: translateY(-66px);
    transform: translateY(-66px)
  }

  22.22222222222222% {
    -webkit-transform: translateY(-132px);
    transform: translateY(-132px)
  }

  25.925925925925927% {
    -webkit-transform: translateY(-132px);
    transform: translateY(-132px)
  }

  33.333333333333336% {
    -webkit-transform: translateY(-198px);
    transform: translateY(-198px)
  }

  37.03703703703704% {
    -webkit-transform: translateY(-198px);
    transform: translateY(-198px)
  }

  44.44444444444444% {
    -webkit-transform: translateY(-264px);
    transform: translateY(-264px)
  }

  48.148148148148145% {
    -webkit-transform: translateY(-264px);
    transform: translateY(-264px)
  }

  55.55555555555556% {
    -webkit-transform: translateY(-330px);
    transform: translateY(-330px)
  }

  59.25925925925926% {
    -webkit-transform: translateY(-330px);
    transform: translateY(-330px)
  }

  66.66666666666667% {
    -webkit-transform: translateY(-396px);
    transform: translateY(-396px)
  }

  70.37037037037037% {
    -webkit-transform: translateY(-396px);
    transform: translateY(-396px)
  }

  77.77777777777777% {
    -webkit-transform: translateY(-462px);
    transform: translateY(-462px)
  }

  81.48148148148148% {
    -webkit-transform: translateY(-462px);
    transform: translateY(-462px)
  }

  88.88888888888889% {
    -webkit-transform: translateY(-528px);
    transform: translateY(-528px)
  }

  92.5925925925926% {
    -webkit-transform: translateY(-528px);
    transform: translateY(-528px)
  }

  100.0% {
    -webkit-transform: translateY(-594px);
    transform: translateY(-594px)
  }
}

@-webkit-keyframes scroll-mobile {
  0.0% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px)
  }

  3.7037037037037037% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px)
  }

  11.11111111111111% {
    -webkit-transform: translateY(-48px);
    transform: translateY(-48px)
  }

  14.814814814814815% {
    -webkit-transform: translateY(-48px);
    transform: translateY(-48px)
  }

  22.22222222222222% {
    -webkit-transform: translateY(-96px);
    transform: translateY(-96px)
  }

  25.925925925925927% {
    -webkit-transform: translateY(-96px);
    transform: translateY(-96px)
  }

  33.333333333333336% {
    -webkit-transform: translateY(-144px);
    transform: translateY(-144px)
  }

  37.03703703703704% {
    -webkit-transform: translateY(-144px);
    transform: translateY(-144px)
  }

  44.44444444444444% {
    -webkit-transform: translateY(-192px);
    transform: translateY(-192px)
  }

  48.148148148148145% {
    -webkit-transform: translateY(-192px);
    transform: translateY(-192px)
  }

  55.55555555555556% {
    -webkit-transform: translateY(-240px);
    transform: translateY(-240px)
  }

  59.25925925925926% {
    -webkit-transform: translateY(-240px);
    transform: translateY(-240px)
  }

  66.66666666666667% {
    -webkit-transform: translateY(-288px);
    transform: translateY(-288px)
  }

  70.37037037037037% {
    -webkit-transform: translateY(-288px);
    transform: translateY(-288px)
  }

  77.77777777777777% {
    -webkit-transform: translateY(-336px);
    transform: translateY(-336px)
  }

  81.48148148148148% {
    -webkit-transform: translateY(-336px);
    transform: translateY(-336px)
  }

  88.88888888888889% {
    -webkit-transform: translateY(-384px);
    transform: translateY(-384px)
  }

  92.5925925925926% {
    -webkit-transform: translateY(-384px);
    transform: translateY(-384px)
  }

  100.0% {
    -webkit-transform: translateY(-432px);
    transform: translateY(-432px)
  }
}

@keyframes scroll-mobile {
  0.0% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px)
  }

  3.7037037037037037% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px)
  }

  11.11111111111111% {
    -webkit-transform: translateY(-48px);
    transform: translateY(-48px)
  }

  14.814814814814815% {
    -webkit-transform: translateY(-48px);
    transform: translateY(-48px)
  }

  22.22222222222222% {
    -webkit-transform: translateY(-96px);
    transform: translateY(-96px)
  }

  25.925925925925927% {
    -webkit-transform: translateY(-96px);
    transform: translateY(-96px)
  }

  33.333333333333336% {
    -webkit-transform: translateY(-144px);
    transform: translateY(-144px)
  }

  37.03703703703704% {
    -webkit-transform: translateY(-144px);
    transform: translateY(-144px)
  }

  44.44444444444444% {
    -webkit-transform: translateY(-192px);
    transform: translateY(-192px)
  }

  48.148148148148145% {
    -webkit-transform: translateY(-192px);
    transform: translateY(-192px)
  }

  55.55555555555556% {
    -webkit-transform: translateY(-240px);
    transform: translateY(-240px)
  }

  59.25925925925926% {
    -webkit-transform: translateY(-240px);
    transform: translateY(-240px)
  }

  66.66666666666667% {
    -webkit-transform: translateY(-288px);
    transform: translateY(-288px)
  }

  70.37037037037037% {
    -webkit-transform: translateY(-288px);
    transform: translateY(-288px)
  }

  77.77777777777777% {
    -webkit-transform: translateY(-336px);
    transform: translateY(-336px)
  }

  81.48148148148148% {
    -webkit-transform: translateY(-336px);
    transform: translateY(-336px)
  }

  88.88888888888889% {
    -webkit-transform: translateY(-384px);
    transform: translateY(-384px)
  }

  92.5925925925926% {
    -webkit-transform: translateY(-384px);
    transform: translateY(-384px)
  }

  100.0% {
    -webkit-transform: translateY(-432px);
    transform: translateY(-432px)
  }
}
</style>
