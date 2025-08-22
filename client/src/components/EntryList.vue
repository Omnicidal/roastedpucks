<template>
    <div>
        <h2>Entries</h2>
        <button @click="createNew">+ Add Entry</button>

        <EntryTable :entries="entries" @select="editEntry" />

        <EntryEdit v-if="selectedEntry" :entry="selectedEntry" @close="selectedEntry = null" @saved="fetchEntries" />

        <ConfirmModal v-if="entryToDelete" :message="`Delete entry ${entryToDelete.name}?`" @confirm="deleteEntry"
            @cancel="entryToDelete = null" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import EntryTable from "./EntryTable.vue";
import EntryEdit from "./EntryEdit.vue";
import ConfirmModal from "./ConfirmModal.vue";
import type { Entry } from "../types/Entry";

const entries = ref<Entry[]>([]);
const selectedEntry = ref<Entry | null>(null);
const entryToDelete = ref<Entry | null>(null);

async function fetchEntries() {
    const res = await fetch("http://localhost:5000/api/entries");
    entries.value = await res.json();
}

function createNew() {
    selectedEntry.value = {
        id: crypto.randomUUID(),
        name: "",
        pucks: 0,
        tier: "",
        notes: "",
    };
}

function editEntry(entry: Entry) {
    selectedEntry.value = { ...entry };
}

function confirmDelete(entry: Entry) {
    entryToDelete.value = entry;
}

async function deleteEntry() {
    if (!entryToDelete.value) return;
    await fetch(`http://localhost:5000/api/entries/${entryToDelete.value.id}`, {
        method: "DELETE",
    });
    entryToDelete.value = null;
    fetchEntries();
}

onMounted(fetchEntries);
</script>
