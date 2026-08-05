# React Interview Questions Dataset

## Category
`React`

## Purpose
This directory stores curated interview questions focusing on React library fundamentals, Hooks, State Management (Redux, Context API), Virtual DOM, Lifecycle Methods, Performance Optimization, and Server-Side Rendering (SSR).

## Expected JSON Structure
Every JSON file in this directory must contain an array of question objects following this identical schema:

```json
[
  {
    "role": "Frontend Developer",
    "category": "React",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "question": "What is the purpose of useEffect hook and how do you clean up side effects?",
    "expectedTopics": [
      "Side effect handling",
      "Dependency array",
      "Cleanup callback function",
      "Component unmounting"
    ],
    "tags": ["react", "hooks", "useEffect"],
    "estimatedTime": 120,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role (e.g., `Frontend Developer`, `Fullstack Engineer`)
- **category**: Must be set to `React`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Plain text of the question
- **expectedTopics**: Array of strings detailing expected candidate key answer points
- **tags**: Optional array of tags for search and indexing
- **estimatedTime**: Estimated response duration in seconds (default: 120)
- **isActive**: Boolean flag indicating whether the question is active (default: true)

## Naming Convention
Files should be named lowercase with hyphens indicating topic and difficulty:
- `react-basics-easy.json`
- `react-hooks-medium.json`
- `react-performance-hard.json`
