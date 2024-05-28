<script lang="ts">
  import { dictKeys, getCurrentHelper, cn, copyText } from "$lib/utils";
  import type { DictKey, TextDict } from "$lib/utils";
  import Icon from "@iconify/svelte";
  let notice: number | undefined = undefined;
  let textDict: TextDict | undefined = undefined;

  (async () => {
    const helper = await getCurrentHelper();
    textDict = helper.getTextDict();
  })();

  async function onClick(key: DictKey, index: number) {
    await copyText(textDict, key);
    notice = index;
    setTimeout(() => {
      notice = undefined;
    }, 3000);
  }
</script>

<main class="min-w-96 min-h-96 prose">
  <ul class="menu menu-sm">
    {#if textDict != undefined}
      {#each dictKeys as key, index}
        <li>
          <!-- svelte-ignore a11y-autofocus -->
          <button
            type="submit"
            tabindex={index}
            autofocus={index === 0}
            on:click={async () => {
              await onClick(key, index);
            }}
            class="flex justify-between btn"
          >
            <div class="flex flex-col items-start">
              <div class="font-bold">{key}</div>
              <div>{textDict[key].format}</div>
            </div>
            <span
              class={cn(
                "swap",
                notice === index ? "swap-active text-accent" : "",
              )}
            >
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
