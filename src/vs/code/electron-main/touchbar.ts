/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { TouchBar } from 'electron';
const { TouchBarSegmentedControl, TouchBarButton, TouchBarSpacer } = TouchBar;

export class VSCodeTouchbar {
	constructor(
		private window
	) {
		this.setTouchbarState();
		this.window._win.webContents.on('ipc-message', this.listen.bind(this));
	}

	private listen(event, command) {
		const messageType = command[0];

		if (messageType === 'vscode:runAction') {
			const action = command[2];

			if (action.includes('workbench.view')) {
				this.setTouchbarState(action);
			}
		}
	}

	private setTouchbarState(currentView = 'workbench.view.explorer'): void {
		const newBtn = this.createTouchbarButton('New File', 'workbench.action.files.newUntitledFile');
		const saveBtn = this.createTouchbarButton('Save', 'workbench.action.files.save');

		const buttons = this.createButtons(currentView);
		const actionbar = this.createActionbarSwitcher(currentView);

		const touchBar = new TouchBar(buttons.concat([
			this.createSpacer(),
			actionbar
		]));

		const win = this.window._win;

		win.setTouchBar(touchBar);
	}

	private createTouchbarButton(label, action): void {
		return new TouchBarButton({
			label: label,
			click: () => {
				this.window.sendWhenReady('vscode:runAction', action);
			}
		});
	}

	private createIconButton(icon, action): void {
		return new TouchBarButton({
			icon: icon,
			click: () => {
				this.window.sendWhenReady('vscode:runAction', action);
			},
			width: 100
		});
	}

	private createButtons(selected): void {
		let buttons = [];

		if (selected === 'workbench.view.explorer') {
			buttons.push(this.createTouchbarButton('New File', 'workbench.action.files.newUntitledFile'));
			buttons.push(this.createTouchbarButton('Save', 'workbench.action.files.save'));
		}

		if (selected === 'workbench.view.debug') {
			buttons.push(this.createDebugBar());
		}

		return buttons;
	}

	private createSpacer(): void {
		return new TouchBarSpacer({
			size: 'flexible'
		});
	}

	private createActionbarSwitcher(selected): void {
		const segments = [
			{
				action: 'workbench.view.explorer',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/files-touchbar.png'
			},
			{
				action: 'workbench.view.search',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/search-touchbar.png'
			},
			{
				action: 'workbench.view.scm',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/git-touchbar.png'
			},
			{
				action: 'workbench.view.debug',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/debug-touchbar.png'
			},
			{
				action: 'workbench.view.extensions',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/extensions-touchbar.png'
			}
		];

		const selectedIndex = segments.indexOf(segments.filter((item) => {
			if (item.action === selected) {
				return true;
			}
			return false;
		})[0]);

		return new TouchBarSegmentedControl({
			segments,
			selectedIndex,
			change: index => {
				const selected = segments[index];
				this.window.sendWhenReady('vscode:runAction', selected.action);
			}
		});
	}

	private createDebugBar(selected): void {
		const segments = [
			{
				action: 'workbench.action.debug.stepOver',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/debug-step-over.png'
			},
			{
				action: 'workbench.action.debug.stepInto',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/debug-step-into.png'
			},
			{
				action: 'workbench.action.debug.stepOut',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/debug-step-out.png'
			},
			{
				action: 'workbench.action.debug.continue',
				icon: '/Users/jonathan/Sites/_opensource/vscode/src/vs/workbench/parts/touchbar/media/debug-continue.png'
			}
		];

		const selectedIndex = segments.indexOf(segments.filter((item) => {
			if (item.action === selected) {
				return true;
			}
			return false;
		})[0]);

		return new TouchBarSegmentedControl({
			segments,
			selectedIndex,
			segmentStyle: 'separated',
			change: index => {
				const selected = segments[index];
				this.window.sendWhenReady('vscode:runAction', selected.action);
			}
		});
	}
}