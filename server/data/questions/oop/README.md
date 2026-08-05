# Object-Oriented Programming (OOP) Interview Questions Dataset

## Category
`OOP`

## Purpose
Core Object-Oriented Programming principles: Encapsulation, Abstraction, Inheritance, Polymorphism (Overloading & Overriding), SOLID Principles, Design Patterns (Factory, Singleton, Observer, Strategy).

## Expected JSON Structure
```json
[
  {
    "role": "Software Engineer",
    "category": "OOP",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "question": "Explain the SOLID principles in software engineering with real-world examples.",
    "expectedTopics": [
      "Single Responsibility Principle",
      "Open/Closed Principle",
      "Liskov Substitution Principle",
      "Interface Segregation Principle",
      "Dependency Inversion Principle"
    ],
    "tags": ["oop", "solid", "design-patterns"],
    "estimatedTime": 180,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `OOP`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key points expected
- **tags**: Tags list
- **estimatedTime**: Estimated seconds
- **isActive**: Boolean flag

## Naming Convention
- `oop-pillars-easy.json`
- `oop-solid-medium.json`
