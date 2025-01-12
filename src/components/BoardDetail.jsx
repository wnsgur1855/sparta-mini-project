import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import formatAgo from '../utils/formatDate';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import Button from '../elements/Button';
import Comment from './Comment';
import formatLike from '../utils/formatLike';
import { useDispatch, useSelector } from 'react-redux';
import { __getComment } from '../utils/redux/modules/comment/getComment';
import { postLike } from '../utils/api/like';
import { __getMy } from '../utils/redux/modules/my/getMy';
import { __getHome } from '../utils/redux/modules/home/getHome';

export default function BoardDetail({
  board: {
    id,
    userName,
    title,
    content,
    imageUrl,
    createdAt,
    modifiedAt,
    liked,
    postLikeCount,
    // commentList,
  },
  path,
  onBackClick,
}) {
  const [showComment, setShowComment] = useState(false);
  const { getComment, isLoading, isError } = useSelector(
    state => state.getComment,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(__getComment(id));
  }, [dispatch, id]);

  useEffect(() => {
    return () => setShowComment(false);
  }, [title, content, imageUrl, createdAt]);

  useEffect(() => {
    if (getComment.length === 0) {
      setShowComment(false);
    }
  }, [getComment.length]);

  const setDate = (createDate, modifiedDate) => {
    return formatAgo(createDate, modifiedDate);
  };

  const setformatLike = cnt => {
    return formatLike(cnt);
  };

  const handleShowComment = () => {
    setShowComment(state => !state);
  };

  const handleLike = async postId => {
    await postLike(postId);
    path ? dispatch(__getMy()) : dispatch(__getHome({ page: 1, query: '' }));
  };
  return (
    <>
      <DetailContainer>
        <Header>
          <TitleText>
            <h3>{userName}</h3>
            <Date>{setDate(createdAt, modifiedAt)}</Date>
          </TitleText>
          <Button width="4rem" height="1.5rem" type="sort" click={onBackClick}>
            Back
          </Button>
        </Header>
        <ImageContainer>
          <Img src={imageUrl} alt="userimg" />
        </ImageContainer>
        {liked ? (
          <HeartEmpty onClick={() => handleLike(id)}>
            <AiFillHeart />
          </HeartEmpty>
        ) : (
          <Heart onClick={() => handleLike(id)}>
            <AiOutlineHeart />
          </Heart>
        )}
        <Like>{setformatLike(postLikeCount)}</Like>
        <Title>{`${userName} ${title}`}</Title>
        <Content>{content}</Content>
        {getComment.length ? (
          <Button click={handleShowComment} height="1.5rem" type="sort">
            {showComment
              ? `댓글 가리기`
              : `댓글 ${getComment.length}개 모두보기`}
          </Button>
        ) : (
          <Comment id={id} comment={getComment} loginName="hi1234" />
        )}
        {showComment && (
          <Comment id={id} comment={getComment} loginName="hi1234" />
        )}
      </DetailContainer>
    </>
  );
}

const DetailContainer = styled.div`
  position: sticky;
  top: 0;
  right: 0;
  width: 30vw;
  min-width: 25rem;
  height: 100vh;
  padding: 1rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  @media (max-width: ${props => props.theme.screen.mobile_h}) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    background-color: ${props => props.theme.bg};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.3rem;
  margin: 1rem 0;
`;

const TitleText = styled.div`
  display: flex;
  gap: 0.3rem;
`;

const Date = styled.h4`
  color: ${props => props.theme.dateColor};
`;

const ImageContainer = styled.div`
  max-width: 100%;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  background-size: cover;
`;

const Like = styled.h4`
  margin: 1rem 0;
`;

const Title = styled.h4`
  display: -webkit-box;

  height: 1.08rem;
  white-space: normal;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Content = styled.p`
  display: -webkit-box;

  white-space: normal;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Heart = styled.div`
  margin-top: 1rem;
  font-size: ${props => props.theme.fontSize.medium};
`;

const HeartEmpty = styled(Heart)`
  color: ${props => props.theme.color.red};
`;
