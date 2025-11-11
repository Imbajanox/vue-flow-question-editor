<template>
  <div class="custom-node end-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <span class="node-icon">🏁</span>
      <span class="node-title">End</span>
    </div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<style scoped>
.custom-node {
  padding: 15px;
  border-radius: 8px;
  border: 2px solid;
  background: white;
  min-width: 150px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.end-node {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #991b1b;
}

.node-icon {
  font-size: 20px;
}

.node-title {
  font-size: 14px;
}
</style>
