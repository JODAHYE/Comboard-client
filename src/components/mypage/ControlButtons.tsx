import styled from "styled-components";

type PropsType = {
  onPrev: () => void;
  onNext: () => void;
  onDelete: () => void;
  text?: string;
};

const ControlButtons = ({ onPrev, onNext, onDelete, text }: PropsType) => {
  return (
    <Control>
      <div>
        <Button onClick={onPrev}>
          <Icon src="icon/arrow-left.svg" alt="이전" />
        </Button>
        <Button onClick={onNext}>
          <Icon src="icon/arrow-right.svg" alt="다음" />
        </Button>
      </div>
      <DeleteBtn onClick={onDelete}>{text}</DeleteBtn>
    </Control>
  );
};

const Control = styled.div`
  ${(props) => props.theme.displayFlex};
  margin-top: 30px;
`;

const Button = styled.button`
  all: unset;
  cursor: pointer;
  width: 30px;
`;

const Icon = styled.img``;

const DeleteBtn = styled.button`
  color: #fff;
  background: ${(props) => props.theme.colors.button};
  border-radius: 5px;
  padding: 4px;
  &:active {
    background: ${(props) => props.theme.colors.buttonActive};
  }
`;

export default ControlButtons;
