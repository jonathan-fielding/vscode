import { TOUCHBAR_BUTTON_BACKGROUND } from 'vs/workbench/common/theme';

import { IWindowsMainService } from 'vs/code/electron-main/windows';
import { isMacintosh } from 'vs/base/common/platform';
import { TouchBar } from 'electron';
const {TouchBarButton} = TouchBar;

export class VSCodeTouchbar {
	constructor(
		@IWindowsMainService private windowsService: IWindowsMainService
	) {
		if (isMacintosh) {
			this.setInitialTouchbarState();
		}
	}

	private setInitialTouchbarState(): void {
		// Need guidance to whether this is correct way to get window
		const win = this.windowsService.getLastActiveWindow()._win;

		const newBtn = this.createTouchbarButton('New File', 'workbench.action.files.newUntitledFile');
		const saveBtn = this.createTouchbarButton('Save', 'workbench.action.files.save');

		const touchBar = new TouchBar([
			newBtn,
			saveBtn
		]);

		win.setTouchBar(touchBar);
	}

	private createTouchbarButton(label, action): void {
		console.log(TOUCHBAR_BUTTON_BACKGROUND);

		return new TouchBarButton({
			label: label,
			backgroundColor: '',
			click: () => {
				this.windowsService.sendToFocused('vscode:runAction', action);
			}
		});
	}
}