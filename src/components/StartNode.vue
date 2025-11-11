<template>
  <div class="custom-node start-node">
    <div class="node-header">
      <span class="node-icon">🚀</span>
      <span class="node-title">Start</span>
    </div>
    <Handle type="source" :position="Position.Bottom" />
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

.start-node {
  border-color: #10b981;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #065f46;
}

.node-icon {
  font-size: 20px;
}

.node-title {
  font-size: 14px;
}
</style>
