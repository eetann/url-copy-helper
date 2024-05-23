<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cn } from "$lib/utils";
  let notice: number | null = null;

  const url = "https://example";
  const title = "TITLE HERE";
  const richText = `<a href="${url}">${title}</a>`;
  let textList = [
    { name: "Markdown", text: "[title](URL)" },
    { name: "URL only", text: "URL" },
    { name: "HTML", text: "<a href='URL'>title</a>" },
  ];
  async function copyText(text: string, index: number) {
    const item = [
      new window.ClipboardItem({
        "text/html": new Blob([richText], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ];
    await navigator.clipboard.write(item);
    notice = index;
    setTimeout(() => {
      notice = null;
    }, 3000);
  }
</script>

<main class="min-w-96 min-h-96 prose">
  <ul class="menu menu-sm">
    {#each textList as item, index}
      <li>
        <!-- svelte-ignore a11y-autofocus -->
        <button
          type="submit"
          tabindex={index}
          autofocus={index === 0 ? true : false}
          on:click={() => {
            copyText(item.text, index);
          }}
          class="flex justify-between btn"
        >
          <div class="flex flex-col items-start">
            <div class="font-bold">{item.name}</div>
            <div>{item.text}</div>
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
  </ul>
</main>

<style>
</style>
