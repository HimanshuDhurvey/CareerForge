# Operating System Interview Questions Dataset

## Category
`Operating System`

## Purpose
Core Operating System principles: Process vs Thread, Process Scheduling algorithms, Inter-Process Communication (IPC), Deadlocks, Virtual Memory, Paging, and Cache coherency.

## Expected JSON Structure
```json
[
  {
    "role": "Systems Engineer",
    "category": "Operating System",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "question": "What is a deadlock in OS and what are the four necessary conditions for a deadlock to occur?",
    "expectedTopics": [
      "Mutual exclusion",
      "Hold and wait",
      "No preemption",
      "Circular wait"
    ],
    "tags": ["operating-system", "deadlock", "concurrency"],
    "estimatedTime": 120,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `Operating System`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key points expected
- **tags**: Tags list
- **estimatedTime**: Estimated seconds
- **isActive**: Boolean flag

## Naming Convention
- `os-threads-easy.json`
- `os-memory-hard.json`
