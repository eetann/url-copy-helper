# プライバシー
## 権限が必要な理由
### tabs
chrome.tabs.queryのAPIを使い、現在開いているタブのURLとタイトルを取得するため。
To use the API of chrome.tabs.query to get the URL and title of the currently open tab.

### contextMenus
右クリックから「URLとタイトルのコピー」を実行できるようにするため。
To be able to perform “Copy URL and Title” from right click.

### activeTab
chrome.scripting.executeScriptのAPIを使い、ショートカットキーや右クリックから「URLとタイトルのコピー」を実行できるようにするため。
To be able to use the API of chrome.scripting.executeScript to perform “Copy URL and Title” from a shortcut key or right click.

### scripting
chrome.scripting.executeScriptのAPIを使い、ショートカットキーや右クリックから「URLとタイトルのコピー」を実行できるようにするため。
To be able to use the API of chrome.scripting.executeScript to perform “Copy URL and Title” from a shortcut key or right click.
