<template>
    <div>
        <div class="menu">
            <Menubar :model="items">
                <template #start>
                    <img width="70" height="70" fill="none" src="../assets/Logo.png" class="h-8">
                    <path d="..." fill="var(--p-primary-color)" />
                    <path d="..." fill="var(--p-text-color)" />
                    </img>
                </template>
                <template #end>
                    <InputText placeholder="Search by name" type="text" class="w-32 sm:w-auto" v-model="search" />
                </template>
            </Menubar>
        </div>
        <Button severity="success" label="+ Add Entry" @click="createNew" class="button" />
        <DataTable showGridlines stripedRows v-model:selection="selectedEntry" :value="filteredEntries"
            selectionMode="single" dataKey="id" :metaKeySelection="false" tableStyle="min-width: 50rem"
            :rowsPerPageOptions="[50, 100, 150, 200]" paginator :rows="50">
            <Column field="name" header="Name" sortable></Column>
            <Column field="pucks" header="Pucks" sortable></Column>
            <Column field="tier" header="Tier" sortable></Column>
        </DataTable>
        <EntryEdit v-if="selectedEntry" :existingIds="existingIds" :entry="selectedEntry" @delete="deleteEntry" @close="selectedEntry = null"
            @saved="fetchEntries" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import EntryEdit from "./EntryEdit.vue";
import type { Entry } from "../types/Entry";

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";

const items = ref([
    {
        label: 'Home',
    },
]);

const search = ref<string>("");
const entries = ref<Entry[]>([]);
const filteredEntries = computed(() => entries.value.filter((e) => e.name.toLowerCase().includes(search.value.toLowerCase())));
const selectedEntry = ref<Entry | null>(null);
const existingIds = computed(() => new Set(entries.value.map(entry => entry.id)));

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
        phone: "",
    };
}

async function deleteEntry(entryId: string) {
    await fetch(`http://localhost:5000/api/entries/${entryId}`, {
        method: "DELETE",
    });
    selectedEntry.value = null;
    fetchEntries();
}

onMounted(fetchEntries);
</script>

<style scoped>
.menu {
    padding-bottom: 30px;
}

.button {
    margin-bottom: 30px;
}
</style>