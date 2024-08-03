export interface ValidationResult {
  isValid: boolean;
  message: string;
}

type ValidationFunction = (value: string) => ValidationResult;

export const createValidator = (
  validateFn: (value: string) => boolean,
  errorMessage: string,
): ValidationFunction => {
  return (value: string): ValidationResult => ({
    isValid: validateFn(value),
    message: validateFn(value) ? '' : errorMessage,
  });
};

// 로그인 유효성 검사
export const validateEmail = createValidator(
  (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email),
  '유효한 이메일 주소를 입력해주세요.',
);

export const validatePassword = (password: string): ValidationResult => {
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
    return {
      isValid: false,
      message: '비밀번호는 최소 8자 이상이어야 합니다.',
    };
  } else if (passwordStrength < 3) {
    return {
      isValid: false,
      message:
        '비밀번호는 대문자, 소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.',
    };
  }
  return { isValid: true, message: '' };
};

export const validateNickName = createValidator(
  (nick) =>
    nick.length >= 2 && nick.length <= 20 && /^[a-zA-Z0-9가-힣]+$/.test(nick),
  '닉네임은 2-20자 사이여야 하며, 특수문자를 포함할 수 없습니다.',
);

export const validatePhoneNumber = createValidator(
  (phoneNumber) => /^\d{10,11}$/.test(phoneNumber),
  '전화번호는 10-11자리의 숫자만 입력 가능합니다.',
);

// 의뢰 유효성검사
export const validateSize = createValidator(
  (size) => !isNaN(Number(size)) && Number(size) > 0,
  '크기는 양수여야 합니다.',
);

export const validateHouseType = createValidator(
  (houseType) => houseType.length > 0,
  '집 유형을 입력해주세요.',
);

export const validateCleanType = createValidator(
  (cleanType) => cleanType.length > 0,
  '청소 유형을 입력해주세요.',
);

export const validateDesiredDate = createValidator(
  (date) => !isNaN(Date.parse(date)),
  '유효한 날짜를 입력해주세요.',
);

export const validateSignificant = createValidator(
  (significant) => significant.length > 0 && significant.length <= 500,
  '특이사항은 500자 이내로 입력해주세요.',
);
