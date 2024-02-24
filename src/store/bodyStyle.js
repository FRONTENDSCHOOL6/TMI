import pb from '@/api/pocketbase';
import { create } from 'zustand';

const initialUserBodyState = {
  userSieving: '',
  userStyle: '',
  userBodyType: '',
};

const useUserStore = create((set) => ({
  ...initialUserBodyState,

  updateUserStyle: async (userId, authUserData) => {
    const storedUserSievingValue = JSON.parse(
      localStorage.getItem('userSievingValue')
    )?.replace(/\s/g, '');
    const storedUserStyleValue = JSON.parse(
      localStorage.getItem('userStyleValue')
    );
    const storedBodyTypeValue = JSON.parse(
      localStorage.getItem('userBodyTypeValue')
    );

    try {
      const updatedUser = pb.collection('users').update(userId, {
        sieving:
          storedUserSievingValue !== null
            ? storedUserSievingValue
            : authUserData?.sieving,
        style:
          storedUserStyleValue !== null
            ? storedUserStyleValue
            : authUserData?.style,
        bodyType:
          storedBodyTypeValue !== null
            ? storedBodyTypeValue
            : authUserData?.bodyType,
      });

      set({
        userSieving: updatedUser.sieving,
        userStyle: updatedUser.style,
        userBodyType: updatedUser.bodyType,
      });
    } catch (error) {
      console.error(error.message, '에러 메시지');
      throw new Error(
        '사용자 정보 업데이트에 실패했습니다. 다시 시도해주세요.'
      );
    }
  },

  setStyle: (userStyle) => set({ userStyle: userStyle }),

  setSieving: (userSieving) => set({ userSieving: userSieving }),

  setBodyType: (userBodyType) => set({ userBodyType: userBodyType }),
}));

export default useUserStore;
