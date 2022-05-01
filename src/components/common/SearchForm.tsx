import styled from "styled-components";
import { ImSearch } from "react-icons/im";

type PropsType = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  val: string;
};

const SearchForm: React.FC<PropsType> = ({ onChange, onSubmit, val }) => {
  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="게시판 제목"
          value={val}
          onChange={onChange}
        />
        <Btn>
          <ImSearch />
        </Btn>
      </Form>
    </div>
  );
};

export default SearchForm;

const Form = styled.form`
  width: 100%;
  height: 32px;
  ${(props) => props.theme.displayFlex}
  text-align: center;
`;

const Input = styled.input`
  width: 50%;
  height: 100%;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  padding: 4px;
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
  @media (min-width: 320px) and (max-width: 480px) {
    width: 60%;
  }
`;

const Btn = styled.button`
  height: 100%;
  border: 1px solid transparent;
  font-size: 20px;
  padding: 4px;
  background: ${(props) => props.theme.colors.button};
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;
