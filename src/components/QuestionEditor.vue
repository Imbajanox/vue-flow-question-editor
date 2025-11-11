<template>
  <div class="question-editor">
    <div class="toolbar">
      <h1 class="title">Question Editor</h1>
      <div class="buttons">
        <button @click="addNode('start')" class="btn btn-start">+ Start</button>
        <button @click="addNode('question')" class="btn btn-question">+ Question</button>
        <button @click="addNode('text')" class="btn btn-text">+ Text</button>
        <button @click="addNode('end')" class="btn btn-end">+ End</button>
        <button @click="triggerImport" class="btn btn-import">📤 Import JSON</button>
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
      :is-valid-connection="isValidConnection"
      :nodes-draggable="true"
      :selection-mode="SelectionMode.Partial"
      :delete-key-code="'Delete'"
      @edge-click="onEdgeClick"
      :default-viewport="{ zoom: 1 }"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
      :snap-to-grid="true"
      :snap-grid="[15, 15]"
    >
      <Background 
        :variant="BackgroundVariant.Dots"
        pattern-color="#4b5563"
        :gap="16"
        :size="1"
      />
      <Controls 
        :show-zoom="true"
        :show-fit-view="true"
        :show-interactive="false"
      />
      <MiniMap 
        :node-color="getNodeColor"
        pannable
        zoomable
      />
    </VueFlow>

    <input
      ref="fileInput"
      type="file"
      accept="application/json"
      @change="handleFileImport"
      style="display: none"
    />

    <div v-if="showImport" class="import-modal" @click="showImport = false">
      <div class="modal-content" @click.stop>
        <h2>Import JSON</h2>
        <textarea
          v-model="importData"
          placeholder="Paste your JSON here..."
          class="import-textarea"
        ></textarea>
        <div class="modal-actions">
          <button @click="importFromText" class="btn btn-primary">Import</button>
          <button @click="showImport = false" class="btn btn-close">Close</button>
        </div>
      </div>
    </div>

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
import { ref, markRaw, nextTick} from 'vue'
import { VueFlow, useVueFlow, SelectionMode, MarkerType } from '@vue-flow/core'
import { Background, BackgroundVariant } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

import StartNode from './StartNode.vue'
import EndNode from './EndNode.vue'
import QuestionNode from './QuestionNode.vue'
import AnswerNode from './AnswerNode.vue'
import TextNode from './TextNode.vue'

// Import Vue Flow styles - this includes base styles and default theme
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
const showImport = ref(false)
const exportedData = ref('')
const importData = ref('')
const fileInput = ref(null)
let nodeId = 1

const { onConnect, addEdges, removeNodes, removeEdges, updateNode } = useVueFlow()

// Validate connections before creating them
const isValidConnection = (connection) => {
  // Prevent connecting a node to itself
  if (connection.source === connection.target) {
    return false
  }
  
  // Allow all other connections
  return true
}

// Configure connections with smooth edges and arrow markers
onConnect((params) => {
  if (isValidConnection(params)) {
    addEdges([{
      ...params,
      type: 'smoothstep',
      animated: true,
      markerEnd: MarkerType.ArrowClosed,
    }])
  }
})

const onEdgeClick = (event) => {
  if (event.edge && confirm('Delete this connection?')) {
    removeEdges([event.edge.id])
  }
}

const deleteNode = (nodeIdToDelete) => {
   if (confirm('Delete this node?')) {
    // 1. Find the node to be deleted
    const nodeToDelete = nodes.value.find(n => n.id === nodeIdToDelete)
    let parentId = null
    if (nodeToDelete && nodeToDelete.parentNode) {
      parentId = nodeToDelete.parentNode
    }

    // 2. Remove the node and associated edges
    removeNodes([nodeIdToDelete])

    if (parentId) {
      nextTick(() => {
        updateParentNodeHeight(parentId)
      })
    }
  }
}

const addAnswerToQuestion = (questionId) => {
  const answerId = `answer-${nodeId++}`
  // Count existing answers for this question to position the new one
  const existingAnswers = nodes.value.filter(n => n.parentNode === questionId)
  const yPosition = 120 + (existingAnswers.length * 60) // y-position based on number of existing children

  nodes.value.push({
    id: answerId,
    type: 'answer',
    position: { x: 20, y: yPosition },
    parentNode: questionId,
    extent: 'parent',
    data: {
      onDelete: () => deleteNode(answerId)
    }
  })
  updateParentNodeHeight(questionId)
}


const updateParentNodeHeight = (questionId) => {
    const parentNode = nodes.value.find(n => n.id === questionId)
    
    if (!parentNode || parentNode.type !== 'question') {
        console.log(`[Height Calc] Parent node ${questionId} not found or not a question type. Aborting.`);
        return
    }

    const childNodes = nodes.value.filter(n => n.parentNode === questionId)

    const ANSWER_NODE_HEIGHT = 30 
    const MIN_HEIGHT = 150 
    const BOTTOM_PADDING = 30 
    
    let maxBottom = 0

    // 1. Calculate the required height
    for (const child of childNodes) {
        // child.position.y is the top offset of the child relative to the parent
        const childBottom = child.position.y + ANSWER_NODE_HEIGHT
        if (childBottom > maxBottom) {
            maxBottom = childBottom
        }
    }

    const requiredHeight = maxBottom + BOTTOM_PADDING
    const newHeight = Math.max(requiredHeight, MIN_HEIGHT)

    // 2. Define the new style object
    const newStyle = {
        ...parentNode.style,
        width: '300px', 
        height: `${newHeight}px`,
        minHeight: '150px'
    };

    // 3. Use updateNode to apply the style change and force a re-render
    // This is the key change for reliability.
    const success = updateNode(questionId, { style: newStyle })

    // Optional: Log success to confirm Vue Flow received the update command
    console.log(`[Height Calc] updateNode success for ${questionId}: ${success}, New Height: ${newHeight}px`);

    // NOTE: We no longer need to manually modify nodes.value[index]
    // because updateNode handles both the internal state and the reactive array update.
}

