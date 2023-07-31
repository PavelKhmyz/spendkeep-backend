import { MongoError } from 'mongodb';
import DuplicatedRecordError from '../../errors/DuplicatedRecordError';
import { MongoErrorCode } from '../../constants/MongoErrorCode';

const isDuplicatedMongoError = (err: Error) => {
  return err instanceof MongoError && err.code === MongoErrorCode.DuplicatedErrorCode;
};

const createDuplicatedMongoErrorHandler = <Response, Args extends unknown[]>(callback: (...args: Args) => Response) => {
  return async (...args: Args) => {
    try {
      return await callback(...args);
    } catch (err) {
      if (isDuplicatedMongoError(err)) {
        throw new DuplicatedRecordError();
      }

      throw err;
    }
  };
};

export default createDuplicatedMongoErrorHandler;
