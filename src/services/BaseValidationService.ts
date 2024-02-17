import ValidationError from 'src/errors/ValidationError';

type IValidator = Promise<() => ValidationError | null>

export default abstract class BaseValidationService {
  protected async runValidationInChain(validators: IValidator[]): Promise<ValidationError | null> {
    for await (const validator of validators) {
      const error = validator?.();

      if (error) {
        throw error;
      }
    }

    return null;
  }
}
