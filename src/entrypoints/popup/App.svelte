<script lang="ts">
  import { dictKeys, formatDict, cn, copyText } from "$lib/utils";
  import type { DictKey } from "$lib/utils";
  import Icon from "@iconify/svelte";
  let notice: number | undefined = undefined;

  async function onClick(key: DictKey, index: number) {
    await copyText(key);
    notice = index;
    setTimeout(() => {
      notice = undefined;
    }, 3000);
  }
</script>

<main class="min-w-96 min-h-96 prose">
  <ul class="menu menu-sm">
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
  </ul>
</main>

<style>
</style>
