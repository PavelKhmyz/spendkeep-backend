const ServiceType = {
  UserService: Symbol('UserService'),
  EmailService: Symbol('EmailService'),
  RedisService: Symbol('RedisService'),
  AccountService: Symbol('AccountService'),
  AccountRegistrationService: Symbol('AccountRegistrationService'),
  EmailVerificationService: Symbol('EmailVerificationService'),
};

export default ServiceType;
