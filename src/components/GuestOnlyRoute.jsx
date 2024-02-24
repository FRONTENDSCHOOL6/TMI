import useAuthStore from '@/store/auth';
import { element } from 'prop-types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

function GuestOnlyRoutes({ children }) {
  const navigate = useNavigate();
  const checkLogIn = useAuthStore((store) => store.checkLogIn);

  const user = useAuthStore((store) => store.user);
  const isAuthenticated = user?.token;
  const { pathname, search, hash } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const wishLocationPath = `${pathname}${search}${hash}`;

  useEffect(() => {
    checkLogIn();
  }, [checkLogIn]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      import.meta.env.MODE === 'development' && toast.dismiss();

      toast('로그인 / 회원가입 페이지입니다', {
        position: 'top-center',
        icon: '🚨',
        ariaProps: {
          role: 'alert',
          'aria-live': 'polite',
        },
      });

      return navigate('/', { state: { wishLocationPath } });
    }

    const cleanup = setTimeout(() => setIsLoading(false));

    return () => {
      clearTimeout(cleanup);
    };
  }, [isAuthenticated, isLoading, navigate, wishLocationPath]);

  return children;
}

GuestOnlyRoutes.propTypes = {
  children: element,
};

export default GuestOnlyRoutes;
