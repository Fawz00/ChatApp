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
        "message": "User registered successfully",
        "email": "string"
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
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
        "token": "jwt_token",
        "email": "string"
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Forgot Password

- **Endpoint:** `POST /auth/forgot-password`
- **Request Body:**
    ```json
    {
        "email": "string"
    }
    ```
- **Success Response:** `200 OK`
    ```json
    {
        "message": "Email has been sent to reset your password"
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Reset Password

- **Endpoint:** `POST /auth/reset-password/:token`
- **Request Body:**
    ```json
    {
        "newPassword": "string"
    }
    ```
- **Success Response:** `200 OK`
    ```json
    {
        "message": "Password has been reset successfully"
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

---

## Users

### Get Self Profile

- **Endpoint:** `GET /user/me`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "_id": "string",
        "email": "string",
        "username": "string",
        "profilePhoto": "string",
        "bannerPhoto": "string",
        "description": "string",
        "phoneNumber": "string",
        "createdAt": "2025-06-03T12:26:07.611Z",
        "updatedAt": "2025-06-07T05:54:32.849Z",
        "__v": 0
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Get User Profile

- **Endpoint:** `GET /user/:userId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "_id": "string",
        "email": "string",
        "username": "string",
        "profilePhoto": "string",
        "bannerPhoto": "string",
        "description": "string",
        "phoneNumber": "string",
        "createdAt": "2025-06-03T12:26:07.611Z",
        "updatedAt": "2025-06-07T05:54:32.849Z",
        "__v": 0
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Edit Self Profile

- **Endpoint:** `PUT /user/update`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
    - Fields:
        - `username`: string (optional)
        - `description`: string (optional)
        - `phoneNumber`: string (optional)
        - `profilePhoto`: file (optional)
        - `bannerPhoto`: file (optional)
- **Success Response:** `200 OK`
    ```json
    {
        "_id": "string",
        "email": "string",
        "username": "string",
        "profilePhoto": "string",
        "bannerPhoto": "string",
        "description": "string",
        "phoneNumber": "string",
        "createdAt": "2025-06-03T12:26:07.611Z",
        "updatedAt": "2025-06-07T05:54:32.849Z",
        "__v": 0
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Delete Account

- **Endpoint:** `DELETE /user/delete`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "message": "Account deleted successfully"
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

---

## Chats

### Create Chat

- **Endpoint:** `POST /chat/create`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
    - Fields:
        - `userIds`: array of user IDs (for group: at least one, for private: exactly one)
        - `isGroup`: boolean
        - `name`: string (required for group)
        - `description`: string (optional)
        - `groupPhoto`: file (optional, for group)
- **Success Response:** `201 Created`
    - For group chat:
    ```json
    {
        "_id": "string",
        "isGroup": true,
        "name": "string",
        "description": "string",
        "groupPhoto": "string",
        "participants": ["string"],
        "admins": ["string"],
        "createdAt": "2025-06-03T12:26:07.611Z",
        "updatedAt": "2025-06-07T05:54:32.849Z",
        "__v": 0
    }
    ```
    - For private chat:
    ```json
    {
        "message": "Chat created successfully",
        "chat": "chatId"
    }
    ```
    - If chat already exists:
    ```json
    {
        "message": "Chat already exists",
        "chatId": "chatId"
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Get All Chats for User

- **Endpoint:** `GET /chat/me/all`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Query Parameters:**
    - `isGroup`: `true` or `false` (optional)
    - `sortBy`: string (default: `updatedAt`)
    - `order`: `asc` or `desc` (default: `desc`)
- **Success Response:** `200 OK`
    ```json
    {
        "data": [
            {
                "_id": "string",
                "isGroup": true,
                "name": "string",
                "photo": "string",
                "lastMessage": { /* message object */ },
                "participants": [
                    {
                        "_id": "string",
                        "username": "string",
                        "email": "string",
                        "profilePhoto": "string"
                    }
                ],
                "updatedAt": "2025-06-07T05:54:32.849Z"
            }
        ]
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Get Chat Details

- **Endpoint:** `GET /chat/:chatId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "_id": "string",
        "isGroup": true,
        "name": "string",
        "description": "string",
        "groupPhoto": "string",
        "participants": [
            {
                "_id": "string",
                "email": "string"
            }
        ],
        "lastMessage": { /* message object */ }
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Edit Group Chat

- **Endpoint:** `PUT /chat/:chatId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
    - Fields:
        - `name`: string (optional)
        - `description`: string (optional)
        - `groupPhoto`: file (optional)
- **Success Response:** `200 OK`
    ```json
    {
        "message": "Group chat details updated successfully",
        "chat": { /* updated chat object */ }
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Delete Chat

- **Endpoint:** `DELETE /chat/:chatId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "message": "Chat deleted successfully"
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

---

## Messages

### Send Message

- **Endpoint:** `POST /chat/send`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
    - Fields:
        - `chatId`: string
        - `content`: string (for text)
        - `type`: string (`text`, `image`, `file`)
        - `media`: file (for `image` or `file`)
- **Success Response:** `201 Created`
    ```json
    {
        "_id": "string",
        "chatId": "string",
        "sender": "string",
        "content": "string",
        "media": "string",
        "type": "text",
        "createdAt": "2025-06-08T02:18:38.497Z",
        "updatedAt": "2025-06-08T02:18:38.497Z",
        "__v": 0
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Get Messages

- **Endpoint:** `GET /chat/:chatId/messages`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Query Parameters:**
    - `start`: number (optional, default 0)
    - `limit`: number (optional, default 0 = all)
- **Success Response:** `200 OK`
    ```json
    {
        "data": [
            {
                "_id": "messageId",
                "chatId": "chatId",
                "sender": {
                    "_id": "userId",
                    "email": "string"
                },
                "content": "string",
                "media": "string",
                "type": "text",
                "createdAt": "2025-06-08T02:18:38.497Z",
                "updatedAt": "2025-06-08T02:18:38.497Z",
                "__v": 0
            }
        ]
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Edit Message

- **Endpoint:** `PUT /chat/message/:messageId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:**
    ```json
    {
        "content": "string"
    }
    ```
- **Success Response:** `200 OK`
    ```json
    {
        "message": "Chat message updated successfully",
        "message": { /* updated message object */ }
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

### Delete Message

- **Endpoint:** `DELETE /chat/message/:messageId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "message": "Message successfully deleted"
    }
    ```
- **Error Response:**  
    ```json
    {
        "message": "Error message"
    }
    ```

---

## Error Response

All endpoints may return errors in the following format:

```json
{
    "message": "Error message"
}
```