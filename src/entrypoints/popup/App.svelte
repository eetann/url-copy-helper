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
              <!-- fluent:clipboard-arrow-right-24-regular -->
              <svg
                class="swap-off"
                xmlns="http://www.w3.org/2000/svg"
                width="28px"
                height="28px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M13.75 2a2.25 2.25 0 0 1 2.236 2.002V4h1.764A2.25 2.25 0 0 1 20 6.25v5.248a6.5 6.5 0 0 0-1.5-.422V6.25a.75.75 0 0 0-.75-.75h-2.129c-.404.603-1.091 1-1.871 1h-3.5c-.78 0-1.467-.397-1.871-1H6.25a.75.75 0 0 0-.75.75v13.5c0 .414.336.75.75.75h5.482A6.5 6.5 0 0 0 12.81 22H6.25A2.25 2.25 0 0 1 4 19.75V6.25A2.25 2.25 0 0 1 6.25 4h1.764a2.25 2.25 0 0 1 2.236-2zm2.245 2.096L16 4.25q0-.078-.005-.154M13.75 3.5h-3.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5m9.25 14a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0m-8.5-.5a.5.5 0 0 0 0 1h4.793l-1.647 1.646a.5.5 0 0 0 .708.708l2.5-2.5a.5.5 0 0 0 0-.708l-2.5-2.5a.5.5 0 0 0-.708.708L19.293 17z"
                ></path>
              </svg>
              <!-- fluent:clipboard-task-24-regular -->
              <svg
                class="swap-on"
                xmlns="http://www.w3.org/2000/svg"
                width="28px"
                height="28px"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M17.03 11.03a.75.75 0 1 0-1.06-1.06L11 14.94l-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0zm-1.036-6.946A2.25 2.25 0 0 0 13.75 2h-3.5a2.25 2.25 0 0 0-2.236 2H6.25A2.25 2.25 0 0 0 4 6.25v13.5A2.25 2.25 0 0 0 6.25 22h11.5A2.25 2.25 0 0 0 20 19.75V6.25A2.25 2.25 0 0 0 17.75 4h-1.764zm0 .012L16 4.25q0-.078-.005-.154M10.25 6.5h3.5c.78 0 1.467-.397 1.871-1h2.129a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H6.25a.75.75 0 0 1-.75-.75V6.25a.75.75 0 0 1 .75-.75h2.129c.404.603 1.091 1 1.871 1m0-3h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      {/each}
    </div>
    {#if !import.meta.env.FIREFOX}
      <div class="w-64">
        <!-- svelte-ignore missing-declaration -->
        <button
          type="submit"
          class="btn btn-sm"
          tabindex={10}
          on:click={() => {
            if (import.meta.env.FIREFOX) {
              browser.tabs.create({ url: "about:addons" });
            } else {
              browser.tabs.create({ url: "browser://extensions/shortcuts" });
            }
          }}
        >
          <!-- fluent:settings-24-regular -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.927 1.116l1.4-.615a.75.75 0 0 1 .85.174a9.8 9.8 0 0 1 2.205 3.792a.75.75 0 0 1-.272.825l-1.241.916a1.38 1.38 0 0 0 0 2.226l1.243.915a.75.75 0 0 1 .272.826a9.8 9.8 0 0 1-2.204 3.792a.75.75 0 0 1-.849.175l-1.406-.617a1.38 1.38 0 0 0-1.926 1.114l-.17 1.526a.75.75 0 0 1-.571.647a9.5 9.5 0 0 1-4.406 0a.75.75 0 0 1-.572-.647l-.169-1.524a1.382 1.382 0 0 0-1.925-1.11l-1.406.616a.75.75 0 0 1-.85-.175a9.8 9.8 0 0 1-2.203-3.796a.75.75 0 0 1 .272-.826l1.243-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.272-.826a9.8 9.8 0 0 1 2.205-3.792a.75.75 0 0 1 .85-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65q1.074-.238 2.201-.252m0 1.5a9 9 0 0 0-1.354.117l-.11.977A2.886 2.886 0 0 1 6.526 7.17l-.899-.394A8.3 8.3 0 0 0 4.28 9.092l.797.587a2.88 2.88 0 0 1 .001 4.643l-.799.588c.32.842.776 1.626 1.348 2.322l.905-.397a2.882 2.882 0 0 1 4.017 2.318l.109.984c.89.15 1.799.15 2.688 0l.11-.984a2.88 2.88 0 0 1 4.018-2.322l.904.396a8.3 8.3 0 0 0 1.348-2.318l-.798-.588a2.88 2.88 0 0 1-.001-4.643l.797-.587a8.3 8.3 0 0 0-1.348-2.317l-.897.393a2.884 2.884 0 0 1-4.023-2.324l-.109-.976a9 9 0 0 0-1.334-.117M12 8.25a3.75 3.75 0 1 1 0 7.5a3.75 3.75 0 0 1 0-7.5m0 1.5a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5"
            ></path>
          </svg>
          Shortcuts
        </button>
      </div>
    {/if}
  </div>
</main>

<style>
</style>
