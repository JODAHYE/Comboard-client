import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import moment from "moment";

import { RootState } from "../../app/store";
import Popup from "../common/Popup";
import { useBoard } from "../../hooks/useBoard";

type sizeType = {
  width?: string;
};

const CreateBoard = () => {
  const navigate = useNavigate();

  const { createBoard } = useBoard();

  const { objectId } = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    title: "",
    description: "",
    access: "public",
    password: "",
    passwordcheck: "",
    bgimg: "",
    formData: {},
  });

  const onChangeInfo = useCallback(
    (
      e:
        | React.MouseEvent<HTMLInputElement, MouseEvent>
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const target = e.target as HTMLInputElement;
      setInfo({
        ...info,
        [target.name]: target.value,
      });
    },
    [info]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (info.title.length < 2) {
        return alert("게시판 이름을 두 글자 이상으로 설정해주세요.");
      }
      if (info.title.length > 30) {
        return alert("게시판 이름은 최대 30글자 입니다.");
      }
      if (info.password !== info.passwordcheck) {
        return alert("암호와 암호확인이 일치하지 않습니다.");
      }
      if (info.access === "private" && !info.password) {
        return alert("암호를 설정해주세요.");
      }
      const body = {
        master: objectId,
        title: info.title,
        description: info.description,
        access: info.access,
        secretNumber: info.password,
        bgimg: info.bgimg,
        formData: info.formData,
        creatDate: parseInt(moment().format("YYYYMMDDHHmmss")),
      };
      setLoading(true);
      createBoard(body).then((res) => {
        alert(res.msg);
        if (res.success) {
          navigate(`/board/${res.board._id}`);
        } else {
          return setLoading(false);
        }
      });
    },
    [info, navigate, createBoard, objectId]
  );

  const onImgChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const files = target.files as FileList;
      const formData = new FormData();
      formData.append("file", files[0]);
      setInfo({
        ...info,
        [target.name]: target.value,
        formData: formData,
      });
    },
    [info]
  );

  return (
    <Popup height={"80vh"}>
      <Title>게시판 생성</Title>
      <Form onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="제목"
          name="title"
          value={info.title}
          onChange={onChangeInfo}
        />
        <Div>
          <Label>
            <input
              onChange={onChangeInfo}
              type="radio"
              name="access"
              value="public"
            />
            공개
          </Label>
          <Label>
            <input
              onChange={onChangeInfo}
              type="radio"
              name="access"
              value="private"
            />
            비밀
          </Label>
          <ImgSelector htmlFor="image">이미지 선택</ImgSelector>
          {info.bgimg && <Alert>{info.bgimg}</Alert>}
          <ImgUpload
            type="file"
            id="image"
            name="bgimg"
            value={info.bgimg}
            accept="image/*"
            onChange={onImgChange}
          />
        </Div>
        {info.access === "private" && (
          <Div>
            <Label>암호</Label>
            <Input
              type="password"
              name="password"
              placeholder="암호 입력"
              width={"30%"}
              onChange={onChangeInfo}
            />
            <Input
              type="password"
              name="passwordcheck"
              placeholder="암호 확인"
              width={"30%"}
              onChange={onChangeInfo}
            />
            {info.password !== info.passwordcheck && (
              <Alert>암호와 암호 확인이 일치하지 않습니다.</Alert>
            )}
          </Div>
        )}
        <Label>설명</Label>
        <Desc
          placeholder="게시판을 소개해주세요."
          name="description"
          value={info.description}
          onChange={onChangeInfo}
        />
        <Button>생성</Button>
        {loading && <CircularProgress size={28} />}
      </Form>
    </Popup>
  );
};

const Title = styled.h3`
  font-family: BMHANNAAir;
  font-size: 1.75rem;
  color: #000;
`;

const Form = styled.form`
  width: 100%;
  height: 80%;
  ${(props) => props.theme.displayFlex};
  flex-direction: column;
  gap: 10px;
  @media (min-width: 320px) and (max-width: 480px) {
    gap: 6px;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  margin-right: 10px;
`;

const Input = styled.input<sizeType>`
  width: ${(props) => (props.width ? props.width : "80%")};
  height: 30px;
  padding: 6px;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  margin: 2px;
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
  &::placeholder {
    font-size: 0.875rem;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 92%;
  }
`;

const Div = styled.div`
  width: 100%;
  margin: 10px 0;
  text-align: center;
`;

const Desc = styled.textarea`
  width: 80%;
  height: 60%;
  outline: none;
  border: none;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  margin: 2px;
  padding: 6px;
  line-height: 1.2em;
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 92%;
    &::placeholder {
      font-size: 0.875rem;
    }
  }
`;

const Button = styled.button`
  color: #fff;
  border-radius: 4px;
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
  }
`;

const Alert = styled.p`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.button};
  margin: 10px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 92%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ImgSelector = styled.label`
  font-size: 0.875rem;
  cursor: pointer;
  padding: 4px;
  background: ${(props) => props.theme.colors.button};
  color: #fff;
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 2px;
  }
`;

const ImgUpload = styled.input`
  display: none;
`;

export default CreateBoard;
