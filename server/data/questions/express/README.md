# Express.js Interview Questions Dataset

## Category
`Express`

## Purpose
Stores questions on Express.js web framework fundamentals, Middleware pipeline, Routing, Error handling, Security best practices (Helmet, CORS, Rate limiting), and RESTful API architecture.

## Expected JSON Structure
```json
[
  {
    "role": "Backend Developer",
    "category": "Express",
    "interviewType": "Technical",
    "difficulty": "Easy",
    "question": "What is middleware in Express and how does next() work?",
    "expectedTopics": [
      "Request-response cycle",
      "Middleware chain",
      "Calling next() vs returning response",
      "Error handling middleware signature"
    ],
    "tags": ["express", "middleware", "routing"],
    "estimatedTime": 120,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `Express`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question text
- **expectedTopics**: Key items to evaluate candidate responses
- **tags**: Tag strings
- **estimatedTime**: Estimated time in seconds
- **isActive**: Boolean flag

## Naming Convention
- `express-routing-easy.json`
- `express-middleware-medium.json`
