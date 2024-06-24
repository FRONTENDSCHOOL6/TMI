import useAuthStore from '@/store/auth';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import FeedItem from '../FeedItem/FeedItem';
import Spinner from '../Spinner';
import S from './Feed.module.css';
import Filter from '/Filter.svg';

const PB = import.meta.env.VITE_PB_URL;
const PB_FEED_ENDPOINT = `${PB}/api/collections/posts/records?sort=-created&expand=user`;

function getItemsPerPage() {
  const width = window.innerWidth;
  if (width <= 768) {
    return 18;
  } else {
    return 24;
  }
}

async function fetchProducts({ pageParam = 1 }) {
  const itemsPerPage = getItemsPerPage();
  const response = await axios(
    `${PB_FEED_ENDPOINT}&page=${pageParam}&perPage=${itemsPerPage}`
  );
  return response.data;
}

function Feed() {
  const checkLogIn = useAuthStore((store) => store.checkLogIn);

  const {
    data: postData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(
    ['posts'],
    ({ pageParam }) => fetchProducts({ pageParam }), // queryFn 수정
    {
      getNextPageParam: (lastPage, allPages) => {
        const itemsPerPage = getItemsPerPage();
        const maxPage = Math.ceil(lastPage.totalItems / itemsPerPage);
        const nextPage = allPages.length + 1;
        return nextPage <= maxPage ? nextPage : undefined;
      },
    }
  );

  let dataItems = postData ? postData.pages?.flatMap((page) => page.items) : [];

  const { ref, inView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    checkLogIn();
  }, [checkLogIn]);

  return (
    <div>
      <h2 className={S.feedTitle}>Feeds</h2>
      <div className={S.headerSection}>
        <h3 className={S.newLabel}>NEW</h3>
        <button type="button" aria-label="필터">
          <img src={Filter} alt="필터" />
        </button>
      </div>
      <div className={S.feedWrapper}>
        {dataItems?.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>
      <div>
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <Spinner size={160} title="데이터 가져오는 중이에요." />
          ) : hasNextPage ? (
            <Spinner size={160} title="데이터 가져오는 중이에요." />
          ) : (
            ''
          )}
        </button>
      </div>
      <div className="flex justify-center">
        {isFetching && !isFetchingNextPage ? (
          <Spinner size={160} title="데이터 가져오는 중이에요." />
        ) : null}
      </div>
    </div>
  );
}

export default Feed;
