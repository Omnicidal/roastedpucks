<template>
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }"
        @update:visible="checkForClose">
        <div class="edit-card" v-if="!pendingDelete">
            <form @submit.prevent="save(entry)">
                <InputText v-model="entry.name" placeholder="Display Name" class="input" />
                <InputMask id="phone" v-model="entry.phone" mask="(999) 999-9999" placeholder="(999) 999-9999" fluid class="input" />
                <Select v-model="entry.tier" :options="tiers" :optionLabel="(t) => t" placeholder="Select a Tier"
                    checkmark :highlightOnSelect="false" class="w-full md:w-56 input" />
                <InputNumber v-model="entry.pucks" inputId="minmax-buttons" showButtons :min="min" :max="max" fluid
                    class="input" />
                <Textarea v-model="entry.notes" placeholder="Notes" rows="3" cols="24" class="input" />
            </form>

            <div class="actions">
                <Button severity="secondary" label="Cancel" @click="$emit('close')" class="left" />
                <Button severity="success" label="Save" @click="save(localEntry)" />
                <img src="../assets/red-trash-can-icon.png" v-if="alreadyExists" @click="pendingDelete = true"
                    class="delete" />
            </div>

        </div>
        <div v-else>
            <div>
                <span>
                    Are you sure you want to delete this entry?
                </span>
            </div>
            <br />
            <Button label="Cancel" severity="secondary" @click="pendingDelete = false" class="left" />
            <Button label="Delete" severity="danger" @click="$emit('delete', localEntry.id)" />
        </div>
    </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { Entry } from "../types/Entry";


import Select from 'primevue/select';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';

const props = defineProps<{ entry: Entry, existingIds: Set<string> }>();
const emit = defineEmits(["saved", "close", "delete"]);
const visible = true

const localEntry = ref<Entry>({ ...props.entry });
const alreadyExists = computed(() => props.existingIds.has(props.entry.id));
const pendingDelete = ref(false);

const tiers = ['Gold', 'Diamond', 'Platinum']
const pucks = computed(() => {
    switch (localEntry.value.tier) {
        case 'Gold':
            return [1, 2];
        case 'Diamond':
            return [3, 4];
        case 'Platinum':
            return [5, 6];
        default:
            return [];
    }
})

const min = computed(() => pucks.value[0] ?? 0);
const max = computed(() => pucks.value[pucks.value.length - 1] ?? 0);

watch(
    () => props.entry,
    (newVal) => {
        localEntry.value = { ...newVal };
    },
    { deep: true }
);

watch(() => props.entry.tier, (newTier) => {
    props.entry.pucks = pucks.value[0];
});

function checkForClose(val: boolean) {
    if (!val) {
        emit("close");
    }
}

async function save(entry: Entry) {
    const method = alreadyExists.value ? "PUT" : "POST";
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

<style scoped>
.edit-card {
    position: relative
}

.input {
    margin-bottom: 10px;
    width: 100%;
}

.left {
    margin-right: 10px;
}

.delete {
    position: absolute;
    bottom: 0px;
    right: 0px;

    width: 22px;
    height: 30px;

    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
}
</style>