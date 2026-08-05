# JavaScript Interview Questions Dataset

## Category
`JavaScript`

## Purpose
Stores technical questions covering core JavaScript language concepts, ES6+ features, Event Loop, Closures, Prototypes, Promises, Async/Await, Memory Management, and DOM manipulation.

## Expected JSON Structure
```json
[
  {
    "role": "Software Engineer",
    "category": "JavaScript",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "question": "Explain closures in JavaScript and provide a practical use case.",
    "expectedTopics": [
      "Lexical scoping",
      "Function returning function",
      "Data privacy / encapsulation",
      "Memory retention"
    ],
    "tags": ["javascript", "closures", "es6"],
    "estimatedTime": 120,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role (e.g., `Software Engineer`, `Frontend Developer`)
- **category**: Must be set to `JavaScript`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question prompt
- **expectedTopics**: Key concepts candidate should address
- **tags**: Relevant tags for filtering
- **estimatedTime**: Estimated response time in seconds (default: 120)
- **isActive**: Boolean flag (default: true)

## Naming Convention
- `js-core-easy.json`
- `js-async-medium.json`
- `js-advanced-hard.json`
