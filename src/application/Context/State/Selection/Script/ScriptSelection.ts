import type { IEventSource } from '@/infrastructure/Events/IEventSource';
import type { Script } from '@/domain/Executables/Script/Script';
import type { SelectedScript } from './SelectedScript';
import type { ScriptSelectionChangeCommand } from './ScriptSelectionChange';

export interface ReadonlyScriptSelection {
  readonly changed: IEventSource<readonly SelectedScript[]>;
  readonly selectedScripts: readonly SelectedScript[];
  isSelected(scriptId: string): boolean;
}

export interface ScriptSelection extends ReadonlyScriptSelection {
  selectOnly(scripts: readonly Script[]): void;
  selectAll(): void;
  deselectAll(): void;
  processChanges(action: ScriptSelectionChangeCommand): void;
}
