export const validateInput = (
  name: string,
  value: string,
  setErrors: any,
  errors: any
) => {
  let errorMessage = "";

  if (!value.trim()) {
    errorMessage = "Поле обязательно для заполнения";
  }

  // Пример дополнительной проверки для поля name (можете добавить свои правила)
  if (name === "gtin" && value.length !== 14) {
    errorMessage = "должно быть ровно 14 символов";
  }

  // Устанавливаем сообщение об ошибке или очищаем его
  setErrors({
    ...errors,
    [name]: errorMessage,
  });
};

export const validateITF14 = (
  name: string,
  value: string,
  setErrors: any,
  errors: any
) => {
  let errorMessage = "";

  if (value && value.length !== 14) {
    errorMessage = "должно быть ровно 14 символов";
  }

  // Устанавливаем сообщение об ошибке или очищаем его
  setErrors({
    ...errors,
    [name]: errorMessage,
  });
};
