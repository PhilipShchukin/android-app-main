import "./styles.css";

const RootMessage = ({ message }: { message: string }) => {
  return (
    <div className="create-message">
      <p>{message}</p>
    </div>
  );
};

export default RootMessage;
