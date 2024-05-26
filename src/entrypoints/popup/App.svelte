<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cn, CopyUrlHelper } from "$lib/utils";
  import type { TextDict } from "$lib/utils";
  let notice: number | undefined = undefined;
  let textDict: TextDict | undefined = undefined;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const title = currentTab.title ?? "No Titile";
    const url = currentTab.url ?? "No URL";
    const helper = new CopyUrlHelper(title, url);
    textDict = helper.getTextDict();
  });

  async function copyText(key: string, index: number) {
    if (!textDict) {
      return;
    }
    const text = textDict[key].text;
    const item = [
      new window.ClipboardItem({
        "text/html": new Blob([textDict.html.text], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ];
    await navigator.clipboard.write(item);
    notice = index;
    setTimeout(() => {
      notice = undefined;
    }, 3000);
  }
</script>

<main class="min-w-96 min-h-96 prose">
  <ul class="menu menu-sm">
    {#if textDict != undefined}
      {#each Object.keys(textDict) as key, index}
        <li>
          <!-- svelte-ignore a11y-autofocus -->
          <button
            type="submit"
            tabindex={index}
            autofocus={index === 0 ? true : false}
            on:click={() => {
              if (!textDict) {
                return;
              }
              copyText(key, index);
            }}
            class="flex justify-between btn"
          >
            <div class="flex flex-col items-start">
              <div class="font-bold">{textDict[key].name}</div>
              <div>{textDict[key].format}</div>
            </div>
            <span class={cn("swap", notice === index ? "swap-active" : "")}>
              <Icon
                class="swap-off"
                icon="heroicons-outline:clipboard-copy"
                width="28"
                height="28"
              />
              <Icon
                class="swap-on"
                icon="heroicons-outline:clipboard-check"
                width="28"
                height="28"
              />
            </span>
          </button>
        </li>
      {/each}
    {/if}
  </ul>
</main>

<style>
</style>
