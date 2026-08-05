# MongoDB Interview Questions Dataset

## Category
`MongoDB`

## Purpose
Covers MongoDB document database concepts, Aggregation Framework, Indexing strategies, Sharding, Replication (Replica Sets), Schema design patterns, and Mongoose ODM integration.

## Expected JSON Structure
```json
[
  {
    "role": "Database Engineer",
    "category": "MongoDB",
    "interviewType": "Technical",
    "difficulty": "Hard",
    "question": "How do compound indexes work in MongoDB and what is the ESIR rule?",
    "expectedTopics": [
      "Index field order",
      "Equality, Sort, Range (ESR) rule",
      "Index coverage",
      "Explain plan analysis"
    ],
    "tags": ["mongodb", "indexing", "performance"],
    "estimatedTime": 180,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `MongoDB`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: List of expected topics
- **tags**: Domain tags
- **estimatedTime**: Estimated time in seconds
- **isActive**: Boolean flag

## Naming Convention
- `mongodb-queries-easy.json`
- `mongodb-indexes-hard.json`