const addNode = (type) => {
  const id = `${type}-${nodeId++}`
  
  // Create the base node
  const newNode = {
    id,
    type,
    position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    data: {
      onDelete: () => deleteNode(id)
    },
  }
  
  // If it's a question node, make it expandable and set it up to contain children
  if (type === 'question') {
    newNode.data.isExpanded = true
    newNode.data.onAddAnswer = () => addAnswerToQuestion(id)
    newNode.style = {
      width: '300px',
      height: 'auto',
      minHeight: '150px'
    }
    
    // Add two default answer children
    const answerId1 = `answer-${nodeId++}`
    const answerId2 = `answer-${nodeId++}`
    
    nodes.value.push(newNode)
    
    
    updateParentNodeHeight(id)
  } else {
    nodes.value.push(newNode)
  }
}

const exportJSON = () => {
  const exportData = {
    nodes: nodes.value.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      ...(node.parentNode && { parentNode: node.parentNode }),
      data: {
        // Only include relevant data fields, not functions
        ...(node.data.question && { question: node.data.question }),
        ...(node.data.answer && { answer: node.data.answer }),
        ...(node.data.text && { text: node.data.text }),
      }
    })),
    edges: edges.value.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
      animated: edge.animated
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

const triggerImport = () => {
  showImport.value = true
  importData.value = ''
}

const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result)
      importJSON(json)
    } catch (error) {
      alert('Invalid JSON file: ' + error.message)
    }
  }
  reader.readAsText(file)
  event.target.value = '' // Reset input
}

const importFromText = () => {
  try {
    const json = JSON.parse(importData.value)
    importJSON(json)
    showImport.value = false
  } catch (error) {
    alert('Invalid JSON: ' + error.message)
  }
}

const importJSON = (data) => {
  if (!data.nodes || !Array.isArray(data.nodes)) {
    alert('Invalid JSON structure: missing nodes array')
    return
  }

  // Clear existing flow
  nodes.value = []
  edges.value = []

  // Find the highest node ID to continue numbering
  let maxId = 0
  data.nodes.forEach(node => {
    const match = node.id.match(/\d+$/)
    if (match) {
      const id = parseInt(match[0])
      if (id > maxId) maxId = id
    }
  })
  nodeId = maxId + 1

  // Import nodes with their data and event handlers
  data.nodes.forEach(node => {
    const newNode = {
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...(node.data.question && { question: node.data.question }),
        ...(node.data.answer && { answer: node.data.answer }),
        ...(node.data.text && { text: node.data.text }),
        onDelete: () => deleteNode(node.id)
      }
    }

    // Add parentNode if it exists
    if (node.parentNode) {
      newNode.parentNode = node.parentNode
      newNode.extent = 'parent'
    }

    // For question nodes, add special handlers and style
    if (node.type === 'question') {
      newNode.data.isExpanded = true
      newNode.data.onAddAnswer = () => addAnswerToQuestion(node.id)
      newNode.style = {
        width: '300px',
        height: 'auto',
        minHeight: '150px'
      }
    }

    nodes.value.push(newNode)
  })

  // Import edges
  if (data.edges && Array.isArray(data.edges)) {
    data.edges.forEach(edge => {
      edges.value.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null,
        type: edge.type || 'smoothstep',
        animated: edge.animated !== undefined ? edge.animated : true,
        markerEnd: MarkerType.ArrowClosed
      })
    })
  }

  // Update heights for all question nodes
  nextTick(() => {
    nodes.value.forEach(node => {
      if (node.type === 'question') {
        updateParentNodeHeight(node.id)
      }
    })
  })

  alert('Flow imported successfully!')
}

// Helper function for MiniMap node colors
const getNodeColor = (node) => {
  const colors = {
    start: '#10b981',
    question: '#3b82f6',
    answer: '#8b5cf6',
    text: '#f59e0b',
    end: '#ef4444'
  }
  return colors[node.type] || '#6b7280'
}
</script>

<style scoped>
.vue-flow__handle {
  /* Set a high z-index for the handles */
  z-index: 1000; 
  /* This might also be needed if the handle is inside a parent with a lower z-index */
  position: relative; 
}

/* Ensure child nodes and their handles are above parent nodes */
:deep(.vue-flow__node) {
  z-index: 1;
}

:deep(.vue-flow__node-answer) {
  z-index: 100 !important;
}

/* 2. Ensure Edges are also on top */
/* Targeting the path for the connections */
.vue-flow__edge-path {
  /* Set a high z-index for the path itself */
  z-index: 900 !important; 
}

/* 3. If the above isn't enough, target the entire edge group */
:deep(.vue-flow__edge) {
    /* The :deep selector is necessary to style elements inside Vue Flow's component slots */
    z-index: 900;
}

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

.btn-import {
  background: #8b5cf6;
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

.export-modal,
.import-modal {
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

.import-textarea {
  width: 100%;
  min-height: 300px;
  background: #1a1a1a;
  color: #10b981;
  padding: 20px;
  border: 1px solid #404040;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
}

.import-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
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
