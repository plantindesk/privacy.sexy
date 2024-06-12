declare module '@/application/collections/*' {
  export interface ExecutableContent extends DocumentableData {

  }

  export interface CollectionData {
    readonly os: string;
    readonly scripting: ScriptingDefinitionData;
    readonly actions: ReadonlyArray<CategoryData>;
    readonly functions?: ReadonlyArray<FunctionData>;
  }

  export interface CategoryData extends ExecutableContent {
    readonly children: ReadonlyArray<ExecutableData>;
    readonly category: string;
  }

  export type ExecutableData = CategoryData | ScriptData;
  export type DocumentationData = ReadonlyArray<string> | string | undefined;

  export interface DocumentableData {
    readonly docs?: DocumentationData;
  }

  export interface CodeInstruction {
    readonly code: string;
    readonly revertCode?: string;
  }

  export interface CallInstruction {
    readonly call: FunctionCallsData;
  }

  export type InstructionHolder = CodeInstruction | CallInstruction;

  export interface ParameterDefinitionData {
    readonly name: string;
    readonly optional?: boolean;
  }

  export type FunctionDefinition = {
    readonly name: string;
    readonly parameters?: readonly ParameterDefinitionData[];
  };

  export type CodeFunctionData = FunctionDefinition & CodeInstruction;

  export type CallFunctionData = FunctionDefinition & CallInstruction;

  export type FunctionData = CodeFunctionData | CallFunctionData;

  export interface FunctionCallParametersData {
    readonly [index: string]: string;
  }

  export interface FunctionCallData {
    readonly function: string;
    readonly parameters?: FunctionCallParametersData;
  }

  export type FunctionCallsData = readonly FunctionCallData[] | FunctionCallData | undefined;

  export type ScriptDefinition = ExecutableContent & {
    readonly name: string;
    readonly recommend?: string;
  };

  export type CodeScriptData = ScriptDefinition & CodeInstruction;

  export type CallScriptData = ScriptDefinition & CallInstruction;

  export type ScriptData = CodeScriptData | CallScriptData;

  export interface ScriptingDefinitionData {
    readonly language: string;
    readonly fileExtension: string;
    readonly startCode: string;
    readonly endCode: string;
  }

  const content: CollectionData;
  export default content;
}
