# Node.js Interview Questions Dataset

## Category
`Node.js`

## Purpose
Contains interview questions on Node.js runtime architecture, Event Loop phases, Streams, Buffers, Worker Threads, File System module, Child Processes, and non-blocking I/O operations.

## Expected JSON Structure
```json
[
  {
    "role": "Backend Developer",
    "category": "Node.js",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "question": "How does the Node.js Event Loop work and what are microtasks vs macrotasks?",
    "expectedTopics": [
      "Libuv event loop phases",
      "process.nextTick and Promises",
      "setImmediate vs setTimeout",
      "Non-blocking I/O"
    ],
    "tags": ["nodejs", "event-loop", "async"],
    "estimatedTime": 150,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role (e.g., `Backend Developer`, `Node.js Engineer`)
- **category**: Must be set to `Node.js`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key points expected in answer
- **tags**: Domain tags
- **estimatedTime**: Estimated response duration in seconds (default: 120)
- **isActive**: Boolean flag (default: true)

## Naming Convention
- `nodejs-architecture-medium.json`
- `nodejs-streams-hard.json`
