import type { CategoryData, ExecutableData, DocumentationData } from '@/application/collections/';
import { createScriptDataWithCode } from '@tests/unit/shared/Stubs/ScriptDataStub';

export class CategoryDataStub implements CategoryData {
  public children: readonly ExecutableData[] = [createScriptDataWithCode()];

  public category = 'category name';

  public docs?: DocumentationData;

  public withChildren(children: readonly ExecutableData[]) {
    this.children = children;
    return this;
  }

  public withName(name: string) {
    this.category = name;
    return this;
  }

  public withDocs(docs: DocumentationData) {
    this.docs = docs;
    return this;
  }
}
