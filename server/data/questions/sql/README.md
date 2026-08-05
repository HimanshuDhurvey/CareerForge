# SQL Interview Questions Dataset

## Category
`SQL`

## Purpose
Structured Query Language queries, Joins (INNER, LEFT, RIGHT, FULL), Subqueries, Window Functions, Group By / Having clauses, Views, Stored Procedures, and Query Optimization.

## Expected JSON Structure
```json
[
  {
    "role": "Data Engineer",
    "category": "SQL",
    "interviewType": "Technical",
    "difficulty": "Hard",
    "question": "Write a SQL query using Window Functions (RANK vs DENSE_RANK) to find top N highest paid employees per department.",
    "expectedTopics": [
      "PARTITION BY clause",
      "ORDER BY inside window function",
      "Difference between RANK and DENSE_RANK",
      "CTE (Common Table Expressions)"
    ],
    "tags": ["sql", "window-functions", "queries"],
    "estimatedTime": 180,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `SQL`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key points expected
- **tags**: Tags list
- **estimatedTime**: Estimated seconds
- **isActive**: Boolean flag

## Naming Convention
- `sql-joins-medium.json`
- `sql-advanced-hard.json`
