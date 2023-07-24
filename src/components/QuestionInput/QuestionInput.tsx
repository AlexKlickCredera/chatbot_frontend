import { useState } from "react";
import Send from "../../assets/send.svg";
import styles from "./QuestionInput.module.css";

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
    <div className={styles.questionInputContainer}>
      <textarea
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
      />
      <div
        className={styles.questionInputSendButtonContainer}
        role="button"
        tabIndex={0}
        aria-label="Ask question button"
        onClick={sendQuestion}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? sendQuestion() : null
        }
      >
        {sendQuestionDisabled ? (
          <img src={Send} className={styles.questionInputSendButtonDisabled} />
        ) : (
          <img src={Send} className={styles.questionInputSendButton} />
        )}
      </div>
      <div className={styles.questionInputBottomBorder} />
    </div>
  );
};

