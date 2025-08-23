<template>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Pucks</th>
                <th>Tier</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="entry in entries" :key="entry.id" @click="$emit('select', entry)">
                <td>{{ entry.name }}</td>
                <td>{{ entry.pucks }}</td>
                <td>{{ entry.tier }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
defineProps<{ entries: any[] }>();
defineEmits(["select"]);
</script>