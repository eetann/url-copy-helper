import { onMessage } from "$lib/message";
import {
	changeIcon,
	copyTextFromServideWorker,
	dictKeys,
	formatDict,
	isDictKey,
} from "$lib/utils";
export default defineBackground(() => {
	// メニューの登録
	chrome.runtime.onInstalled.addListener(() => {
		const parent = chrome.contextMenus.create({
			title: "URL Copy Helper",
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
		// NOTE: chrome.action.openPopup()がRequires policyなので一旦保留
		// https://groups.google.com/a/chromium.org/g/chromium-extensions/c/JNBpvtT4gYI
		//
		// if (command === "popup") {
		// 	await chrome.action.setPopup({ popup: "popup.html" });
		// 	await chrome.action.openPopup();
		// }
		if (isDictKey(command)) {
			await copyTextFromServideWorker(command);
		}
	});

	// アイコン変更の実行
	onMessage("makeChangeIcon", () => {
		changeIcon();
	});
});
