import styled from "styled-components";

type PropsType = {
  onChangeSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  val: string;
};

const SearchForm = ({ onChangeSearchInput, onSubmit, val }: PropsType) => {
  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="게시판 제목"
          value={val}
          onChange={onChangeSearchInput}
        />
        <Button>
          <Icon src="icon/search.svg" alt="검색" />
        </Button>
      </Form>
    </div>
  );
};

const Form = styled.form`
  width: 50vw;
  max-width: 100%;
  height: 32px;

  ${(props) => props.theme.displayFlex}
  text-align: center;
  @media (min-width: 320px) and (max-width: 480px) {
    width: 80vw;
  }
`;

const Input = styled.input`
  width: 90%;
  height: 100%;

  outline: none;
  border: 1px solid ${(props) => props.theme.colors.shadow};
  padding: 4px;
  border-radius: 10px 0 0 10px;
  &:focus {
    border: 1px solid ${(props) => props.theme.colors.buttonActive};
  }
`;

const Button = styled.button`
  height: 100%;
  width: 32px;
  border-radius: 0 10px 10px 0;
`;

const Icon = styled.img`
  ${(props) => props.theme.iconColorWhite}
`;

export default SearchForm;
