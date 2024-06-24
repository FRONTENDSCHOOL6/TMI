import pb from '@/api/pocketbase';
import ProfileUpload from '@/components/ProfileUpload/ProfileUpload';
import UserProfilePicture from '@/components/UserProfilePicture/UserProfilePicture';
import useFetchData from '@/hooks/useFetchData';
import useAuthStore from '@/store/auth';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import style from './UserProfileEdit.module.css';

const PB = import.meta.env.VITE_PB_URL;
const PB_USER_ENDPOINT = `${PB}/api/collections/users/records`;

function UserProfileEdit() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { data: userData, isLoading } = useFetchData(PB_USER_ENDPOINT);
  const [nickname, setNickname] = useState('');
  const [validationResult, setValidationResult] = useState('');
  const [usernameList, setUserNameList] = useState([]);
  const user = useAuthStore((store) => store.user);
  const checkLogIn = useAuthStore((store) => store.checkLogIn);

  const handleCheckDuplicate = () => {
    if (isLoading) {
      return;
    }

    if (
      nickname.length >= 5 &&
      nickname.length <= 10 &&
      /^[a-zA-Z0-9]+$/.test(nickname)
    ) {
      const isDuplicate = usernameList.includes(nickname.toLowerCase());

      if (isDuplicate) {
        setValidationResult('중복된 닉네임입니다.');
      } else {
        setValidationResult('사용가능한 닉네임입니다');
      }
    } else {
      setValidationResult('5~ 10글자의 영문 대소문자와 숫자만 입력하세요.');
    }
  };

  const handleNicknameChange = (value) => {
    if (
      value.length >= 5 &&
      value.length <= 10 &&
      /^[a-zA-Z0-9]+$/.test(value)
    ) {
      setNickname(value);
      setValidationResult('');
    } else {
      setNickname(value);
      setValidationResult('5 ~ 10글자의 영문 대소문자와 숫자만 입력하세요.');
    }
  };

  const handleButtonClick = () => {
    if (!isLoading) {
      handleCheckDuplicate();
    }
  };

  const updateUsernameOnServer = async () => {
    try {
      return await pb.collection('users').update(userId, {
        username: nickname,
      });
    } catch (error) {
      console.error('서버 요청 오류:', error);
      return false;
    }
  };

  const isNicknameValid =
    nickname.length >= 5 &&
    nickname.length <= 10 &&
    /^[a-zA-Z0-9]+$/.test(nickname);
  const isNicknameAvailable = validationResult === '사용가능한 닉네임입니다';
  const isSaveButtonDisabled = isLoading || !isNicknameAvailable;

  async function handleSaveButtonClick() {
    try {
      if (!isLoading && isNicknameAvailable) {
        const result = await updateUsernameOnServer();
        if (result) {
          toast.success('성공적으로 변경되었습니다');
          navigate(`/mypage/${userId}`);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const username = user?.username || '사용자 이름이 없습니다';

  useEffect(() => checkLogIn(), [checkLogIn]);

  useEffect(() => {
    if (userData.items) {
      const usernameList = userData.items.map((user) =>
        user.username.toLowerCase()
      );
      setUserNameList(usernameList);
    }
  }, [userData.items]);

  if (!user) {
    return null;
  }

  return (
    <div className={style.profile}>
      <UserProfilePicture avatar={user} />
      <div className="h-[90px] flex">
        <span className="mt-5 text-xl font-semibold">{username}</span>
      </div>
      <div className={style.editwrapper} />
      <div className="flex flex-col gap-6 mt-10">
        <NicknameInputSection
          nickname={nickname}
          handleNicknameChange={handleNicknameChange}
          handleButtonClick={handleButtonClick}
          validationResult={validationResult}
          isNicknameValid={isNicknameValid}
        />
        <ProfileUpload />
      </div>
      <button
        onClick={handleSaveButtonClick}
        className={`${style.save} ${
          isSaveButtonDisabled ? 'bg-gray-300' : 'bg-primary'
        }`}
        disabled={isSaveButtonDisabled}
      >
        저장하기
      </button>
    </div>
  );
}

function NicknameInputSection({
  nickname,
  handleNicknameChange,
  handleButtonClick,
  validationResult,
  isNicknameValid,
}) {
  return (
    <div className="flex gap-4 items-end">
      <div className="flex flex-col">
        <label htmlFor="nickname" className="text-sm">
          닉네임
        </label>
        <div className="flex gap-4">
          <input
            type="text"
            id="nickname"
            name="nickname"
            placeholder="5 ~ 10문자(특수문자 사용불가)"
            className={style.nick}
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
          />
          <button
            onClick={handleButtonClick}
            className={`h-10 text-gray-900 border rounded px-2 ${
              isNicknameValid ? 'bg-primary' : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!isNicknameValid}
          >
            중복확인
          </button>
        </div>
        {validationResult && (
          <div
            className={
              validationResult === '중복된 닉네임입니다.'
                ? 'text-red-500 text-xs'
                : 'text-green-500 text-xs'
            }
          >
            {validationResult}
          </div>
        )}
      </div>
    </div>
  );
}

NicknameInputSection.propTypes = {
  nickname: PropTypes.string.isRequired,
  handleNicknameChange: PropTypes.func.isRequired,
  handleButtonClick: PropTypes.func.isRequired,
  validationResult: PropTypes.string,
  isNicknameValid: PropTypes.bool.isRequired,
};

export default UserProfileEdit;
