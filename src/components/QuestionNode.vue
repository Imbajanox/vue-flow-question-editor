<template>
  <div class="custom-node question-node">
    <Handle type="target" :position="Position.Top" id="question-input" />
    <div class="node-header">
      <i class="fas fa-question-circle" aria-hidden="true"></i>
      <span class="node-title">Question</span>
      <button v-if="node.data?.onAddAnswer" @click.stop="node.data.onAddAnswer" class="add-answer-btn" title="Add answer">+ Answer</button>
      <button
        v-if="node.data?.onDelete"
        @click.stop="node.data.onDelete"
        class="delete-btn"
        title="Delete node"
        aria-label="Delete node"
      >×</button>
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
  transition: box-shadow 0.2s, transform 0.1s;
}

.custom-node:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.question-node {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  min-width: 280px;
  height: 100%; /* <-- Ensure it takes the full calculated height from Vue Flow */
  min-height: auto;
  padding-bottom: 50px;
  position: relative;
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

.add-answer-btn {
  margin-left: auto;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  pointer-events: auto;
  margin-right: 28px;
}

.add-answer-btn:hover {
  background: #7c3aed;
  transform: translateY(-1px);
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

.node-content {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
}

.node-input {
  flex: 1 1 60%;
  min-width: 180px;
  padding: 8px;
  border: 1px solid #93c5fd;
  border-radius: 4px;
  font-size: 13px;
  background: white;
  color: #1e3a8a;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.node-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
</style>
