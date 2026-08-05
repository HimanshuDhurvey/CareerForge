# Behavioral Interview Questions Dataset

## Category
`Behavioral`

## Purpose
Behavioral questions designed to assess soft skills, conflict resolution, leadership under pressure, adaptability, teamwork, and problem solving using the STAR method (Situation, Task, Action, Result).

## Expected JSON Structure
```json
[
  {
    "role": "Software Engineer",
    "category": "Behavioral",
    "interviewType": "Behavioral",
    "difficulty": "Medium",
    "question": "Describe a situation where you had a tight deadline and how you handled unexpected technical blockers.",
    "expectedTopics": [
      "STAR method structure",
      "Prioritization and trade-offs",
      "Communication with stakeholders",
      "Learnings and outcome"
    ],
    "tags": ["behavioral", "star-method", "conflict-resolution"],
    "estimatedTime": 180,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `Behavioral`
- **interviewType**: Must be `Behavioral`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key points expected in STAR format
- **tags**: Tags list
- **estimatedTime**: Estimated seconds
- **isActive**: Boolean flag

## Naming Convention
- `behavioral-teamwork-easy.json`
- `behavioral-leadership-hard.json`
