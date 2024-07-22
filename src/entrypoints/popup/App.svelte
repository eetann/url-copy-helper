<script lang="ts">
  import { sendMessage } from "$lib/message";
  import {
    cn,
    copyText,
    dictKeys,
    formatDict,
    getCurrentTab,
  } from "$lib/utils";
  import type { DictKey } from "$lib/utils";
  import Icon from "@iconify/svelte";
  let notice: number | undefined = undefined;

  async function onClick(key: DictKey, index: number) {
    const tab = await getCurrentTab();
    const result = await copyText(key, tab.title, tab.url);
    if (result) {
      // NOTE: messageにしないと、popupを閉じた時点で
      // アイコンリセットが反映されなくなる
      try {
        // 2024年7月22日時点では、Arcではアイコンの変更ができない
        await sendMessage("makeChangeIcon", undefined);
      } catch (e) {
        console.log(e);
      }
      notice = index;
      setTimeout(() => {
        notice = undefined;
      }, 3000);
    }
  }
</script>

<main class="w-72 min-h-96 prose m-4">
  <div class="flex flex-col gap-2 items-center">
    <div>Any button can be copied as <strong>rich text</strong>.</div>
    <div class="">
      {#each dictKeys as key, index}
        <div class="my-2">
          <!-- svelte-ignore a11y-autofocus -->
          <button
            type="submit"
            tabindex={index}
            autofocus={index === 0}
            on:click={async () => {
              await onClick(key, index);
            }}
            class="my-1 flex justify-between btn btn-wide"
          >
            <div class="flex flex-col items-start">
              <div class="font-bold">{key}</div>
              <div>{formatDict[key]}</div>
            </div>
            <span
              class={cn(
                "swap",
                notice === index ? "swap-active text-accent" : "",
              )}
            >
              <Icon
                class="swap-off"
                icon="fluent:clipboard-arrow-right-24-regular"
                width="28"
                height="28"
              />
              <Icon
                class="swap-on"
                icon="fluent:clipboard-task-24-regular"
                width="28"
                height="28"
              />
            </span>
          </button>
        </div>
      {/each}
    </div>
    <div class="w-64">
      <!-- svelte-ignore missing-declaration -->
      <button
        type="submit"
        class="btn btn-sm"
        tabindex={10}
        on:click={() => {
          chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
        }}
      >
        <Icon icon="fluent:settings-24-regular" width="24" height="24" />
        Shortcuts
      </button>
    </div>
  </div>
</main>

<style>
</style>
