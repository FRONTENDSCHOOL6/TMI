import FormInput from '@/components/FormInput/FormInput';
import Heart from '@/components/Heart';
import Loading from '@/components/Loading/Loading';
import MoveSlide from '@/components/MoveSlide/MoveSlide';
import SpeechBubble from '@/components/SpeechBubble/SpeechBubble';
import { useCommentsMutation } from '@/hooks/useCommentsMutation';
import { usePostQuery } from '@/hooks/usePostQuery';
import useAuthStore from '@/store/auth';
import {
  formatDate,
  getNextSlideIndex,
  getPbImageURL,
  getPreviousSlideIndex,
} from '@/utils';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import S from './Post.module.css';
import BackIcon from '/BackIcon.svg';

function Post() {
  const { postId } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likePost, setLikePost] = useState(true);
  const checkLogIn = useAuthStore((store) => store.checkLogIn);
  const authUser = useAuthStore((store) => store.user);
  const [formInputValue, setFormInputValue] = useState('');

  const { data: postInfo, error, isLoading } = usePostQuery(postId);
  const { mutate } = useCommentsMutation(() => setFormInputValue(''));
  const inputDateString = postInfo?.created;
  const formattedDate = formatDate(inputDateString);
  const postExpandData = postInfo?.expand;
  const postUser = postExpandData?.user;

  const newComment = {
    message: formInputValue,
    post: postId,
    user: authUser,
  };

  const handleFormInputValue = (e) => {
    setFormInputValue(e.target.value);
  };

  const handleNextSlide = () => {
    setCurrentIndex(
      getNextSlideIndex(currentIndex, getPbImageURL(postInfo, 'photo'))
    );
  };

  const handelPrevSlide = () => {
    setCurrentIndex(
      getPreviousSlideIndex(currentIndex, getPbImageURL(postInfo, 'photo'))
    );
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error('로그인이 필요한 작업입니다', {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      return;
    }

    if (formInputValue.trim() === '') {
      toast.error('댓글을 입력해주세요', {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      return;
    }
    mutate(newComment);
    setFormInputValue('');
  };

  const handleLikePost = () => {
    setLikePost(!likePost);
  };

  useEffect(() => checkLogIn(), [checkLogIn]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (postInfo) {
    return (
      <div className={S.postWrapper}>
        <Link to={'/'}>
          <img src={BackIcon} alt="뒤로가기" className="w-3 h-5 mt-2 ml-2" />
        </Link>
        <div className={S.formWrapper}>
          <SpeechBubble text={postInfo.statusEmoji} />
          <div className={S.postInnerWrapper}>
            <div className={S.photoWrapper}>
              {postInfo.photo?.map((_, index) => (
                <div
                  key={index}
                  className={`${index === currentIndex ? '' : 'hidden'}`}
                >
                  <img
                    src={getPbImageURL(postInfo, 'photo')[currentIndex]}
                    className={S.uploadImage}
                    alt={`Image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className={S.heartBtn}
              onClick={handleLikePost}
            >
              {likePost ? <Heart /> : <Heart color="#FF3A3A" />}
            </button>
          </div>
          <MoveSlide
            prevFunc={handelPrevSlide}
            nextFunc={handleNextSlide}
            disabled={postInfo.photo.length <= 1 ? true : false}
          />
          <div className="flex justify-between">
            <div className={S.postingDate}>📆 {formattedDate}</div>
            <div className={S.postingDate}>
              지역정보📍[{postInfo.expand.user.region}]
            </div>
          </div>
          <hr />
          <p className={S.content}>{postInfo.content}</p>
          <hr />
          <div className={S.colLayout}>
            <h3 className={S.title}>COMMENTS</h3>
            <ul className={S.colLayout}>
              <div className={`${S.colLayout} gap-1 pb-3`}>
                {postExpandData.comments ? (
                  postExpandData.comments?.toReversed().map((item, index) => (
                    <li key={index} className={S.commentWrapper}>
                      <span className={S.commentUser}>
                        {item.expand?.user.username}
                      </span>
                      <span>{item.message}</span>
                    </li>
                  ))
                ) : (
                  <span className={S.noneComment}>
                    {'댓글이 아직 없어요 (┬┬﹏┬┬)'}
                  </span>
                )}
              </div>
            </ul>
          </div>
          <hr />
          <section>
            <h3 className={S.title}>
              <span className="text-gray800 font-semibold underline">
                {postUser.username}
              </span>{' '}
              님의 Info
            </h3>
            <div className={S.postingUserInfoWrapper}>
              <div className={S.postingUserItemWrapper}>
                <span className={S.postingItemTitle}>º 체형</span>
                {postUser?.bodyType ? (
                  <span className={S.bodyType}>{postUser?.bodyType}</span>
                ) : (
                  ''
                )}
              </div>
              <div className={S.postingUserItemWrapper}>
                <span className={S.postingItemTitle}>º 스타일</span>
                <span className={S.styleWrapper}>
                  {postUser?.style.map((item, index) => (
                    <span key={index} className={S.styleItem}>
                      {item}
                    </span>
                  ))}
                </span>
              </div>
              <div className={S.postingUserItemWrapper}>
                <span className={S.postingItemTitle}>º 체질</span>
                <span className={S.styleWrapper}>
                  {postUser?.sieving.map((item, index) => (
                    <span key={index} className={S.styleItem}>
                      {item}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </section>
          <div className={S.inputWrapper}>
            <FormInput
              type="text"
              name="comment"
              label="댓글창"
              onChange={handleFormInputValue}
              value={formInputValue}
            />
            <button
              onClick={handleCommentSubmit}
              type="submit"
              aria-label="댓글 게시"
              className={S.inputBtn}
            >
              게시
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
