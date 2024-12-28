<script setup>
import Account from '@/components/home/Account.vue';
import Challenge from '@/components/home/Challenge.vue';
import SBTIResult from './SBTIResult.vue';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';


const swiperBreakpoints = {
  1024: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
};

</script>

<template>
  <div class="w-full">
    <div class="max-w-7.5xl mx-auto flex font-jamsil">
      <div class="text-left">
        <p class="text-7xl font-black text-transparent blue mt-10 mb-6">
          MZ 세대인 당신,
        </p>
        <span class="text-7xl text-customNavy mb-6"></span>
        <span class="text-7xl text-customNavy mb-6">&nbsp;&nbsp;&nbsp;지금 당신의 </span>
        <span class="text-7xl text-customNavy"><span class="text-transparent stroke">자산</span>은</span>
        <p class="text-7xl font-bold blue ml-48 mt-6 pb-12">안녕하신가요?</p>
      </div>
    </div>

    <Swiper class="font-pretendard-regular slider w-3/4 lg:w-2/3" :spaceBetween="50" :slidesPerView="1" :breakpoints="swiperBreakpoints" :modules="[Navigation, Autoplay]"
      navigation loop :autoplay="{ delay: 6000 }">
      <SwiperSlide>
        <div class="h-full bg-white flex items-center">
          <SBTIResult />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="h-full bg-white flex items-center">
          <Challenge />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="h-full bg-white flex items-center">
          <Account />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style setup>
.slider {
  height: 500px;
}
.swiper-button-prev,
.swiper-button-next {
  color: rgb(209, 209, 209);
  font-weight: 200;
}
</style>
