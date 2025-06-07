# ChatApp Server API Documentation

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

### Register

- **Endpoint:** `POST /auth/register`
- **Request Body:**
    ```json
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    ```
- **Success Response:** `201 Created`
    ```json
    {
        "message": "User registered successfully"
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Login

- **Endpoint:** `POST /auth/login`
- **Request Body:**
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Success Response:** `200 OK`
    ```json
    {
        "token": "jwt_token"
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

---

## Users

### Get User Profile

- **Endpoint:** `GET /users/:id`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "id": "string",
        "username": "string",
        "email": "string"
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

---

## Chats

### Get User Chats

- **Endpoint:** `GET /chats`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    [
        {
            "chatId": "string",
            "participants": ["userId1", "userId2"],
            "lastMessage": "string"
        }
    ]
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Create Chat

- **Endpoint:** `POST /chats`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:**
    ```json
    {
        "participantId": "string"
    }
    ```
- **Success Response:** `201 Created`
    ```json
    {
        "chatId": "string"
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

---

## Messages

### Send Message

- **Endpoint:** `POST /messages`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:**
    ```json
    {
        "chatId": "string",
        "content": "string"
    }
    ```
- **Success Response:** `201 Created`
    ```json
    {
        "messageId": "string",
        "content": "string",
        "senderId": "string",
        "timestamp": "ISO8601 string"
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Get Messages

- **Endpoint:** `GET /messages/:chatId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
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
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

---

## Error Response

All endpoints may return errors in the following format:

```json
{
    "error": "Error message"
}
```