# HR Interview Questions Dataset

## Category
`HR`

## Purpose
General Human Resources interview questions covering self-introductions, career goals, salary expectations, company fit, strengths & weaknesses, and work ethics.

## Expected JSON Structure
```json
[
  {
    "role": "General",
    "category": "HR",
    "interviewType": "HR",
    "difficulty": "Easy",
    "question": "Where do you see yourself in 5 years?",
    "expectedTopics": [
      "Career growth aspirations",
      "Skill enhancement roadmap",
      "Alignment with company vision",
      "Commitment and stability"
    ],
    "tags": ["hr", "career-goals", "general"],
    "estimatedTime": 120,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role (or `General`)
- **category**: Must be set to `HR`
- **interviewType**: Must be `HR`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question prompt
- **expectedTopics**: Key traits/points evaluated
- **tags**: Tags list
- **estimatedTime**: Estimated seconds
- **isActive**: Boolean flag

## Naming Convention
- `hr-introduction-easy.json`
- `hr-goals-medium.json`
