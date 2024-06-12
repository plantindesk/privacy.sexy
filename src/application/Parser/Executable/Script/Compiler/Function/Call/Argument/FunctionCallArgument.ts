import { ensureValidParameterName } from '../../Shared/ParameterNameValidator';
import type { IFunctionCallArgument } from './IFunctionCallArgument';

export class FunctionCallArgument implements IFunctionCallArgument {
  constructor(
    public readonly parameterName: string,
    public readonly argumentValue: string,
  ) {
    ensureValidParameterName(parameterName);
    if (!argumentValue) {
      throw new Error(`Missing argument value for the parameter "${parameterName}".`);
    }
  }
}
