import {
	copyText,
	copyTextFromServideWorker,
	dictKeys,
	formatDict,
	getCurrentTab,
	isDictKey,
} from "$lib/utils";
export default defineBackground(() => {
	// メニューの登録
	chrome.runtime.onInstalled.addListener(() => {
		const parent = chrome.contextMenus.create({
			title: "Copy URL Helper",
			id: "parent",
		});
		for (const key of dictKeys) {
			chrome.contextMenus.create({
				title: `${key}: ${formatDict[key]}`,
				id: `${key}`,
				parentId: parent,
			});
		}
	});
	// クリックイベントの定義
	chrome.contextMenus.onClicked.addListener(async (info) => {
		await copyTextFromServideWorker(info.menuItemId);
	});

	// ショートカットキー経由の実行
	chrome.commands.onCommand.addListener(async (command) => {
		if (isDictKey(command)) {
			await copyTextFromServideWorker(command);
		}
	});
});
