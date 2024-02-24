import { getData, setData } from '@/hooks/useStorage';
import useUserStore from '@/store/bodyStyle';
import 'swiper/css';
import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './swiper-bundle.css';

function MypageStyleSlide() {
  const setStyle = useUserStore((store) => store.setStyle);

  const handleStyleClick = (value) => {
    const storedUserStyleValue = getData('userStyleValue');

    const parsedStoredUserStyleValue = storedUserStyleValue
      ? new Set(storedUserStyleValue)
      : new Set();

    if (!parsedStoredUserStyleValue.has(value)) {
      parsedStoredUserStyleValue.add(value);

      setData('userStyleValue', Array.from(parsedStoredUserStyleValue));
    }
    setStyle(Array.from(parsedStoredUserStyleValue));
  };

  const styles = [
    { label: '힙합 스타일', value: 'hip' },
    { label: '러블리 스타일', value: 'lovely' },
    { label: '빈티지 스타일', value: 'vintage' },
    { label: '캐주얼 스타일', value: 'casual' },
    { label: '클래식 스타일', value: 'classic' },
    { label: '펑크 스타일', value: 'funk' },
    { label: '프레피 스타일', value: 'preppy' },
    { label: '아메카지 스타일', value: 'amekaji' },
    { label: '도시남자 스타일', value: 'cityboy' },
    { label: '애슬레저 스타일', value: 'athleisure' },
  ];

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
      className="w-full"
    >
      <div className="flex items-center w-[90%] mx-auto">
        <div className="flex flex-col justify-center w-[90%] mx-auto">
          <div className="swiper-container flex w-full whitespace-no-wrap overflow-hidden">
            <div className="swiper-wrapper">
              {styles.map((style) => (
                <SwiperSlide
                  className="swiper-custom-slide keyword flex justify-center items-center px-3 py-1.5 rounded-3xl bg-white border border-solid border-black "
                  key={style.value}
                >
                  <button
                    type="button"
                    className="text-sm leading-base"
                    onClick={() => handleStyleClick(style.value)}
                    aria-label={style.label}
                  >
                    <span aria-hidden="true">{style.value}</span>
                  </button>
                </SwiperSlide>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Swiper>
  );
}

export default MypageStyleSlide;
