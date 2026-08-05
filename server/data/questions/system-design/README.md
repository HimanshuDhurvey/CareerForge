# System Design Interview Questions Dataset

## Category
`System Design`

## Purpose
High-level and low-level System Design questions: Scalability, Load Balancing, Caching (Redis), Message Queues (Kafka/RabbitMQ), Microservices vs Monolith, Database Partitioning, Rate Limiting, and CDN architecture.

## Expected JSON Structure
```json
[
  {
    "role": "Senior Backend Architect",
    "category": "System Design",
    "interviewType": "Technical",
    "difficulty": "Hard",
    "question": "How would you design a scalable URL shortener service like Bitly handling 10 million requests per day?",
    "expectedTopics": [
      "Capacity estimation & throughput",
      "API signatures (POST /shorten, GET /:hash)",
      "Base62 hashing encoding vs counter approach",
      "Database schema and Caching layer (Redis)",
      "Load balancing and horizontal scaling"
    ],
    "tags": ["system-design", "scalability", "caching"],
    "estimatedTime": 300,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role (e.g., `Senior Backend Architect`, `Fullstack Engineer`)
- **category**: Must be set to `System Design`
- **interviewType**: Must be `Technical` or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key system components candidate should design
- **tags**: Domain tags
- **estimatedTime**: Estimated response duration in seconds (default: 300)
- **isActive**: Boolean flag

## Naming Convention
- `sysdesign-basics-medium.json`
- `sysdesign-distributed-hard.json`
