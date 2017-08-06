/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { TouchBar } from 'electron';
const { TouchBarSegmentedControl, TouchBarButton, TouchBarSpacer, TouchBarGroup } = TouchBar;

// shutup typescript
declare var __dirname;

export class CodeTouchbar {
	private touchBar: TouchBar
	private viewActions: TouchBarGroup
	private viewSwitcher: TouchBarSegmentedControl

	constructor(
		private window
	) {
		this.initializeTouchbarState();
		this.window._win.webContents.on('ipc-message', this.listen.bind(this));
	}

	private listen(event, command) {
		const messageType = command[0];

		if (messageType === 'vscode:runAction') {
			const action = command[2];
			console.log('listened', command[2]);

			if (action.includes('workbench.view')) {
				this.setTouchbarState(action);
			}
		}
	}

	private initializeTouchbarState(currentView = 'workbench.view.explorer'): void {
		const items = this.createButtons(currentView);

		this.viewActions = new TouchBarGroup({ items });
		this.viewSwitcher = this.createActionbarSwitcher(currentView);

		this.touchBar = new TouchBar({
			items: [
				this.viewActions,
				this.createSpacer(),
				this.viewSwitcher,
			]
		});

		this.window._win.setTouchBar(this.touchBar);
	}

	private setTouchbarState(currentView = 'workbench.view.explorer'): void {
		const views = [
			'workbench.view.explorer',
			'workbench.view.search',
			'workbench.view.scm',
			'workbench.view.debug',
			'workbench.view.extensions',
		];

		const items = this.createButtons(currentView);
		this.viewActions.child = new TouchBar({ items });
		this.viewSwitcher.selectedIndex = views.indexOf(currentView);

		this.touchBar = new TouchBar({
			items: [
				this.viewActions,
				this.createSpacer(),
				this.viewSwitcher,
			]
		});

		this.window._win.setTouchBar(this.touchBar);
	}

	private createTouchbarButton(label, action): TouchBarButton {
		return new TouchBarButton({
			label: label,
			click: () => {
				this.window.sendWhenReady('vscode:runAction', action);
			}
		});
	}

	private createIconButton(icon, action): TouchBarButton {
		return new TouchBarButton({
			icon: icon,
			click: () => {
				this.window.sendWhenReady('vscode:runAction', action);
			},
			width: 100
		});
	}

	private createButtons(selected): TouchBarButton[] {
		let buttons = [];

		if (selected === 'workbench.view.explorer') {
			buttons.push(this.createTouchbarButton('New File', 'workbench.action.files.newUntitledFile'));
			buttons.push(this.createTouchbarButton('Save', 'workbench.action.files.save'));
		}

		if (selected === 'workbench.view.debug') {
			buttons.push(this.createDebugBar(null));
		}

		return buttons;
	}

	private createSpacer(): TouchBarSpacer {
		return new TouchBarSpacer({
			size: 'flexible'
		});
	}

	private createActionbarSwitcher(selected): TouchBarSegmentedControl {
		const segments = [
			{
				action: 'workbench.view.explorer',
				icon: __dirname + '/../../workbench/parts/touchbar/media/files-touchbar.png'
			},
			{
				action: 'workbench.view.search',
				icon: __dirname + '/../../workbench/parts/touchbar/media/search-touchbar.png'
			},
			{
				action: 'workbench.view.scm',
				icon: __dirname + '/../../workbench/parts/touchbar/media/git-touchbar.png'
			},
			{
				action: 'workbench.view.debug',
				icon: __dirname + '/../../workbench/parts/touchbar/media/debug-touchbar.png'
			},
			{
				action: 'workbench.view.extensions',
				icon: __dirname + '/../../workbench/parts/touchbar/media/extensions-touchbar.png'
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

	private createDebugBar(selected): TouchBarSegmentedControl {
		const segments = [
			{
				action: 'workbench.action.debug.stepOver',
				icon: __dirname + '/../../workbench/parts/touchbar/media/debug-step-over.png'
			},
			{
				action: 'workbench.action.debug.stepInto',
				icon: __dirname + '/../../workbench/parts/touchbar/media/debug-step-into.png'
			},
			{
				action: 'workbench.action.debug.stepOut',
				icon: __dirname + '/../../workbench/parts/touchbar/media/debug-step-out.png'
			},
			{
				action: 'workbench.action.debug.continue',
				icon: __dirname + '/../../workbench/parts/touchbar/media/debug-continue.png'
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