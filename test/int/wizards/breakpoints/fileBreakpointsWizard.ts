import { BreakpointWizard } from './breakpointWizard';
import { InternalFileBreakpointsWizard } from './implementation/internalFileBreakpointsWizard';
import { PromiseOrNot } from 'vscode-chrome-debug-core';
import { wrapWithMethodLogger } from '../../core-v2/chrome/logging/methodsCalledLogger';

export interface IBreakpointOptions {
    text: string;
    boundText?: string;
}

export interface IHitCountBreakpointOptions extends IBreakpointOptions {
    hitCountCondition: string;
}

export class FileBreakpointsWizard {
    public constructor(private readonly _internal: InternalFileBreakpointsWizard) { }

    public async hitCountBreakpoint(options: IHitCountBreakpointOptions): Promise<BreakpointWizard> {
        return (await (await this.unsetHitCountBreakpoint(options)).setThenWaitForVerifiedThenValidate());
    }

    public async unsetHitCountBreakpoint(options: IHitCountBreakpointOptions): Promise<BreakpointWizard> {
        return wrapWithMethodLogger(await this._internal.hitCountBreakpoint({
            text: options.text,
            boundText: options.boundText,
            hitCountCondition: options.hitCountCondition,
            name: `BP @ ${options.text}`
        }));
    }

    public batch<T>(batchAction: (fileBreakpointsWizard: FileBreakpointsWizard) => PromiseOrNot<T>): Promise<T> {
        return this._internal.batch(batchAction);
    }

    public toString(): string {
        return `Breakpoints at ${this._internal.filePath}`;
    }
}
