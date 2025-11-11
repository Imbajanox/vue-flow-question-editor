# Vue Flow Question Editor

A beautiful and user-friendly question editor built with Vue 3 and Vue Flow. Create interactive question flows with multiple node types including questions, answers, text nodes, and flow control nodes.

## Features

- 🚀 **Start Node**: Define the beginning of your question flow
- ❓ **Question Node**: Create questions with editable text
- ✓ **Answer Node**: Add answers that can connect to other nodes
- 📝 **Text Node**: Add supplementary text content (can connect to answers)
- 🏁 **End Node**: Mark the end of your flow
- 📥 **JSON Export**: Export your flow as JSON with nodes and connections
- 🎨 **Modern UI**: Clean, colorful interface with smooth interactions
- 🔗 **Visual Connections**: Drag and drop to create connections between nodes
- 🗺️ **MiniMap**: Navigate large flows easily
- ⚡ **Built with Vite**: Fast development and optimized builds

## Node Types

### Start Node (Green)
- Entry point for the question flow
- Has one output connection point

### Question Node (Blue)
- Contains a question text input field
- Can receive connections from above
- Can send connections to answers or other nodes below

### Answer Node (Purple)
- Contains an answer text input field
- Can receive connections from questions
- Can send connections to other questions or text nodes

### Text Node (Yellow/Orange)
- Contains a multi-line text area
- Can be used for explanations or additional information
- Can connect to answers for later use
- Can send and receive connections

### End Node (Red)
- Marks the end of a question flow
- Can only receive connections

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Imbajanox/vue-flow-question-editor.git
cd vue-flow-question-editor
```

2. Install dependencies:
```bash
npm install
```

## Testing on Windows

### Method 1: Using npm dev server (Recommended)

1. **Install Node.js on Windows**
   - Download the latest LTS version from [nodejs.org](https://nodejs.org/)
   - Run the installer and follow the setup wizard
   - Verify installation by opening Command Prompt and running:
     ```cmd
     node --version
     npm --version
     ```

2. **Open Command Prompt or PowerShell**
   - Press `Win + R`, type `cmd` and press Enter
   - Or search for "Command Prompt" or "PowerShell" in the Start menu

3. **Navigate to the project directory**
   ```cmd
   cd C:\path\to\vue-flow-question-editor
   ```

4. **Install dependencies** (first time only)
   ```cmd
   npm install
   ```

5. **Start the development server**
   ```cmd
   npm run dev
   ```

6. **Open in browser**
   - The terminal will show a URL (usually `http://localhost:5173`)
   - Open your web browser and navigate to that URL
   - You should see the Question Editor interface

7. **Stop the server**
   - Press `Ctrl + C` in the terminal

### Method 2: Using the built version

1. **Build the project**
   ```cmd
   npm run build
   ```

2. **Preview the build**
   ```cmd
   npm run preview
   ```

3. **Open in browser**
   - Navigate to the URL shown in the terminal (usually `http://localhost:4173`)

### Method 3: Using a local HTTP server

1. **Build the project**
   ```cmd
   npm run build
   ```

2. **Install a simple HTTP server** (if you don't have one)
   ```cmd
   npm install -g http-server
   ```

3. **Serve the dist folder**
   ```cmd
   cd dist
   http-server
   ```

4. **Open in browser**
   - Navigate to `http://localhost:8080`

## Usage Guide

### Creating a Question Flow

1. **Add Nodes**
   - Click the buttons in the toolbar to add different types of nodes
   - Each button creates a node of the corresponding type
   - Nodes appear at random positions on the canvas

2. **Edit Node Content**
   - Click on a Question, Answer, or Text node to see input fields
   - Type directly into the fields to add your content
   - Changes are saved automatically

3. **Connect Nodes**
   - Hover over a node to see connection points (handles)
   - Click and drag from a source handle (bottom) to a target handle (top)
   - Release to create the connection
   - Valid connections will turn into colored lines

4. **Navigate the Canvas**
   - Click and drag on empty space to pan the view
   - Use mouse wheel to zoom in/out
   - Use the MiniMap (bottom-right) to navigate large flows
   - Use the Controls (bottom-left) for zoom and fit view

5. **Export Your Flow**
   - Click the "Export JSON" button in the toolbar
   - A modal will appear with the JSON representation
   - Click "Copy to Clipboard" to copy the JSON
   - Or click "Download JSON" to save it as a file

6. **Clear the Flow**
   - Click the "Clear" button to remove all nodes and connections
   - Confirm the action in the dialog

### Example Flow Structure

```
Start → Question 1 → Answer 1A → Text Node → End
              ↓
           Answer 1B → Question 2 → Answer 2A → End
```

## JSON Output Format

The exported JSON contains two main sections:

```json
{
  "nodes": [
    {
      "id": "start-1",
      "type": "start",
      "position": { "x": 100, "y": 100 },
      "data": {}
    },
    {
      "id": "question-2",
      "type": "question",
      "position": { "x": 100, "y": 200 },
      "data": {
        "question": "What is your favorite color?"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "start-1",
      "target": "question-2",
      "sourceHandle": null,
      "targetHandle": null
    }
  ]
}
```

## Integration with Laminas

The exported JSON can be easily integrated into a Laminas PHP project:

1. **Save the JSON**: Export and download the JSON from the editor
2. **Store in Laminas**: Save to a database or file system
3. **Parse and Display**: Use the JSON to render questions dynamically
4. **Process Responses**: Track user answers based on the flow structure

### Example PHP Usage

```php
// In your Laminas controller
$jsonData = file_get_contents('path/to/flow.json');
$flow = json_decode($jsonData, true);

// Access nodes
foreach ($flow['nodes'] as $node) {
    if ($node['type'] === 'question') {
        $question = $node['data']['question'];
        // Display or process question
    }
}

// Access connections
foreach ($flow['edges'] as $edge) {
    $source = $edge['source'];
    $target = $edge['target'];
    // Process flow logic
}
```

## Development

### Project Structure

```
vue-flow-question-editor/
├── src/
│   ├── components/
│   │   ├── QuestionEditor.vue   # Main editor component
│   │   ├── StartNode.vue         # Start node component
│   │   ├── EndNode.vue           # End node component
│   │   ├── QuestionNode.vue      # Question node component
│   │   ├── AnswerNode.vue        # Answer node component
│   │   └── TextNode.vue          # Text node component
│   ├── App.vue                   # Root component
│   ├── main.js                   # Application entry point
│   └── style.css                 # Global styles
├── index.html                    # HTML entry point
├── vite.config.js               # Vite configuration
└── package.json                 # Project dependencies
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Flow** - Interactive node-based editor
- **Vue Flow Background** - Grid background for the canvas
- **Vue Flow Controls** - Zoom and pan controls
- **Vue Flow MiniMap** - Navigation minimap

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

## Troubleshooting

### Port already in use
If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual URL.

### Nodes not appearing
Make sure you've installed all dependencies with `npm install` and the dev server is running.

### Connection not working
Ensure you're dragging from a bottom handle (source) to a top handle (target). Some nodes only have specific connection points.

### Build fails
Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

## License

ISC

## Author

Imbajanox
