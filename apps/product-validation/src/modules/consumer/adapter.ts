import {
  ValidateRollbackInput,
  ValidateRollbackOutput,
} from '@/core/validation/use-cases/validation-rollback';
import {
  ValidationSuccessInput,
  ValidationSuccessOutput,
} from '@/core/validation/use-cases/validation-success';
import { IUsecase } from '@/utils/usecase';

export abstract class IValidationSuccessAdapter implements IUsecase {
  abstract execute(
    input: ValidationSuccessInput,
  ): Promise<ValidationSuccessOutput>;
}

export abstract class IValidateRollbackAdapter implements IUsecase {
  abstract execute(
    input: ValidateRollbackInput,
  ): Promise<ValidateRollbackOutput>;
}
