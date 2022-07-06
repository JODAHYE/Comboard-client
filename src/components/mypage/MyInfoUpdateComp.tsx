import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { RootState } from "../../app/store";
import { auth } from "../../features/userSlice";
import { useUser } from "../../hooks/useUser";
import Loading from "../common/Loading";
import ContentWrap from "./ContentWrap";

type StyledType = {
  isFocus?: boolean;
  active?: boolean;
};

const MyInfoUpdateComp = () => {
  const dispatch = useDispatch();

  const { updateProfileImg, updateNickname, updatePostLock } = useUser();

  const { nickname, profileImage, postLock } = useSelector(
    (state: RootState) => state.user
  );

  const [isUpdateClick, setIsUpdateClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedNickname, setUpdatedNickname] = useState(nickname);

  useEffect(() => {
    setLoading(false);
  }, [nickname, profileImage]);

  const onImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const files = target.files as FileList;
      const formData = new FormData();
      formData.append("file", files[0]);
      setLoading(true);
      const url = await axios
        .post(`${process.env.REACT_APP_SERVER_URL}/upload/image`, formData)
        .then((res) => res.data.img_url);
      updateProfileImg(url).then(() => {
        dispatch(auth());
      });
    },
    [updateProfileImg]
  );

  const onNicknameUpdate = useCallback(() => {
    if (updatedNickname.length > 18) {
      return alert("닉네임은 18글자까지만 가능합니다.");
    }
    updateNickname(updatedNickname).then(() => {
      dispatch(auth());
    });
    setIsUpdateClick(false);
  }, [updateNickname, updatedNickname]);

  const onPostLock = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const target = e.target as HTMLButtonElement;
      if (target.innerHTML === "On") {
        updatePostLock(false).then(() => {
          dispatch(auth());
        });
      } else {
        updatePostLock(true).then(() => {
          dispatch(auth());
        });
      }
    },
    [updatePostLock]
  );

  const inputNickname = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUpdatedNickname(e.target.value);
    },
    []
  );

  const nicknameChangeBtnClick = useCallback(() => {
    setIsUpdateClick(true);
  }, []);

  return (
    <>
      <Title>정보 수정</Title>
      <ContentWrap>
        <InfoDiv>
          {loading && <Loading />}
          {!loading && profileImage && (
            <Img src={profileImage} alt="프로필이미지" />
          )}
          {!loading && !profileImage && (
            <Img src="../../../image/default-img.jpg" alt="프로필이미지" />
          )}
          <form>
            <Label data-name="addImage" title="동영상 첨부" htmlFor="image">
              이미지 변경
            </Label>
            <ImgUpload
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={onImageChange}
            />
          </form>
        </InfoDiv>
        <InfoDiv>
          <Row>
            {isUpdateClick ? (
              <>
                <NicknameField
                  value={updatedNickname}
                  onChange={inputNickname}
                />
                <Button onClick={onNicknameUpdate} active={true}>
                  완료
                </Button>
              </>
            ) : (
              <>
                <Nickname>{nickname}</Nickname>
                <Button onClick={nicknameChangeBtnClick} active={true}>
                  변경
                </Button>
              </>
            )}
          </Row>
          <Row>
            <p>내 게시글 공개</p>
            <div>
              <Button active={!postLock && true} onClick={onPostLock}>
                On
              </Button>
              <Button active={postLock && true} onClick={onPostLock}>
                Off
              </Button>
            </div>
          </Row>
          <span>
            {postLock
              ? "-타인에게 내 게시글 리스트를 공개하지 않고 있습니다."
              : "-타인에게 내 게시글 리스트를 공개중입니다."}
          </span>
        </InfoDiv>
      </ContentWrap>
    </>
  );
};

const Title = styled.h1`
  font-family: SpoqaHanSansNeoBold;
  font-size: 1.25rem;
`;

const InfoDiv = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & > span {
    font-size: 0.875rem;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    gap: 6px;
  }
`;

const Img = styled.img`
  width: 200px;
  height: 200px;
  display: inline-block;

  object-fit: cover;

  @media (min-width: 320px) and (max-width: 480px) {
    width: 50%;
    max-height: 160px;
  }
`;

const Nickname = styled.p`
  font-size: 1.25rem;
  &::after {
    content: "님";
    font-size: 1rem;
  }
`;

const Label = styled.label`
  display: inline-block;

  cursor: pointer;
  background: ${(props) => props.theme.colors.button};
  color: #fff;
  margin-bottom: 30px;
  padding: 4px;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;

const ImgUpload = styled.input`
  display: none;
`;

const NicknameField = styled.textarea<StyledType>`
  width: 50%;
  height: 26px;
  display: inline-block;

  outline: none;
  border: none;
  border: 1px solid ${(props) => props.theme.colors.buttonActive};
  resize: none;
  padding: 4px;
`;

const Button = styled.button<StyledType>`
  width: 80px;
  display: inline-block;
  font-size: 0.875rem;
  border-radius: 4px;
  background: ${(props) =>
    props.active ? props.theme.colors.button : props.theme.colors.buttonActive};
  color: #fff;

  @media (min-width: 320px) and (max-width: 480px) {
    padding: 4px;
  }
`;

export default MyInfoUpdateComp;
