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
		if (command === "popup") {
			await chrome.action.setPopup({ popup: "popup.html" });
			chrome.action.openPopup();
		}
		if (isDictKey(command)) {
			await copyTextFromServideWorker(command);
		}
	});

	// アイコン変更の実行
	onMessage("makeChangeIcon", () => {
		changeIcon();
	});
});
