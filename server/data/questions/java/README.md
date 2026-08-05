# Java Interview Questions Dataset

## Category
`Java`

## Purpose
Contains questions on Java core syntax, Multithreading, JVM Architecture (Garbage Collection, Memory Management), Collections Framework, Stream API, and Generics.

## Expected JSON Structure
```json
[
  {
    "role": "Java Developer",
    "category": "Java",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "question": "Explain the difference between HashMap and ConcurrentHashMap in Java.",
    "expectedTopics": [
      "Thread safety",
      "Segment locking vs bucket locking",
      "Null key/value handling",
      "Performance in multi-threaded environment"
    ],
    "tags": ["java", "collections", "concurrency"],
    "estimatedTime": 150,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `Java`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key points expected
- **tags**: Tags list
- **estimatedTime**: Estimated seconds
- **isActive**: Boolean flag

## Naming Convention
- `java-core-easy.json`
- `java-concurrency-hard.json`
