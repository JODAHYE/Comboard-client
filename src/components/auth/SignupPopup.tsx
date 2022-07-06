import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { signup } from "../../features/userSlice";
import Popup from "../common/Popup";

const SignupPopup = () => {
  const dispatch = useDispatch();

  const [info, setInfo] = useState({
    email: "",
    password: "",
    passwordcheck: "",
    nickname: "",
  });

  const onSignup = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { email, password, nickname, passwordcheck } = info;
      if (!email || !password || !nickname) {
        return alert("값을 입력해주세요.");
      }
      if (nickname.length > 18) {
        return alert("닉네임은 18글자 이하여야합니다.");
      }
      if (password !== passwordcheck) {
        return alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      }
      const body = {
        email,
        password,
        nickname,
      };
      dispatch(signup(body));
    },
    [info, dispatch]
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      setInfo({
        ...info,
        [target.id]: target.value,
      });
    },
    [info]
  );

  return (
    <Popup>
      <Title>회원가입</Title>
      <Form onSubmit={onSignup}>
        <Label htmlFor="email">이메일</Label>
        <Input type="email" value={info.email} id="email" onChange={onChange} />
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          value={info.password}
          id="password"
          onChange={onChange}
        />
        <Label htmlFor="passwordcheck">비밀번호 확인</Label>
        <Input
          type="password"
          value={info.passwordcheck}
          id="passwordcheck"
          onChange={onChange}
        />
        {info.password !== info.passwordcheck && (
          <P>비밀번호와 비밀번호 확인이 일치하지 않습니다.</P>
        )}
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          type="text"
          value={info.nickname}
          id="nickname"
          onChange={onChange}
        />
        <Button>회원가입</Button>
      </Form>
    </Popup>
  );
};

const Title = styled.h3`
  font-family: BMHANNAAir;
  font-size: 28px;
  color: #000;
  margin-bottom: 20px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 18px;
  }
`;

const Form = styled.form`
  width: 60%;
  height: 70%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 80%;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  @media (min-width: 320px) and (max-width: 480px) {
    font-size: 12px;
  }
`;

const Input = styled.input`
  width: 100%;
  display: block;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  border-radius: 6px;
  padding: 6px;
  outline: none;
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
`;

const P = styled.p`
  font-size: 13px;
  color: red;
`;

const Button = styled.button`
  border-radius: 4px;
  padding: 6px;
  color: #fff;

  @media (min-width: 320px) and (max-width: 480px) {
    padding: 4px;
  }
`;

export default SignupPopup;
