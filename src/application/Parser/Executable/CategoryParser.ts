import type {
  CategoryData, ScriptData, ExecutableData,
} from '@/application/collections/';
import { CollectionScript } from '@/domain/Executables/Script/CollectionScript';
import { wrapErrorWithAdditionalContext, type ErrorWithContextWrapper } from '@/application/Parser/ContextualError';
import type { Category } from '@/domain/Executables/Category/Category';
import { CollectionCategory } from '@/domain/Executables/Category/CollectionCategory';
import { parseDocs, type DocsParser } from '../DocumentationParser';
import { parseScript, type ScriptParser } from './Script/ScriptParser';
import { createExecutableDataValidator, type ExecutableValidator, type ExecutableValidatorFactory } from './Validation/ExecutableValidator';
import { ExecutableType } from './Validation/ExecutableType';
import type { ICategoryCollectionParseContext } from './Script/ICategoryCollectionParseContext';

let categoryIdCounter = 0;

export function parseCategory(
  category: CategoryData,
  context: ICategoryCollectionParseContext,
  utilities: CategoryParserUtilities = DefaultCategoryParserUtilities,
): Category {
  return parseCategoryRecursively({
    categoryData: category,
    context,
    utilities,
  });
}

interface CategoryParseContext {
  readonly categoryData: CategoryData;
  readonly context: ICategoryCollectionParseContext;
  readonly parentCategory?: CategoryData;
  readonly utilities: CategoryParserUtilities;
}

function parseCategoryRecursively(
  context: CategoryParseContext,
): Category | never {
  const validator = ensureValidCategory(context);
  const children: CategoryChildren = {
    subcategories: new Array<Category>(),
    subscripts: new Array<CollectionScript>(),
  };
  for (const data of context.categoryData.children) {
    parseExecutable({
      data,
      children,
      parent: context.categoryData,
      utilities: context.utilities,
      context: context.context,
    });
  }
  try {
    return context.utilities.createCategory({
      id: categoryIdCounter++,
      name: context.categoryData.category,
      docs: context.utilities.parseDocs(context.categoryData),
      subcategories: children.subcategories,
      scripts: children.subscripts,
    });
  } catch (error) {
    throw context.utilities.wrapError(
      error,
      validator.createContextualErrorMessage('Failed to parse category.'),
    );
  }
}

function ensureValidCategory(
  context: CategoryParseContext,
): ExecutableValidator {
  const category = context.categoryData;
  const validator: ExecutableValidator = context.utilities.createValidator({
    type: ExecutableType.Category,
    self: context.categoryData,
    parentCategory: context.parentCategory,
  });
  validator.assertDefined(category);
  validator.assertValidName(category.category);
  validator.assert(
    () => Boolean(category.children) && category.children.length > 0,
    `"${category.category}" has no children.`,
  );
  return validator;
}

interface CategoryChildren {
  readonly subcategories: Category[];
  readonly subscripts: CollectionScript[];
}

interface ExecutableParseContext {
  readonly data: ExecutableData;
  readonly children: CategoryChildren;
  readonly parent: CategoryData;
  readonly context: ICategoryCollectionParseContext;

  readonly utilities: CategoryParserUtilities;
}

function parseExecutable(context: ExecutableParseContext) {
  const validator: ExecutableValidator = context.utilities.createValidator({
    self: context.data,
    parentCategory: context.parent,
  });
  validator.assertDefined(context.data);
  validator.assert(
    () => isCategory(context.data) || isScript(context.data),
    'Executable is neither a category or a script.',
  );
  if (isCategory(context.data)) {
    const subCategory = parseCategoryRecursively({
      categoryData: context.data,
      context: context.context,
      parentCategory: context.parent,
      utilities: context.utilities,
    });
    context.children.subcategories.push(subCategory);
  } else { // A script
    const script = context.utilities.parseScript(context.data, context.context);
    context.children.subscripts.push(script);
  }
}

function isScript(data: ExecutableData): data is ScriptData {
  return hasCode(data) || hasCall(data);
}

function isCategory(data: ExecutableData): data is CategoryData {
  return hasProperty(data, 'category');
}

function hasCode(data: unknown): boolean {
  return hasProperty(data, 'code');
}

function hasCall(data: unknown) {
  return hasProperty(data, 'call');
}

function hasProperty(
  object: unknown,
  propertyName: string,
): object is NonNullable<object> {
  if (typeof object !== 'object') {
    return false;
  }
  if (object === null) { // `typeof object` is `null`
    return false;
  }
  return Object.prototype.hasOwnProperty.call(object, propertyName);
}

export type CategoryFactory = (
  ...parameters: ConstructorParameters<typeof CollectionCategory>
) => Category;

interface CategoryParserUtilities {
  readonly createCategory: CategoryFactory;
  readonly wrapError: ErrorWithContextWrapper;
  readonly createValidator: ExecutableValidatorFactory;
  readonly parseScript: ScriptParser;
  readonly parseDocs: DocsParser;
}

const DefaultCategoryParserUtilities: CategoryParserUtilities = {
  createCategory: (...parameters) => new CollectionCategory(...parameters),
  wrapError: wrapErrorWithAdditionalContext,
  createValidator: createExecutableDataValidator,
  parseScript,
  parseDocs,
};
