<template>
    <form @submit.prevent="onSubmit" class="space-y-2">
        <input v-model="entry.name" placeholder="Display Name" />
        <input v-model.number="entry.pucks" type="number" placeholder="Pucks" />
        <input v-model="entry.tier" placeholder="Tier" />
        <textarea v-model="entry.notes" placeholder="Notes"></textarea>
        <button type="submit">Save</button>
    </form>
</template>

<script lang="ts" setup>
import { defineEmits } from "vue";

const props = defineProps<{ entry: any }>();
const emit = defineEmits(["save"]);

function onSubmit() {
    emit("save", props.entry);
}
</script>