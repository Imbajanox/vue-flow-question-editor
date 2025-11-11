<template>
  <div class="custom-node start-node">
    <div class="node-header">
      <span class="node-icon">🚀</span>
      <span class="node-title">Start</span>
      <button v-if="data?.onDelete" @click.stop="data.onDelete" class="delete-btn" title="Delete node">×</button>
    </div>
    <Handle type="source" :position="Position.Bottom" id="start-output" />
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
  transition: box-shadow 0.2s, transform 0.1s;
}

.custom-node:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
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
  transition: background 0.2s, transform 0.1s;
}

.delete-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}
</style>
