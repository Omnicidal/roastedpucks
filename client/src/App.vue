<template>
    <div id="app">
        <EntryList />
    </div>
</template>

<script lang="ts" setup>
import EntryList from "./components/EntryList.vue";
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    margin: 2rem;
}

h1 {
    margin-bottom: 1.5rem;
}

button {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button.danger {
    background-color: red;
    color: white;
}

button:hover {
    opacity: 0.9;
}
</style>
