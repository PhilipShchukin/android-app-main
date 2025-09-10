import "./styles.css";

const ErrorMessage = () => {
  return (
    <div className="error-message">
      <h2>Ошибка</h2>
      <p>Поля обязательные для заполнения выделены красной рамкой</p>
    </div>
  );
};

export default ErrorMessage;
