import { MypageIcon } from '@/assets/MypageIcon';
import Loading from '@/components/Loading/Loading';
import MyItem from '@/components/MyItem/MyItem';
import UserProfilePicture from '@/components/UserProfilePicture/UserProfilePicture';
import { deleteData, getData } from '@/hooks/useStorage';
import useAuthStore from '@/store/auth';
import MypageBodyTypeSlide from '@/swiper/MypageBodyTypeSlide';
import MypageSievingSlide from '@/swiper/MypageSievingSlide';
import MypageStyleSlide from '@/swiper/MypageStyleSlide';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import GuestSetting from '../GuestSetting';
import S from './Mypage.module.css';
import useUserStore from '@/store/bodyStyle';

const PB = import.meta.env.VITE_PB_URL;
const PB_FEED_ENDPOINT = `${PB}/api/collections/posts/records?expand=user`;

async function fetchProducts() {
  const response = await axios(PB_FEED_ENDPOINT);
  return await response.data;
}

function Mypage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const signOut = useAuthStore((store) => store.signOut);
  const checkLogIn = useAuthStore((store) => store.checkLogIn);
  const user = useAuthStore((store) => store.user);

  const updateUser = useUserStore((store) => store.updateUserStyle);

  const userBodyStyle = useUserStore((store) => store);
  const [authUserData, setAuthUserData] = useState(user);
  const [showPosts, setShowPosts] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  function toggleDarkModeHandler() {
    setIsDarkMode((prevMode) => !prevMode);
  }

  const {
    isLoading,
    data: postData,
    error,
  } = useQuery(['posts'], () => fetchProducts(), {
    retry: 2,
  });

  let dataItems = postData?.items;

  const storedUserSievingValue = getData('userSievingValue')?.replace(
    /\s/g,
    ''
  );
  const storedUserStyleValue = getData('userStyleValue');
  const storedBodyTypeValue = getData('userBodyTypeValue');

  const handleSaveClick = async () => {
    try {
      await updateUser(userId, authUserData);

      toast.success('정보가 수정되었습니다.');
      deleteData('userBodyTypeValue');
      deleteData('userSievingValue');
      deleteData('userStyleValue');
      navigate('/');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.clear();
      toast.success('로그아웃되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkLogIn();
  }, [checkLogIn]);

  useEffect(() => {
    setAuthUserData(user);
  }, [user]);

  useEffect(() => {
    if (storedUserSievingValue || storedUserStyleValue || storedBodyTypeValue) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [
    storedUserSievingValue,
    storedUserStyleValue,
    storedBodyTypeValue,
    userBodyStyle,
  ]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <div role="alert">
        <h2>{error.type}</h2>
        <p>{error.message}</p>
      </div>
    );

  if (!authUserData) return <GuestSetting />;

  return (
    <div className={S.mypageWrapper}>
      <div className="w-full flex flex-col items-center ">
        <div className="flex justify-center">
          {authUserData.avatar === '' ? (
            <span className="border border-gray500 rounded-full">
              <MypageIcon size={64} />
            </span>
          ) : (
            <UserProfilePicture avatar={authUserData} name={authUserData} />
          )}
        </div>
        <span>{authUserData.username ? authUserData.username : '닉네임'}</span>
        <Link
          to={`/useredit/${userId}`}
          className="w-[6.625rem] h-[2.875rem] flex justify-center items-center rounded-lg bg-primary mb-8"
        >
          프로필 수정
        </Link>
      </div>
      <div className="w-full h-[1.5rem] flex items-center mb-3 border-t-2 border-black">
        <button
          className={`w-1/2 flex justify-center ${
            showPosts ? 'bg-white' : 'bg-secondary text-white'
          }`}
          onClick={() => {
            setShowPosts(true);
            setShowSettings(false);
          }}
        >
          게시물 보기
        </button>

        <button
          className={`w-1/2 flex justify-center ${
            showSettings ? 'bg-white' : 'bg-secondary text-white'
          }`}
          onClick={() => {
            setShowSettings(true);
            setShowPosts(false);
          }}
        >
          설정 및 정보수정
        </button>
      </div>
      {showPosts && (
        <div className={S.mypageInfo}>
          {dataItems?.map((item) => (
            <MyItem key={item.id} item={item} />
          ))}
        </div>
      )}
      {showSettings && (
        <section className="flex flex-col p-8 overflow-y-scroll min-w-[320px]">
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-between">
              <span className="w-[5.25rem] h-[2.75rem] flex justify-center items-center rounded-3xl bg-black text-white mb-[1.6rem] font-bold">
                다크모드
              </span>
              <div className={`${S.toggleBtn} ${isDarkMode ? S.on : S.off}`}>
                <button
                  className={`${S.circle}`}
                  onClick={toggleDarkModeHandler}
                ></button>
              </div>
            </div>
            <div className={`${S.bodyTypeWrapper}`}>
              <MypageStyleSlide />
            </div>
            <div className={`${S.bodyTypeWrapper} gap-2`}>
              <span className={S.bodyType}>체질</span>
              <MypageSievingSlide />
            </div>
            <div className={`${S.bodyTypeWrapper} flex-nowrap gap-2`}>
              <span className={S.bodyType}>체형</span>
              <MypageBodyTypeSlide />
            </div>
            <button
              className={`w-[17.5rem] h-[3.375rem] flex justify-center items-center rounded-md ${
                isDisabled ? 'bg-gray-700 text-white' : 'bg-primary'
              }`}
              onClick={handleSaveClick}
              disabled={isDisabled}
            >
              저장하기
            </button>
          </div>
          <button
            type="button"
            className="underline text-gray750"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </section>
      )}
    </div>
  );
}

export default Mypage;
