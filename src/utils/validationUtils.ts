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

export const validatePassword = createValidator(
  (password) => /^(?=.*[a-z])(?=.*\d)(?=.*[~!@$%^&*_])[a-zA-Z\d~!@$%^&*_]{8,}$/.test(password),
  '비밀번호는 최소 8자 이상이어야 하며, 소문자, 숫자, 특수 문자(~!@$%^&*_)를 포함해야 합니다.'
);

export const validateNickName = createValidator(
  (nick) => /^[a-zA-Z0-9가-힣_-]{1,15}$/.test(nick),
  '닉네임은 숫자, 대문자, 소문자, 한글, 밑줄(_), 대시(-)만 포함할 수 있으며, 길이는 1자에서 15자 사이여야 합니다.'
);

export const validatePhoneNumber = createValidator(
  (phoneNumber) => /^01\d{9}$/.test(phoneNumber),
  '전화번호는 01012345678 형식이어야 합니다.'
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
