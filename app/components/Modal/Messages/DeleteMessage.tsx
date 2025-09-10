import "./styles.css";
import { MessageContent } from "./types";

interface IDeleteMessage {
  content: MessageContent;
  del: () => void;
  cancel: () => void;
}

const DeleteMessage = ({ content, del, cancel }: IDeleteMessage) => {
  return (
    <div className="delete-message">
      <h2>Внимание</h2>
      <p>Вы уверены что хотите удалить {content === MessageContent.Box ? 'коробку' : 'паллету'}?</p>
      <div className="message__buttons">
        <button className="message__button yes-btn" onClick={del}>да</button>
        <button className="message__button" onClick={cancel}>Нет</button>
      </div>
    </div>
  );
};

export default DeleteMessage;
