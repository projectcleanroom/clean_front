export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email) ? "" : "유효한 이메일 주소를 입력해주세요.";
};

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);

  const passwordStrength = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasNonalphas,
  ].filter(Boolean).length;

  if (password.length < minLength) {
    return "비밀번호는 최소 8자 이상이어야 합니다.";
  } else if (passwordStrength < 3) {
    return "비밀번호는 대문자, 소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.";
  }
  return "";
};

export const validateNick = (nick) => {
  if (nick.length < 2 || nick.length > 20) {
    return "닉네임은 2-20자 사이여야 합니다.";
  }
  if (!/^[a-zA-Z0-9가-힣]+$/.test(nick )) {
    return "닉네임은 특수문자를 포함할 수 없습니다.";
  }
  return "";
};

export const validatePhone_number = (phone_number) => {
  if (!/^\d{10,11}$/.test(phone_number)) {
    return "전화번호는 10-11자리의 숫자만 입력 가능합니다.";
  }
  return "";
};