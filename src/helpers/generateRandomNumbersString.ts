export const generateRandomNumbersString = (length: number): string => {
  const verificationCode: number[] = [];

  for (let i = 0; i < length; i++){
    verificationCode.push(Math.floor(Math.random() * 10));
  }

  return verificationCode.join('');
};
