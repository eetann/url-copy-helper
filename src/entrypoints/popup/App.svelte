<script lang="ts">
  let textList = [
    { name: "Markdown", text: "[title](URL)" },
    { name: "URL only", text: "URL" },
    { name: "HTML", text: "<a href='URL'>title</a>" },
  ];
</script>

<main class="min-w-96 min-h-96 prose">
  <ul class="menu bg-base-200">
    {#each textList as item}
      <li>
        <div class="flex flex-col items-start">
          <div>{item.name}</div>
          <div>{item.text}</div>
        </div>
      </li>
    {/each}
  </ul>
</main>

<style>
</style>
