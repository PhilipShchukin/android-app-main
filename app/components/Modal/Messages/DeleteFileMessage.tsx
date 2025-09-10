import "./styles.css";

interface IDeleteMessage {
  file: string;    
  del: () => void;
  cancel: () => void;
}

const DeleteFileMessage = ({ file, del, cancel }: IDeleteMessage) => {
  return (
    <div className="delete-message">
      <h2>Внимание</h2>
      <p>Вы Хотите удалить файл {file} ?</p>
      <div className="message__buttons">
        <button className="message__button yes-btn" onClick={del}>да</button>
        <button className="message__button" onClick={cancel}>Нет</button>
      </div>
    </div>
  );
};

export default DeleteFileMessage;
