# Dotts API Documentation

## Authentication

All API requests must include an API key in the Authorization header: 
```
Authorization: Bearer YOUR_API_KEY
```

### API Key Management

- API keys can be generated and managed through the web interface
- Each key has a name, creation date, and last used timestamp
- Keys can be revoked at any time
- For security reasons, the full key is only shown once upon creation

### Rate Limiting

- API requests are limited to 100 requests per minute per IP address
- When the rate limit is exceeded, the API will return a 429 status code
- The rate limit window resets every 60 seconds

## Endpoints

### Create Post

Creates a new post with the provided content.

- **URL**: `/api/v1/posts`
- **Method**: `POST`
- **Authentication**: Required
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "content": "Your post content here",
  "link": "https://example.com" // Optional
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "post": {
    "id": "uuid",
    "note": "Your post content here",
    "link": "https://example.com",
    "user_id": "user-uuid",
    "created_at": "2023-03-16T11:07:00.000Z",
    "updated_at": "2023-03-16T11:07:00.000Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "message": "Content is required and must be a string" }`
- **Code**: 401 Unauthorized
  - **Content**: `{ "message": "Missing or invalid API key" }`
- **Code**: 429 Too Many Requests
  - **Content**: `{ "message": "Too many requests, please try again later" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Failed to create post" }`

**Example**:
```bash
curl -X POST https://api.dotts.org/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Post content",
    "link": "https://example.com"
  }'
```

### Get Feed

Returns the authenticated user's feed, including posts from followed users and the user's own posts.

- **URL**: `/api/v1/feed`
- **Method**: `GET`
- **Authentication**: Required
- **Query Parameters**:
  - `page` (optional): Page number for pagination, starting from 0 (default: 0)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "posts": [
    {
      "id": "post-uuid",
      "note": "Post content",
      "link": "https://example.com",
      "user_id": "user-uuid",
      "created_at": "2023-03-16T11:07:00.000Z",
      "updated_at": "2023-03-16T11:07:00.000Z",
      "user": {
        "id": "user-uuid",
        "username": "username",
        "avatar_url": "https://example.com/avatar.jpg"
      }
    },
    // More posts...
  ],
  "page": 0
}
```

**Error Responses**:
- **Code**: 401 Unauthorized
  - **Content**: `{ "message": "Missing or invalid API key" }`
- **Code**: 429 Too Many Requests
  - **Content**: `{ "message": "Too many requests, please try again later" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Failed to fetch feed" }`

**Example**:
```bash
curl https://api.dotts.org/v1/feed?page=0 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Error Handling

All API errors return a JSON response with a `message` field describing the error:

```json
{
  "message": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request - Invalid input parameters
- `401`: Unauthorized - Missing or invalid API key
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

## Best Practices

1. **Store API keys securely**: Never expose your API key in client-side code or public repositories
2. **Handle rate limiting**: Implement exponential backoff when encountering 429 errors
3. **Validate input**: Always validate user input before sending to the API
4. **Error handling**: Implement proper error handling for all API requests
5. **Monitoring**: Monitor API usage and errors to detect issues early