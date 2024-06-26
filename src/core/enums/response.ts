export enum HttpStatusCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  // Add more status codes
}

export enum ErrorTitle {
  AUTHENTICATION_ERROR = 'Authentication-related issue',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  LACK_OF_CREDENTIALS = 'Lack of Credentials',
  TOKEN_EXPIRED = 'Expired Access token',
  INVALID_SIGNUP_DATA = 'Invalid Sign-up Data',
  INVALID_SIGNIN_DATA = 'Invalid Sign-in Data',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NOT_FOUND = 'Resource Not Found',
  FORBIDDEN = 'Access Forbidden',
  USER_ALREADY_EXISTS = 'User Already Exists',
  INVALID_EMAIL = 'Invalid Email',
  INVALID_PASSWORD = 'Invalid Password',
  // Add more error types as needed
}

export enum ErrorMessage {
  AUTHENTICATION_ERROR = 'Authentication error. Please provide valid credentials.',
  INVALID_CREDENTIALS = 'Invalid credentials provided. Please try again.',
  LACK_OF_CREDENTIALS = 'The request lacks authentication credentials for the target resource.',
  TOKEN_EXPIRED = 'The token provided has expired. Please obtain a new token to continue accessing the resources.',
  INVALID_SIGNUP_DATA = 'Invalid sign-up data. Please provide valid information for sign-up.',
  INVALID_SIGNIN_DATA = 'Invalid sign-in data. Please provide valid information for sign-in.',
  NOT_FOUND = 'The requested resource could not be found on the server.',
  FORBIDDEN = 'You do not have the necessary permissions to access this resource.',
  USER_ALREADY_EXISTS = 'User with this email or third-party ID already exists.',
  INVALID_EMAIL = 'Invalid email provided. Please provide a valid email address.',
  INVALID_PASSWORD = 'Invalid password provided. Password must be at least 8 characters long and contain both letters and numbers.',
  INTERNAL_SERVER_ERROR = 'An unexpected error occurred on the server. Please try again later or contact support for assistance.',
  // Add more error types as needed
}
