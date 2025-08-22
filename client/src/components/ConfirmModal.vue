<template>
    <div class="modal-overlay">
        <div class="modal">
            <p>{{ message }}</p>
            <div class="actions">
                <button @click="$emit('cancel')">Cancel</button>
                <button class="danger" @click="$emit('confirm')">Confirm</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{ message: string }>();
defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: white;
    padding: 1rem;
    border-radius: 8px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

.danger {
    background: red;
    color: white;
}
</style>
