export const PASSWORD_REGEX = {
  // Uppercase, lowercase, numbers, special characters and length greater than 6
  HIGH: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,

  // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  HIGH2: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,

  // Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  HIGH3: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/,

  // Minimum eight characters, at least one letter and one number
  MEDIUM: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};

export const PASSWORD_MESSAGE = {
  HIGH: 'Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và độ dài lớn hơn 6',
};
