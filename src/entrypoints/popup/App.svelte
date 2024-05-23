<script lang="ts">
  let textList = [
    { name: "Markdown", text: "[title](URL)" },
    { name: "URL only", text: "URL" },
    { name: "HTML", text: "<a href='URL'>title</a>" },
  ];
</script>

<main class="min-w-96 min-h-96 prose">
  <ul class="menu menu-sm bg-base-200">
    {#each textList as item, index}
      <li>
        <!-- svelte-ignore a11y-autofocus -->
        <button
          class="flex flex-col items-start"
          tabindex={index}
          autofocus={index === 0 ? true : false}
        >
          <div class="font-bold">{item.name}</div>
          <div>{item.text}</div>
        </button>
      </li>
    {/each}
  </ul>
</main>

<style>
</style>
