import pb from '@/api/pocketbase';
import useAuthStore from '@/store/auth';
import { getNextSlideIndex, getPreviousSlideIndex } from '@/utils';
import debounce from '@/utils/debounce';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Resizer from 'react-image-file-resizer';
import { useNavigate } from 'react-router-dom';
import MoveSlide from '../MoveSlide/MoveSlide';
import S from './FileUpload.module.css';
import photoIcon from '/photoIcon.svg';

function FileUpload() {
  const navigate = useNavigate();
  const authUser = useAuthStore((store) => store.user);
  const contentRef = useRef(null);
  const formRef = useRef(null);
  const photoRef = useRef(null);

  const [content, setContent] = useState('');
  const [isShowOptions, setIsShowOptions] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [uploadFiles, setUploadFiles] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileImages, setFileImages] = useState([]);

  const toggleOptions = () => setIsShowOptions(!isShowOptions);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    toggleOptions();
  };

  const handleContent = debounce((e) => setContent(e.target.value));

  const handleUpload = async (e) => {
    const { files } = await e.target;
    try {
      const resizePromises = Array.from(files).map(resizeFile);
      const compressedFiles = await Promise.all(resizePromises);

      setUploadFiles(compressedFiles);
      setFileImages(
        compressedFiles.map((file, index) => ({
          image: URL.createObjectURL(file),
          label: files[index].name,
        }))
      );
    } catch (error) {
      console.error('이미지 리사이징 및 압축 중 오류가 발생했습니다:', error);
    }
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        288,
        288,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });

  const handleNextSlide = () =>
    setCurrentIndex(getNextSlideIndex(currentIndex, fileImages));

  const handelPrevSlide = () =>
    setCurrentIndex(getPreviousSlideIndex(currentIndex, fileImages));

  const handlePost = async (e) => {
    e.preventDefault();
    const statusValue = selectedOption;
    const contentValue = contentRef.current.value;
    const photoValue = uploadFiles;

    if (
      photoValue.length === 0 ||
      contentRef.current.value.trim().length === 0
    ) {
      toast.error('사진과 내용을 입력해주세요', {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      return;
    }

    const formData = new FormData();

    formData.append('statusEmoji', statusValue);
    formData.append('content', contentValue);
    formData.append('user', authUser.id);
    if (photoValue) {
      for (let i = 0; i < photoValue.length; i++) {
        formData.append('photo', photoValue[i]);
      }
    }

    try {
      await pb.collection('posts').create(formData);
      toast.success('게시물이 성공적으로 올라갔습니다', {
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        encType="multipart/form-data"
        ref={formRef}
        onSubmit={handlePost}
        className={S.formWrapper}
      >
        {/* 이모지 선택 */}
        <div className={S.selectEmojiWrapper}>
          <button
            type="button"
            className={S.speechBubbleBody}
            onClick={toggleOptions}
          >
            <div className={S.speechBubbleHead}></div>
            {isShowOptions && (
              <div title="상태 선택"> {selectedOption || '상태 선택'}</div>
            )}
          </button>
          {!isShowOptions && (
            <ul className={S.statusListWrapper}>
              <li>
                <label aria-description="추워요" className="relative">
                  <input
                    type="radio"
                    name="options"
                    value="🥶"
                    className={S.selectEmoji}
                    onChange={handleOptionChange}
                    checked={selectedOption === '🥶'}
                  />
                  <span className={S.statusItem}>🥶</span>
                </label>
              </li>
              <li>
                <label aria-description="더워요" className="relative">
                  <input
                    type="radio"
                    name="options"
                    value="🥵"
                    className={S.selectEmoji}
                    onChange={handleOptionChange}
                    checked={selectedOption === '🥵'}
                  />
                  <span className={S.statusItem}>🥵</span>
                </label>
              </li>
              <li>
                <label aria-description="딱 좋아요" className="relative">
                  <input
                    type="radio"
                    name="options"
                    value="😌"
                    className={S.selectEmoji}
                    onChange={handleOptionChange}
                    checked={selectedOption === '😌'}
                  />
                  <span className={S.statusItem}>😌</span>
                </label>
              </li>
            </ul>
          )}
        </div>
        {/* 사진 업로드 */}
        <div className={S.photoContainer}>
          <label htmlFor="photo" className="sr-only">
            사진 업로드
          </label>
          <div className="relative">
            <input
              type="file"
              accept="*.jpg,*.png,*.jpeg,*.webp,*.avif"
              ref={photoRef}
              name="photo"
              id="photo"
              onChange={handleUpload}
              className={S.photo}
              multiple
            />
            <div className="carouselContainer">
              {fileImages.length ? (
                <div className={S.carouselWrapper}>
                  {fileImages.map((file, index) => (
                    <div
                      key={index}
                      className={`${index === currentIndex ? '' : 'hidden'}`}
                    >
                      <img
                        src={file.image}
                        alt={file.label}
                        className={S.uploadImage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={S.uploadBefore}>
                  <img src={photoIcon} alt="업로드" className="h-8 w-8" />
                </div>
              )}
            </div>
            <MoveSlide
              prevFunc={handelPrevSlide}
              nextFunc={handleNextSlide}
              disabled={fileImages.length <= 1 ? true : false}
            />
          </div>
        </div>
        {/* textarea */}
        <div className={S.textareaWrapper}>
          <label htmlFor="content" className="sr-only">
            message
          </label>
          <textarea
            name="content"
            id="content"
            cols="30"
            rows="10"
            ref={contentRef}
            maxLength={150}
            placeholder="텍스트를 입력하세요. (0 / 150)"
            className={S.textarea}
            defaultValue={content}
            onChange={handleContent}
          ></textarea>
        </div>
        <div className={S.postBtnWrapper}>
          <button type="submit" className={S.postBtn}>
            게시
          </button>
        </div>
      </form>
    </>
  );
}

export default FileUpload;
