export const validateDate = (
  name: string,
  value: string,
  setErrors: any,
  errors: any
) => {
  let errorMessage = "";

  if (!value) {
    errorMessage = "укажите дату";
  }

  // Устанавливаем сообщение об ошибке или очищаем его
  setErrors({
    ...errors,
    [name]: errorMessage,
  });
};
