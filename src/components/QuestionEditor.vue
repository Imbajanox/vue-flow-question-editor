<template>
  <div class="question-editor">
    <div class="toolbar">
      <h1 class="title">Question Editor</h1>
      <div class="buttons">
        <button @click="addNode('start')" class="btn btn-start">+ Start</button>
        <button @click="addNode('question')" class="btn btn-question">+ Question</button>
        <button @click="addNode('answer')" class="btn btn-answer">+ Answer</button>
        <button @click="addNode('text')" class="btn btn-text">+ Text</button>
        <button @click="addNode('end')" class="btn btn-end">+ End</button>
        <button @click="exportJSON" class="btn btn-export">📥 Export JSON</button>
        <button @click="clearFlow" class="btn btn-clear">🗑️ Clear</button>
      </div>
    </div>
    
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      class="vue-flow"
      @connect="onConnect"
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
    >
      <Background pattern-color="#4b5563" :gap="16" />
      <Controls />
      <MiniMap />
    </VueFlow>

    <div v-if="showExport" class="export-modal" @click="showExport = false">
      <div class="modal-content" @click.stop>
        <h2>Exported JSON</h2>
        <pre>{{ exportedData }}</pre>
        <div class="modal-actions">
          <button @click="copyToClipboard" class="btn btn-primary">Copy to Clipboard</button>
          <button @click="downloadJSON" class="btn btn-secondary">Download JSON</button>
          <button @click="showExport = false" class="btn btn-close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

import StartNode from './StartNode.vue'
import EndNode from './EndNode.vue'
import QuestionNode from './QuestionNode.vue'
import AnswerNode from './AnswerNode.vue'
import TextNode from './TextNode.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

const nodeTypes = {
  start: markRaw(StartNode),
  end: markRaw(EndNode),
  question: markRaw(QuestionNode),
  answer: markRaw(AnswerNode),
  text: markRaw(TextNode),
}

const nodes = ref([])
const edges = ref([])
const showExport = ref(false)
const exportedData = ref('')
let nodeId = 1

const { onConnect, addEdges, onNodesChange, onEdgesChange } = useVueFlow()

onConnect((params) => {
  addEdges([params])
})

const addNode = (type) => {
  const id = `${type}-${nodeId++}`
  const newNode = {
    id,
    type,
    position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    data: {},
  }
  nodes.value.push(newNode)
}

const exportJSON = () => {
  const exportData = {
    nodes: nodes.value.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data
    })),
    edges: edges.value.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle
    }))
  }
  exportedData.value = JSON.stringify(exportData, null, 2)
  showExport.value = true
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(exportedData.value)
    alert('Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const downloadJSON = () => {
  const blob = new Blob([exportedData.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'question-flow.json'
  a.click()
  URL.revokeObjectURL(url)
}

const clearFlow = () => {
  if (confirm('Are you sure you want to clear the entire flow?')) {
    nodes.value = []
    edges.value = []
    nodeId = 1
  }
}
</script>

<style scoped>
.question-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
}

.toolbar {
  background: #2d2d2d;
  padding: 15px 20px;
  border-bottom: 2px solid #404040;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.btn-start {
  background: #10b981;
  color: white;
}

.btn-question {
  background: #3b82f6;
  color: white;
}

.btn-answer {
  background: #8b5cf6;
  color: white;
}

.btn-text {
  background: #f59e0b;
  color: white;
}

.btn-end {
  background: #ef4444;
  color: white;
}

.btn-export {
  background: #06b6d4;
  color: white;
}

.btn-clear {
  background: #6b7280;
  color: white;
}

.vue-flow {
  flex: 1;
  background: #1a1a1a;
}

.export-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 30px;
  max-width: 800px;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-content h2 {
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 20px;
}

.modal-content pre {
  background: #1a1a1a;
  color: #10b981;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
  max-height: 400px;
  font-size: 13px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-secondary {
  background: #3b82f6;
  color: white;
}

.btn-close {
  background: #6b7280;
  color: white;
}
</style>
