import { useState } from "react";
import Send from "../../assets/send.svg";
import styled, { css } from "styled-components";

const QuestionInputContainer = styled.div`
    height: 100px;
    position: absolute;
    left: 6.5%;
    right: 5%;
    top: 0%;
    bottom: 0%;
    background: #FFFFFF;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
`;

const QuestionInputTextArea = styled.textarea`
    width: 100%;
    line-height: 40px;
    padding-top: 10px;
    padding-bottom: 8px;
    padding-left: 12px;
    padding-right: 0px;
    resize: none;
`;

const QuestionInputSendButtonContainer = styled.div`
    position: absolute;
    right: -54px;
    bottom: 0px;
    cursor: pointer;

    &:hover {
        transform: scale(1.08);
    }
`;

const QuestionInputSendButton = styled.img<{disabled: boolean}>`
    width: 30px;
    height: 30px;
    background-color: var(--credera_blue);
    ${({disabled}) => disabled && css`
        background: rgb(73, 106, 134);
        border-radius: 30%;
        color: var(--credera_blue);
    `}
`;

const QuestionInputBottomBorder = styled.div`
    position: absolute;
    width: 101.5%;
    height: 4px;
    left: 0%;
    bottom: 0%;
    background: radial-gradient(106.04% 106.06% at 100.1% 90.19%,var(--credera_blue) 70.63%,var(--credera_orange) 70%);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
`;

const QuestionInputOptionsButton = styled.button`
    cursor: pointer;
    width: 27px;
    height: 30px;
`;

const QuestionField = styled.div`
    width: calc(100% - 6.25%);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12);
`;

interface Props {
  onSend: (question: string) => void;
  disabled: boolean;
  placeholder?: string;
  clearOnSend?: boolean;
}

export const QuestionInput = ({
  onSend,
  disabled,
  placeholder,
  clearOnSend,
}: Props) => {
  const [question, setQuestion] = useState<string>("");

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return;
    }

    onSend(question);

    if (clearOnSend) {
      setQuestion("");
    }
  };

  const onEnterPress = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      sendQuestion();
    }
  };

  const onQuestionChange = (
    ev: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setQuestion(ev.target.value || "");
  };

  const sendQuestionDisabled = disabled || !question.trim();

  return (
    <QuestionInputContainer>
      <QuestionInputTextArea
        placeholder={placeholder}
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
      />
      <QuestionInputSendButtonContainer
        role="button"
        tabIndex={0}
        aria-label="Ask question button"
        onClick={sendQuestion}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? sendQuestion() : null
        }
      >
        <QuestionInputSendButton disabled={sendQuestionDisabled} src={Send} />
      </QuestionInputSendButtonContainer>
      <QuestionInputBottomBorder />
    </QuestionInputContainer>
  );
};