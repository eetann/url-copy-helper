import { copyText, dictKeys, formatDict, getCurrentTab } from "$lib/utils";
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
		const tab = await getCurrentTab();
		if (!tab.id) {
			return;
		}
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			args: [info.menuItemId, tab.title ?? "No Titile", tab.url ?? "No URL"],
			func: copyText,
		});
	});
});
