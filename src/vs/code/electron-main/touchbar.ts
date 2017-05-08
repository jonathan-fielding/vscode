import { TouchBar } from 'electron';
const { TouchBarSegmentedControl, TouchBarButton, TouchBarSpacer } = TouchBar;

export class VSCodeTouchbar {
	constructor(
		private window
	) {
		this.setInitialTouchbarState();
	}

	private setInitialTouchbarState(): void {
		// Need guidance to whether this is correct way to get window
		const win = this.window.win;

		const newBtn = this.createTouchbarButton('New File', 'workbench.action.files.newUntitledFile');
		const saveBtn = this.createTouchbarButton('Save', 'workbench.action.files.save');

		const actionbar = this.createActionbarSwitcher();

		const touchBar = new TouchBar([
			newBtn,
			saveBtn,
			this.createSpacer(),
			actionbar
		]);

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

	private createSpacer(): void {
		return new TouchBarSpacer({
			size: 'flexible'
		});
	}

	private createActionbarSwitcher(selectedIndex = 0): void {
		//const config = vscode.workspace.getConfiguration('touchbar');

		//console.log(config);

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
				action: 'workbench.view.git',
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

		return new TouchBarSegmentedControl({
			segments,
			selectedIndex,
			change: index => {
				const selected = segments[index];
				this.window.sendWhenReady('vscode:runAction', selected.action);
			}
		});
	}
}