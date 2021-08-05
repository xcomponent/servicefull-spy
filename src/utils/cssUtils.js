export const getCSSVariableValue = (variable) => {
  return getComputedStyle(document.body).getPropertyValue(variable);
};
