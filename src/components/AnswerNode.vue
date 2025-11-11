<template>
  <div class="compact-node answer-node">
    <input
      v-model="answerText"
      @input="updateNodeData"
      placeholder="Answer"
      class="compact-input"
    />
    <button
        v-if="node.data?.onDelete"
        @click.stop="node.data.onDelete"
        title="Delete node"
        aria-label="Delete node"
      >
        <i class="fas fa-trash" aria-hidden="true"></i>
      </button>

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

.compact-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid #8b5cf6;
  background: #f7f0ff;
  min-width: 150;
  max-width: 300px;
  font-size: 13px;
  box-shadow: none;
}

.compact-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 2px 4px;
  color: #321a6b;
  outline: none;
  font-size: 13px;
  min-width: 60px;
}

.compact-input::placeholder {
  color: #9f7aea;
  opacity: 0.9;
}

.compact-close {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.compact-close:hover {
  background: #dc2626;
}
</style>
