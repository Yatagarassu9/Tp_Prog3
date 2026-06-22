// funciÃ³n que valida si un email tiene formato correcto
// la usamos en el registro antes de intentar crear el usuario
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};