<template>
    <table>
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Pucks</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="entry in entries" :key="entry.id" @click="$emit('select', entry)">
                <td>{{ entry.id }}</td>
                <td>{{ entry.displayName }}</td>
                <td>{{ entry.pucks }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts" setup>
defineProps<{ entries: any[] }>();
defineEmits(["select"]);
</script>