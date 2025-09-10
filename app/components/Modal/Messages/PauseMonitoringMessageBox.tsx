import "./styles.css";

interface IDeleteMessage {
  pause: () => void;
  cancel: () => void;
}

const PauseMessageBox = ({ pause, cancel }: IDeleteMessage) => {
  return (
    <div className="delete-message">
      <h2>Внимание!</h2>
      <p>При изменении последней коробки, все автоматические операции будут приостановлены!</p>
      <h4>Вы уверены?</h4>
      <div className="message__buttons">
        <button className="message__button yes-btn" onClick={pause}>да</button>
        <button className="message__button" onClick={cancel}>Нет</button>
      </div>
    </div>
  );
};

export default PauseMessageBox;
