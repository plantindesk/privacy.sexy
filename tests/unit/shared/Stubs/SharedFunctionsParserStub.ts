import type { FunctionData } from '@/application/collections/';
import { sequenceEqual } from '@/application/Common/Array';
import type { ISharedFunctionCollection } from '@/application/Parser/Executable/Script/Compiler/Function/ISharedFunctionCollection';
import type { ISharedFunctionsParser } from '@/application/Parser/Executable/Script/Compiler/Function/ISharedFunctionsParser';
import type { ILanguageSyntax } from '@/application/Parser/Executable/Script/Validation/Syntax/ILanguageSyntax';
import { SharedFunctionCollectionStub } from './SharedFunctionCollectionStub';

export class SharedFunctionsParserStub implements ISharedFunctionsParser {
  public callHistory = new Array<{
    functions: readonly FunctionData[],
    syntax: ILanguageSyntax,
  }>();

  private setupResults = new Array<{
    functions: readonly FunctionData[],
    result: ISharedFunctionCollection,
  }>();

  public setup(functions: readonly FunctionData[], result: ISharedFunctionCollection) {
    this.setupResults.push({ functions, result });
  }

  public parseFunctions(
    functions: readonly FunctionData[],
    syntax: ILanguageSyntax,
  ): ISharedFunctionCollection {
    this.callHistory.push({
      functions: Array.from(functions),
      syntax,
    });
    const result = this.findResult(functions);
    return result || new SharedFunctionCollectionStub();
  }

  private findResult(functions: readonly FunctionData[]): ISharedFunctionCollection | undefined {
    return this.setupResults
      .find((result) => sequenceEqual(result.functions, functions))
      ?.result;
  }
}
