<template>
  <div class="custom-node answer-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <span class="node-icon">✓</span>
      <span class="node-title">Answer</span>
    </div>
    <div class="node-content">
      <input 
        v-model="answerText" 
        @input="updateNodeData"
        placeholder="Enter answer..."
        class="node-input"
      />
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Handle, Position, useNode } from '@vue-flow/core'

const { node } = useNode()
const answerText = ref(node.data?.answer || '')

const updateNodeData = () => {
  node.data = {
    ...node.data,
    answer: answerText.value
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

.answer-node {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #5b21b6;
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

.node-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #c4b5fd;
  border-radius: 4px;
  font-size: 13px;
  background: white;
  color: #5b21b6;
}

.node-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}
</style>
