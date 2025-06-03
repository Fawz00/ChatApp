# ChatApp Server API Documentation

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

### Register

- **Endpoint:** `POST /auth/register`
- **Body:**
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    ```
- **Response:** `201 Created`
    ```json
    {
        "message": "User registered successfully"
    }
    ```

### Login

- **Endpoint:** `POST /auth/login`
- **Body:**
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Response:** `200 OK`
    ```json
    {
        "token": "jwt_token"
    }
    ```

---

## Users

### Get User Profile

- **Endpoint:** `GET /users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
    ```json
    {
        "id": "string",
        "username": "string",
        "email": "string"
    }
    ```

---

## Chats

### Get User Chats

- **Endpoint:** `GET /chats`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
    ```json
    [
        {
            "chatId": "string",
            "participants": ["userId1", "userId2"],
            "lastMessage": "string"
        }
    ]
    ```

### Create Chat

- **Endpoint:** `POST /chats`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "participantId": "string"
    }
    ```
- **Response:** `201 Created`
    ```json
    {
        "chatId": "string"
    }
    ```

---

## Messages

### Send Message

- **Endpoint:** `POST /messages`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "chatId": "string",
        "content": "string"
    }
    ```
- **Response:** `201 Created`
    ```json
    {
        "messageId": "string",
        "content": "string",
        "senderId": "string",
        "timestamp": "ISO8601 string"
    }
    ```

### Get Messages

- **Endpoint:** `GET /messages/:chatId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
    ```json
    [
        {
            "messageId": "string",
            "content": "string",
            "senderId": "string",
            "timestamp": "ISO8601 string"
        }
    ]
    ```

---

## Error Response

- **Format:**
    ```json
    {
        "error": "Error message"
    }
    ```