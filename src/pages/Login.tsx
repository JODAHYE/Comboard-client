import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import SignupPopup from "../components/auth/SignupPopup";
import { RootState } from "../app/store";
import { onPopupClick } from "../features/menuSlice";
import { kakaoLogin, login } from "../features/userSlice";
import { useUser } from "../hooks/useUser";

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { kakaoLoginUrl } = useUser();

  const { onPopup } = useSelector((state: RootState) => state.menu);

  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const code = location.search.substring(6);
    if (code) {
      dispatch(kakaoLogin(code));
    }
  }, []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      setInfo({
        ...info,
        [target.name]: target.value,
      });
    },
    [info]
  );

  const onLogin = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!info.email || !info.password) {
        return alert("값을 입력해주세요");
      }
      dispatch(login(info));
    },
    [info, dispatch]
  );

  const onSignup = useCallback(() => {
    dispatch(onPopupClick("signup"));
  }, [dispatch]);

  const KaKaoLogin = useCallback(() => {
    window.location.href = kakaoLoginUrl;
  }, []);

  return (
    <Wrap>
      <Logo src="../../../icon/mainlogo.png" alt="로고" />
      <Form onSubmit={onLogin}>
        <Input
          type="email"
          value={info.email}
          name="email"
          placeholder="이메일"
          onChange={onChange}
        />
        <Input
          type="password"
          value={info.password}
          placeholder="비밀번호"
          name="password"
          onChange={onChange}
        />
        <Buttons>
          <Button>로그인</Button>
          <SignupButton type="button" onClick={onSignup}>
            회원가입
          </SignupButton>
        </Buttons>
      </Form>
      {onPopup === "signup" && <SignupPopup />}
      <SocialLoginBox>
        <KaKaoLoginButton onClick={KaKaoLogin}>
          <KaKaoLogo src="../../../icon/kakaologo.svg" />
          카카오로 로그인
        </KaKaoLoginButton>
      </SocialLoginBox>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  ${(props) => props.theme.displayFlex}
  flex-direction: column;
  gap: 10px;
  padding: 50px 0;
`;
const Logo = styled.img`
  width: 150px;
  object-fit: contain;
`;

const Form = styled.form`
  position: relative;
  width: 40%;
  height: 126px;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 80%;
  }
`;

const Input = styled.input`
  width: 100%;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  border-radius: 6px;
  padding: 6px;
  margin-bottom: 10px;
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  font-size: 0.875rem;
  border-radius: 4px;
  color: #fff;
`;

const SignupButton = styled.button`
  font-size: 0.875rem;
  background: #fff;
  &:hover {
    color: ${(props) => props.theme.colors.button};
  }
`;

const SocialLoginBox = styled.div`
  width: 90%;
  position: relative;
  border-top: 1px solid ${(props) => props.theme.colors.shadow};
  padding: 30px 0;
  margin-top: 30px;
  &::before {
    content: "sns 간편 로그인";
    position: absolute;
    top: 0;
    left: 50%;
    padding: 10px;
    background: #fff;
    transform: translate(-50%, -50%);
  }
`;

const KaKaoLoginButton = styled.button`
  width: auto;
  ${(props) => props.theme.displayFlex};
  gap: 16px;
  justify-content: space-around;

  border-radius: 6px;
  background: #ffe812;
  margin: 0 auto;
  padding: 10px;

  &:active {
    background: #ffe812;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    padding: 8px;
  }
`;

const KaKaoLogo = styled.img`
  width: 24px;
`;

export default Login;
