<template>
  <div class="custom-node question-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <span class="node-icon">❓</span>
      <span class="node-title">Question</span>
      <button v-if="node.data?.onDelete" @click.stop="node.data.onDelete" class="delete-btn" title="Delete node">×</button>
    </div>
    <div class="node-content">
      <input 
        v-model="questionText" 
        @input="updateNodeData"
        placeholder="Enter question..."
        class="node-input"
      />
    </div>
    <!-- No output handle - answers will provide output handles -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Handle, Position, useNode } from '@vue-flow/core'

const { node } = useNode()
const questionText = ref(node.data?.question || '')

const updateNodeData = () => {
  node.data = {
    ...node.data,
    question: questionText.value
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

.question-node {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  min-width: 280px;
  min-height: 250px;
  padding-bottom: 80px;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e3a8a;
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
  border: 1px solid #93c5fd;
  border-radius: 4px;
  font-size: 13px;
  background: white;
  color: #1e3a8a;
}

.node-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
</style>
