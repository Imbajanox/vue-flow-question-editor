<template>
  <div class="custom-node answer-node">
    <!-- No target handle - answer is a child of question -->
    <div class="node-header">
      <span class="node-icon">✓</span>
      <span class="node-title">Answer</span>
      <button v-if="node.data?.onDelete" @click.stop="node.data.onDelete" class="delete-btn" title="Delete node">×</button>
    </div>
    <div class="node-content">
      <input 
        v-model="answerText" 
        @input="updateNodeData"
        placeholder="Enter answer..."
        class="node-input"
      />
    </div>
    <Handle type="source" :position="Position.Right" />
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
  padding: 10px;
  border-radius: 8px;
  border: 2px solid;
  background: white;
  min-width: 220px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.answer-node {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  min-width: 240px;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #5b21b6;
  margin-bottom: 10px;
  position: relative;
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
