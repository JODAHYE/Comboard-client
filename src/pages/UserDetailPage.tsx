import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import PostListItem from "../components/post/PostListItem";
import { usePost } from "../hooks/usePost";
import { useUser } from "../hooks/useUser";
import { PostType } from "../types/dataType";
import Loading from "../components/common/Loading";

const UserDetailPage = () => {
  const params = useParams();

  const { getUserDetail } = useUser();
  const { getUserPostList } = usePost();

  const [userNickname, setUserNickname] = useState("");
  const [userImg, setUserImg] = useState("");
  const [signupDate, setSignupDate] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [postLock, setPostLock] = useState(true);
  const [postList, setPostList] = useState<PostType[]>();
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  useEffect(() => {
    if (!params.userId) return;
    setLoading(true);
    getUserDetail(params.userId).then((res) => {
      setUserImg(res.profileImage);
      setUserNickname(res.nickname);
      setSignupDate(res.signupDate);
      setPostCount(res.count);
      setPostLock(res.postLock);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (postLock) return;
    if (!params.userId) return;
    getUserPostList(params.userId, skip).then((res) => {
      if (res.success) {
        setPostList(res.postList);
      } else {
        setSkip((prev) => prev - limit);
        return alert(res.msg);
      }
    });
  }, [skip, postLock]);

  const onPrev = () => {
    if (skip === 0) return;
    setSkip((prev) => prev - limit);
  };

  const onNext = () => {
    setSkip((prev) => prev + limit);
  };

  return (
    <Wrap>
      <InfoBox>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Img src={userImg} alt="프로필 이미지" />
            <Name>{userNickname && userNickname} 님</Name>
            <Date>
              {`가입일 ${String(signupDate).substring(0, 4)}년 ${String(
                signupDate
              ).substring(4, 6)}월 ${String(signupDate).substring(6, 8)}일`}
            </Date>
            <Date>작성한 글 {postCount}</Date>
          </>
        )}
      </InfoBox>
      <List>
        {loading && <Loading />}
        {!loading && postLock && "사용자가 게시글을 공개하지 않습니다."}
        {!loading && postList && postList.length && (
          <>
            <Title>{userNickname}님의 게시글</Title>
            {postList.map((v, i) => (
              <PostListItem key={i} post={v} />
            ))}
          </>
        )}
        {!loading && !postLock && (
          <Control>
            <PrevBtn onClick={onPrev} />
            <NextBtn onClick={onNext} />
          </Control>
        )}
      </List>
    </Wrap>
  );
};

export default UserDetailPage;

const Wrap = styled.div`
  width: 100vw;
  height: 95vh;
  ${(props) => props.theme.displayFlex};
  gap: 10px;
  justify-content: flex-start;
  @media (min-width: 320px) and (max-width: 480px) {
    height: 94vh;
    flex-direction: column;
  }
`;

const InfoBox = styled.div`
  width: 16%;
  height: 100%;
  ${(props) => props.theme.displayFlex};
  flex-direction: column;
  justify-content: start;
  gap: 16px;
  padding: 10px;
  /* align-items: flex-start; */
  margin-left: 10px;
  border-right: 1px solid ${(props) => props.theme.colors.shadow};
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    gap: 6px;
    margin-left: 0;
  }
`;

const Name = styled.p``;

const Img = styled.img`
  width: 90%;
  height: 300px;
  display: inline-block;
  object-fit: cover;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 70%;
    height: 120px;
  }
`;

const Date = styled.p`
  font-size: 14px;
`;

const List = styled.div`
  width: 60%;
  height: 100%;
  padding: 20px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    height: auto;
    padding: 20px 20px 40px;
  }
`;

const Control = styled.div`
  ${(props) => props.theme.displayFlex};
  margin: 0 auto;
`;

const PrevBtn = styled(GrFormPrevious)`
  cursor: pointer;
  font-size: 26px;
`;

const NextBtn = styled(GrFormNext)`
  cursor: pointer;
  font-size: 26px;
`;

const Title = styled.h3`
  color: ${(props) => props.theme.colors.button};
  margin-bottom: 20px;
`;
