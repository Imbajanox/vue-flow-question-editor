<template>
  <div class="custom-node text-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <span class="node-icon">📝</span>
      <span class="node-title">Text</span>
    </div>
    <div class="node-content">
      <textarea 
        v-model="textContent" 
        @input="updateNodeData"
        placeholder="Enter text content..."
        class="node-textarea"
        rows="3"
      />
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Handle, Position, useNode } from '@vue-flow/core'

const { node } = useNode()
const textContent = ref(node.data?.text || '')

const updateNodeData = () => {
  node.data = {
    ...node.data,
    text: textContent.value
  }
}
</script>

<style scoped>
.custom-node {
  padding: 15px;
  border-radius: 8px;
  border: 2px solid;
  background: white;
  min-width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.text-node {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 10px;
}

.node-icon {
  font-size: 20px;
}

.node-title {
  font-size: 14px;
}

.node-content {
  margin-top: 8px;
}

.node-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #fcd34d;
  border-radius: 4px;
  font-size: 13px;
  background: white;
  color: #92400e;
  resize: vertical;
  font-family: inherit;
}

.node-textarea:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1);
}
</style>
