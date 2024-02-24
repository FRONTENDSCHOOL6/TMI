import { HomeIcon } from '@/assets/HomeIcon';
import { MypageIcon } from '@/assets/MypageIcon';
import { WritingIcon } from '@/assets/WritingIcon';
import { deleteData } from '@/hooks/useStorage';
import useAuthStore from '@/store/auth';
import { getPbImageURL } from '@/utils';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import S from './Nav.module.css';

function Nav() {
  const signInAuthData = useAuthStore((store) => store.user);
  const checkLogIn = useAuthStore((store) => store.checkLogIn);
  const [activeTab, setActiveTab] = useState('home');
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    deleteData('userBodyTypeValue');
    deleteData('userSievingValue');
    deleteData('userStyleValue');
  };

  useEffect(() => checkLogIn(), [checkLogIn]);

  if (!signInAuthData) {
    return (
      <nav className="w-full">
        <ul className="flex justify-around">
          <li
            onClick={() => handleTabClick('writing')}
            className={activeTab === 'writing' ? S.active : S.beforeActive}
          >
            <Link to="/writing">
              <WritingIcon size={50} />
            </Link>
          </li>
          <li
            onClick={() => handleTabClick('home')}
            className={activeTab === 'home' ? S.active : S.beforeActive}
          >
            <Link to="/">
              <HomeIcon size={50} />
            </Link>
          </li>
          <li
            onClick={() => handleTabClick('mypage')}
            className={activeTab === 'mypage' ? S.active : S.beforeActive}
          >
            <Link to={`/mypage/${signInAuthData?.id}`}>
              <MypageIcon size={50} />
            </Link>
          </li>
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className="w-full">
        <ul className="flex justify-around">
          <li
            onClick={() => handleTabClick('writing')}
            className={activeTab === 'writing' ? S.active : S.beforeActive}
          >
            <Link to="/writing">
              <WritingIcon size={50} />
            </Link>
          </li>
          <li
            onClick={() => handleTabClick('home')}
            className={activeTab === 'home' ? S.active : S.beforeActive}
          >
            <Link to="/">
              <HomeIcon size={50} />
            </Link>
          </li>
          <li
            onClick={() => handleTabClick('mypage')}
            className={activeTab === 'mypage' ? S.active : S.beforeActive}
          >
            <Link to={`/mypage/${signInAuthData?.id}`}>
              {signInAuthData.avatar ? (
                <img
                  src={getPbImageURL(signInAuthData, 'avatar')}
                  className="w-[50px] h-[50px] mt-1 rounded-full"
                />
              ) : (
                <MypageIcon size={50} />
              )}
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
