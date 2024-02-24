import { setData } from '@/hooks/useStorage';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './swiper-bundle.css';
import useUserStore from '@/store/bodyStyle';

function MypageSievingSlide() {
  const setSieving = useUserStore((store) => store.setSieving);
  const handleSievingClick = async (value) => {
    setData('userSievingValue', value);
    setSieving(value);
  };

  return (
    <Swiper
      modules={[A11y]}
      spaceBetween={10}
      slidesPerView={2}
      mousewheelcontrol="true"
    >
      <div className="flex items-center w-[90%] mx-auto">
        <div className="flex flex-col justify-center w-[90%] mx-auto">
          <div className="swiper-container flex w-full whitespace-no-wrap overflow-hidden">
            <div className="swiper-wrapper">
              <SwiperSlide className="swiper-custom-slide-holder keyword flex justify-center items-center px-3 py-1.5 w-[7.625rem] rounded-3xl bg-white border border-solid border-black">
                <button
                  type="button"
                  className="text-sm leading-base"
                  onClick={() => handleSievingClick('더위 많이 탐')}
                >
                  더위 많이 탐
                </button>
              </SwiperSlide>
              <SwiperSlide className="swiper-custom-slide-holder keyword flex justify-center items-center px-3 py-1.5 w-[7.625rem] rounded-3xl bg-white border border-solid border-black">
                <button
                  type="button"
                  className="text-sm leading-base"
                  onClick={() => handleSievingClick('추위 많이 탐')}
                >
                  추위 많이 탐
                </button>
              </SwiperSlide>
            </div>
          </div>
        </div>
      </div>
    </Swiper>
  );
}

export default MypageSievingSlide;
