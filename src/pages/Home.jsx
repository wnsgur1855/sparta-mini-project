import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';

import BoardSort from '../components/BoardSort';
import BoardList from '../components/BoardList';
import { __getHome } from '../utils/redux/modules/home/getHome';
import { useInView } from 'react-intersection-observer';

export default function Home() {
  const page = useRef(1);
  const pageData = useRef({});
  const [ref, inView] = useInView();
  const dispatch = useDispatch();
  const { getHome, isLoading, isError } = useSelector(state => state.getHome);

  const handleSortClick = e => {
    const innerText = e.target.innerText;
    if (innerText === 'Recent') {
      dispatch(__getHome({ page: page, query: '' }));
    } else if (innerText === 'Popular') {
      dispatch(__getHome({ page: page, query: '&sortBy=postLikeCount' }));
    }
  };

  useEffect(() => {
    if (getHome.length === 0) {
      console.log('첫 포스트 로딩');
      dispatch(__getHome({ page: page.current, query: '' }));
      return;
    }
  }, []);

  useEffect(() => {
    if (
      getHome.length !== 0 &&
      inView &&
      !isLoading &&
      !isError &&
      getHome.length !== pageData.current.length
    ) {
      page.current += 1;
      pageData.current = getHome;
      console.log('첫 로딩 이후 무한 스크롤', getHome, page.current);
      dispatch(__getHome({ page: page.current, query: '' }));
    }
  }, [inView]);

  return (
    <HomeWrapper>
      <BoardSort click={handleSortClick}>
        {{ content: { first: 'Recent', second: 'Popular' } }}
      </BoardSort>
      <BoardList boards={getHome} />
      <InfiniteScroll ref={ref}>
        {isLoading && <img src="/img/spinner.gif" alt="spinner" />}
        {getHome.length === pageData.current.length && (
          <p>마지막 페이지 입니다.</p>
        )}
      </InfiniteScroll>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.main`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      0deg,
      rgba(88, 81, 216, 1) 0%,
      rgba(131, 58, 180, 1) 10%,
      rgba(193, 53, 132, 1) 20%,
      rgba(225, 48, 108, 1) 30%,
      rgba(253, 36, 76, 1) 40%,
      #f56040 50%,
      rgba(247, 119, 55, 1) 60%,
      #fcaf45 70%,
      #ffdc80 80%
    );
    border-radius: 6px;
  }

  @media (max-width: ${props => props.theme.screen.tablet_v}) {
    border-top: 1px solid ${props => props.theme.bgBorderColor};
  }
  @media (min-width: ${props => props.theme.screen.tablet_v}) {
    border-left: 1px solid ${props => props.theme.bgBorderColor};
  }
`;

const InfiniteScroll = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10rem;
`;
