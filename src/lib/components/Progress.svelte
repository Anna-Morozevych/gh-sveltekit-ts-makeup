<script lang="ts">
	import { statusList } from "$lib/data/statusList";
	import { beforeUpdate, onMount } from "svelte";

  export let status: string;

  let progress: Status[];

  
  $:console.log('Progress component status', status);
 

  beforeUpdate(() => {
    let currentStatus = [...statusList].filter(el => el.name === status);
    progress = [...statusList].filter(el => el.step <= currentStatus[0].step)

    console.log(progress);
  })
</script>


<div class="progress">
  {#if progress}
    {#each progress as step}
      <div style="color: {step.color};" title="{step.name}">
        {@html step.icon}
      </div>
      
      {#if progress.length !== step.step}
        <div class="progress__line"></div>
      {/if}
      
    {/each}
  {/if}
</div>


<style>
  .progress {
    display: flex;
    align-items: center;
  }

  .progress__line {
    width: 30px;
    height: 1.5px;
    background-color: black;
    margin: 0 5px;
  }
</style>
