import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { mypageClick } from "../../features/menuSlice";
import { useComment } from "../../hooks/useComment";
import { usePost } from "../../hooks/usePost";

const MyInfoComp = () => {
  const { nickname, is_auth } = useSelector((state: RootState) => state.user);
  const { getMyPostCount } = usePost();
  const { getMyCommentCount } = useComment();
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const { profileImage } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    getMyPostCount().then((res) => {
      setPostCount(res);
    });
    getMyCommentCount().then((res) => {
      setCommentCount(res);
    });
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
      const target = e.target as HTMLParagraphElement;
      if (target.dataset.name === "postCount") {
        dispatch(mypageClick("내 게시글"));
      } else if (target.dataset.name === "commentCount") {
        dispatch(mypageClick("내 댓글"));
      } else if (target.dataset.name === "scrapCount") {
        dispatch(mypageClick("스크랩"));
      } else {
        dispatch(mypageClick("정보 수정"));
      }
      navigate("/mypage");
    },
    [dispatch, navigate]
  );
  return (
    <>
      {is_auth && (
        <Wrap>
          {profileImage ? (
            <Img src={profileImage} />
          ) : (
            <Img src="../../../image/default-img.jpg" />
          )}
          <Nickname>{nickname}님</Nickname>
          <Info onClick={onClick} data-name="postCount">
            게시글 수 {postCount}
          </Info>
          <Info onClick={onClick} data-name="commentCount">
            댓글 수 {commentCount}
          </Info>
          <Info onClick={onClick}>정보 수정</Info>
        </Wrap>
      )}
    </>
  );
};

export default MyInfoComp;
const Wrap = styled.div`
  border: 1px solid ${(props) => props.theme.colors.shadow};
  width: 180px;
  overflow: hidden;
  height: auto;
  @media (min-width: 320px) and (max-width: 480px) {
    display: none;
  }
`;
const Img = styled.img`
  display: inline-block;
  width: 100%;
  height: 180px;
  object-fit: cover;
`;
const Nickname = styled.p`
  font-size: 14px;
  margin: 8px;
  font-weight: 600;
`;
const Info = styled.p`
  font-size: 14px;
  margin: 6px;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;
