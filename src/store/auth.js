import pb from '@/api/pocketbase';
import { getData } from '@/hooks/useStorage';
import { create } from 'zustand';

const initialAuthState = {
  isAuth: false,
  user: null,
  token: '',
};

const useAuthStore = create((set) => ({
  ...initialAuthState,

  /* Pb SDK를 사용한 회원가입 */
  signUp: async (registerUser) => {
    try {
      const user = await pb.collection('users').create(registerUser);

      set({ isAuth: true, user, token: user.token });
    } catch (error) {
      console.error(error);
      throw new Error('회원가입에 실패했습니다. 입력한 정보를 확인해주세요.');
    }
  },

  /* Pb SDK를 사용한 로그인 */
  signIn: async (userNameOrEmail, password) => {
    try {
      const user = await pb
        .collection('users')
        .authWithPassword(userNameOrEmail, password);
      set({ isAuth: true, user, token: user.token });
    } catch (error) {
      console.error(error);
      throw new Error('아이디나 비밀번호를 확인해주세요.');
    }
  },

  /* Pb SDK를 사용한 로그아웃 */
  signOut: async () => {
    try {
      await pb.authStore.clear();
      set({ isAuth: false, user: null, token: null });
    } catch (error) {
      console.error(error);
      throw new Error('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  },

  /* Pb SDK를 사용한 회원탈퇴 */
  Withdrawal: async (recordId) => {
    try {
      await pb.collection('users').delete(recordId);
      set({ isAuth: false, user: null, token: null });
    } catch (error) {
      console.error(error);
      throw new Error('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
  },

  checkLogIn: () => {
    // 컴포넌트가 렌더링 된 후, authUserData가 비어있는지 체크
    // localStorage 확인해서 업데이트
    try {
      const { model, token } = getData('pocketbase_auth');

      if (model) {
        set({ isAuth: true, user: model, token: token });
      }
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useAuthStore;
