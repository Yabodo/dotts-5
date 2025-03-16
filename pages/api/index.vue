<template>
  <ModalApiKeys ref="apiKeysModal" />
  <div class="py-8">
    <ButtonPrimary 
      @click="apiKeysModal?.open()"
      label="Manage API Keys"
      icon="i-tabler-key"
    />
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Dotts API Documentation</h1>
    
    <!-- Authentication Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Authentication</h2>
      <p class="mb-4 text-gray-700">
        All API requests must include an API key in the Authorization header:
      </p>
      <div class="bg-gray-100 p-4 rounded-md mb-6 font-mono text-sm">
        Authorization: Bearer YOUR_API_KEY
      </div>
      
      <h3 class="text-xl font-semibold text-gray-800 mb-3">API Key Management</h3>
      <ul class="list-disc pl-6 mb-6 text-gray-700 space-y-1">
        <li>API keys can be generated and managed through the web interface</li>
        <li>Each key has a name, creation date, and last used timestamp</li>
        <li>Keys can be revoked at any time</li>
        <li>For security reasons, the full key is only shown once upon creation</li>
      </ul>
      
      <h3 class="text-xl font-semibold text-gray-800 mb-3">Rate Limiting</h3>
      <ul class="list-disc pl-6 mb-6 text-gray-700 space-y-1">
        <li>API requests are limited to 100 requests per minute per IP address</li>
        <li>When the rate limit is exceeded, the API will return a 429 status code</li>
        <li>The rate limit window resets every 60 seconds</li>
      </ul>
    </section>
    
    <!-- Endpoints Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Endpoints</h2>
      
      <!-- Create Post Endpoint -->
      <div class="mb-10 border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800">Create Post</h3>
          <p class="text-gray-600 mt-1">Creates a new post with the provided content.</p>
        </div>
        
        <div class="p-4 space-y-4">
          <div>
            <p class="font-medium text-gray-700">URL:</p>
            <code class="text-sm bg-gray-100 px-2 py-1 rounded">/api/v1/posts</code>
          </div>
          
          <div>
            <p class="font-medium text-gray-700">Method:</p>
            <code class="text-sm bg-gray-100 px-2 py-1 rounded">POST</code>
          </div>
          
          <div>
            <p class="font-medium text-gray-700">Authentication:</p>
            <span class="text-sm">Required</span>
          </div>
          
          <div>
            <p class="font-medium text-gray-700">Content-Type:</p>
            <code class="text-sm bg-gray-100 px-2 py-1 rounded">application/json</code>
          </div>
          
          <div>
            <p class="font-medium text-gray-700 mb-2">Request Body:</p>
            <pre class="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
{
  "content": "Your post content here",
  "link": "https://example.com" // Optional
}</pre>
          </div>
          
          <div>
            <p class="font-medium text-gray-700 mb-2">Success Response:</p>
            <p class="text-sm mb-1">Code: 200 OK</p>
            <pre class="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
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
}</pre>
          </div>
          
          <div>
            <p class="font-medium text-gray-700 mb-2">Error Responses:</p>
            <ul class="space-y-2 text-sm">
              <li>
                <p>Code: 400 Bad Request</p>
                <pre class="bg-gray-100 p-2 rounded-md">{ "message": "Content is required and must be a string" }</pre>
              </li>
              <li>
                <p>Code: 401 Unauthorized</p>
                <pre class="bg-gray-100 p-2 rounded-md">{ "message": "Missing or invalid API key" }</pre>
              </li>
              <li>
                <p>Code: 429 Too Many Requests</p>
                <pre class="bg-gray-100 p-2 rounded-md">{ "message": "Too many requests, please try again later" }</pre>
              </li>
              <li>
                <p>Code: 500 Internal Server Error</p>
                <pre class="bg-gray-100 p-2 rounded-md">{ "message": "Failed to create post" }</pre>
              </li>
            </ul>
          </div>
          
          <div>
            <p class="font-medium text-gray-700 mb-2">Example:</p>
            <pre class="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
