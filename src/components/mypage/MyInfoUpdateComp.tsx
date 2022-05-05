import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { auth } from "../../features/userSlice";
import { useUser } from "../../hooks/useUser";
import Loading from "../common/Loading";

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

  return (
    <>
      <Title>정보 수정</Title>
      <List>
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
              프로필 이미지 변경
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
            <p>닉네임</p>
            {isUpdateClick ? (
              <>
                <NicknameField
                  value={updatedNickname}
                  onChange={(e) => {
                    setUpdatedNickname(e.target.value);
                  }}
                />
                <Btn onClick={onNicknameUpdate} active={true}>
                  완료
                </Btn>
              </>
            ) : (
              <>
                <p>{nickname}</p>
                <Btn
                  onClick={() => {
                    setIsUpdateClick(true);
                  }}
                  active={true}
                >
                  변경
                </Btn>
              </>
            )}
          </Row>
          <Row>
            <p>게시글 리스트 공개</p>
            <div>
              <Btn active={!postLock && true} onClick={onPostLock}>
                On
              </Btn>
              <Btn active={postLock && true} onClick={onPostLock}>
                Off
              </Btn>
            </div>
          </Row>
          <span>
            {postLock
              ? "-타인에게 내 게시글 리스트를 공개하지 않고 있습니다."
              : "-타인에게 내 게시글 리스트를 공개중입니다."}
          </span>
        </InfoDiv>
      </List>
    </>
  );
};

export default MyInfoUpdateComp;

const List = styled.div`
  width: 60%;
  display: flex;
  margin-top: 30px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-family: SpoqaHanSansNeoBold;
  font-size: 20px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 16px;
  }
`;

const InfoDiv = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  & > span {
    font-size: 14px;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    justify-content: center;
    align-items: center;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  & > p {
    color: ${(props) => props.theme.colors.button};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const Img = styled.img`
  width: 300px;
  height: 300px;
  display: inline-block;
  object-fit: cover;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 80%;
    height: 160px;
  }
`;

const Label = styled.label`
  display: inline-block;
  padding: 4px;
  cursor: pointer;
  background: ${(props) => props.theme.colors.button};
  color: #fff;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    margin-bottom: 8px;
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
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 14px;
  }
`;

const Btn = styled.button<StyledType>`
  display: inline-block;
  border-radius: 4px;
  padding: 6px;
  background: ${(props) =>
    props.active ? props.theme.colors.button : props.theme.colors.buttonActive};
  color: #fff;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 4px;
    font-size: 12px;
  }
`;
