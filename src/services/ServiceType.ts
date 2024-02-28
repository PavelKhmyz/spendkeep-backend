const ServiceType = {
  UserService: Symbol('UserService'),
  EmailService: Symbol('EmailService'),
  RedisService: Symbol('RedisService'),
  AccountService: Symbol('AccountService'),
  AccountRegistrationService: Symbol('AccountRegistrationService'),
  EmailVerificationService: Symbol('EmailVerificationService'),
  SessionService: Symbol('SessionService'),
  WalletService: Symbol('WalletService'),
  CategoryValidationService: Symbol('CategoryValidationService'),
  CategoriesService: Symbol('CategoriesService'),
};

export default ServiceType;
