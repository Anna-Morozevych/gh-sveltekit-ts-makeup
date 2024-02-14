<script lang="ts">
  import Categories from "$lib/components/Categories.svelte";
  import Logos from '$lib/components/Logos.svelte';
	import type { PageData } from "./$types";

  export let data: PageData;

  const categoriesList = data.data;

</script>

<Categories categories={categoriesList} />
<Logos />