import { setData } from '@/hooks/useStorage';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './swiper-bundle.css';
import useUserStore from '@/store/bodyStyle';

function MypageSievingSlide() {
  const setBodyType = useUserStore((store) => store.setBodyType);

  const handleBodyTypeClick = async (value) => {
    setData('userBodyTypeValue', value);
    setBodyType(value);
  };

  return (
    <Swiper
      modules={[Navigation, A11y]}
      spaceBetween={10}
      slidesPerView={3}
      navigation={{
        nextEI: '.swiper-button-next',
        prevEI: '.swiper-button-prev',
        clickable: true,
      }}
      mousewheelcontrol="true"
    >
      <div className="flex items-center w-[90%] mx-auto">
        <div className="flex flex-col justify-center w-[90%] mx-auto">
          <div className="swiper-container flex w-full whitespace-no-wrap overflow-hidden">
            <div className="swiper-wrapper">
              <SwiperSlide className="swiper-custom-slide keyword flex justify-center items-center px-3 py-1.5 rounded-3xl bg-white border border-solid border-black">
                <button
                  type="button"
                  className="text-sm leading-base"
                  onClick={() => handleBodyTypeClick('하체발달')}
                >
                  하체발달
                </button>
              </SwiperSlide>
              <SwiperSlide className="swiper-custom-slide-holder keyword flex justify-center items-center px-3 py-1.5 w-[7.625rem] rounded-3xl bg-white border border-solid border-black">
                <button
                  type="button"
                  className="text-sm leading-base"
                  onClick={() => handleBodyTypeClick('상체발달')}
                >
                  상체발달
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
