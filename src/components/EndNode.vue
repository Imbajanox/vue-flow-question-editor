<template>
  <div class="custom-node end-node">
    <Handle type="target" :position="Position.Left" />
    <div class="node-header">
      <span class="node-icon">🏁</span>
      <span class="node-title">End</span>
      <button v-if="data?.onDelete" @click.stop="data.onDelete" class="delete-btn" title="Delete node">×</button>
    </div>
  </div>
</template>

<script setup>
import { Handle, Position, useNode } from '@vue-flow/core'

const { node } = useNode()
const data = node.data
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
  position: relative;
}

.node-icon {
  font-size: 20px;
}

.node-title {
  font-size: 14px;
}

.delete-btn {
  position: absolute;
  right: 0;
  top: -5px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #dc2626;
}
</style>
