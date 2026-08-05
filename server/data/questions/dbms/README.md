# DBMS Interview Questions Dataset

## Category
`DBMS`

## Purpose
Database Management Systems fundamental concepts including ACID properties, Normalization (1NF to BCNF), Transaction Isolation levels, Locking protocols, and Relational Algebra.

## Expected JSON Structure
```json
[
  {
    "role": "Database Administrator",
    "category": "DBMS",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "question": "What are ACID properties in DBMS and why are they important?",
    "expectedTopics": [
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability"
    ],
    "tags": ["dbms", "transactions", "acid"],
    "estimatedTime": 120,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `DBMS`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key points expected
- **tags**: Tags list
- **estimatedTime**: Estimated seconds
- **isActive**: Boolean flag

## Naming Convention
- `dbms-fundamentals-easy.json`
- `dbms-transactions-medium.json`
