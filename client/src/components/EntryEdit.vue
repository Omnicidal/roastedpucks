<template>
    <div class="edit-card">
        <h3>Edit Entry</h3>
        <EntryForm :entry="localEntry" @save="save" />

        <div class="actions">
            <button @click="$emit('close')">Cancel</button>
            <button class="danger" @click="$emit('delete', localEntry)">Delete</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import EntryForm from "./EntryForm.vue";
import type { Entry } from "../types/Entry";

const props = defineProps<{ entry: Entry }>();
const emit = defineEmits(["saved", "close", "delete"]);

const localEntry = ref<Entry>({ ...props.entry });

watch(
    () => props.entry,
    (newVal) => {
        localEntry.value = { ...newVal };
    },
    { deep: true }
);

async function save(entry: Entry) {
    const method = props.entry.name ? "PUT" : "POST";
    const url =
        method === "POST"
            ? "http://localhost:5000/api/entries"
            : `http://localhost:5000/api/entries/${entry.id}`;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
    });

    emit("saved");
    emit("close");
}
</script>