curl -X POST https://api.dotts.org/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Post content",
    "link": "https://example.com"
  }'</pre>
          </div>
        </div>
      </div>
      
      <!-- Get Feed Endpoint -->
      <div class="mb-10 border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800">Get Feed</h3>
          <p class="text-gray-600 mt-1">Returns the authenticated user's feed, including posts from followed users and the user's own posts.</p>
        </div>
        
        <div class="p-4 space-y-4">
          <div>
            <p class="font-medium text-gray-700">URL:</p>
            <code class="text-sm bg-gray-100 px-2 py-1 rounded">/api/v1/feed</code>
          </div>
          
          <div>
            <p class="font-medium text-gray-700">Method:</p>
            <code class="text-sm bg-gray-100 px-2 py-1 rounded">GET</code>
          </div>
          
          <div>
            <p class="font-medium text-gray-700">Authentication:</p>
            <span class="text-sm">Required</span>
          </div>
          
          <div>
            <p class="font-medium text-gray-700 mb-1">Query Parameters:</p>
            <ul class="list-disc pl-6 text-sm">
              <li><code>page</code> (optional): Page number for pagination, starting from 0 (default: 0)</li>
            </ul>
          </div>
          
          <div>
            <p class="font-medium text-gray-700 mb-2">Success Response:</p>
            <p class="text-sm mb-1">Code: 200 OK</p>
            <pre class="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
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
}</pre>
          </div>
          
          <div>
            <p class="font-medium text-gray-700 mb-2">Error Responses:</p>
            <ul class="space-y-2 text-sm">
              <li>
                <p>Code: 401 Unauthorized</p>
                <pre class="bg-gray-100 p-2 rounded-md">{ "message": "Missing or invalid API key" }</pre>
              </li>
              <li>
                <p>Code: 429 Too Many Requests</p>
                <pre class="bg-gray-100 p-2 rounded-md">{ "message": "Too many requests, please try again later" }</pre>
              </li>
              <li>
                <p>Code: 500 Internal Server Error</p>
                <pre class="bg-gray-100 p-2 rounded-md">{ "message": "Failed to fetch feed" }</pre>
              </li>
            </ul>
          </div>
          
          <div>
            <p class="font-medium text-gray-700 mb-2">Example:</p>
            <pre class="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
curl https://api.dotts.org/v1/feed?page=0 \
  -H "Authorization: Bearer YOUR_API_KEY"</pre>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Error Handling Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Error Handling</h2>
      <p class="mb-4 text-gray-700">
        All API errors return a JSON response with a <code class="bg-gray-100 px-1 py-0.5 rounded">message</code> field describing the error:
      </p>
      <pre class="bg-gray-100 p-3 rounded-md text-sm mb-4">
{
  "message": "Error message description"
}</pre>
      
      <p class="font-medium text-gray-700 mb-2">Common HTTP status codes:</p>
      <ul class="list-disc pl-6 text-gray-700 space-y-1">
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">200</code>: Success</li>
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">400</code>: Bad Request - Invalid input parameters</li>
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">401</code>: Unauthorized - Missing or invalid API key</li>
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">429</code>: Too Many Requests - Rate limit exceeded</li>
        <li><code class="bg-gray-100 px-1 py-0.5 rounded">500</code>: Internal Server Error - Server-side error</li>
      </ul>
    </section>
    
    <!-- Best Practices Section -->
    <section>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Best Practices</h2>
      <ol class="list-decimal pl-6 text-gray-700 space-y-2">
        <li><span class="font-medium">Store API keys securely</span>: Never expose your API key in client-side code or public repositories</li>
        <li><span class="font-medium">Handle rate limiting</span>: Implement exponential backoff when encountering 429 errors</li>
        <li><span class="font-medium">Validate input</span>: Always validate user input before sending to the API</li>
        <li><span class="font-medium">Error handling</span>: Implement proper error handling for all API requests</li>
        <li><span class="font-medium">Monitoring</span>: Monitor API usage and errors to detect issues early</li>
      </ol>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'minimal'
})

const apiKeysModal = ref()
</script>