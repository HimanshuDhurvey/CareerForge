# Computer Networks Interview Questions Dataset

## Category
`Computer Networks`

## Purpose
Networking fundamentals: OSI model vs TCP/IP model, HTTP/HTTPS protocols, TCP 3-way handshake, UDP, DNS resolution process, WebSockets, TLS/SSL encryption, and REST/gRPC.

## Expected JSON Structure
```json
[
  {
    "role": "Backend Engineer",
    "category": "Computer Networks",
    "interviewType": "Technical",
    "difficulty": "Medium",
    "question": "Describe the TCP 3-way handshake mechanism during connection establishment.",
    "expectedTopics": [
      "SYN packet",
      "SYN-ACK response",
      "ACK acknowledgement",
      "Sequence numbers and window size"
    ],
    "tags": ["computer-networks", "tcp", "protocols"],
    "estimatedTime": 120,
    "isActive": true
  }
]
```

## Field Specifications
- **role**: Target job role
- **category**: Must be set to `Computer Networks`
- **interviewType**: Enum — `Technical`, `HR`, `Behavioral`, or `Mixed`
- **difficulty**: Enum — `Easy`, `Medium`, or `Hard`
- **question**: Question string
- **expectedTopics**: Key points expected
- **tags**: Tags list
- **estimatedTime**: Estimated seconds
- **isActive**: Boolean flag

## Naming Convention
- `cn-osi-easy.json`
- `cn-protocols-medium.json`
