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
        "email": "string",
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
        "newPassword": "string",
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
        "createdAt": "2025-06-03T12:26:07.611Z",
        "updatedAt": "2025-06-07T05:54:32.849Z",
        "__v": 0
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Get User Profile

- **Endpoint:** `GET /users/:userid`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "_id": "string",
        "email": "string",
        "username": "string",
        "createdAt": "2025-06-03T12:26:07.611Z",
        "updatedAt": "2025-06-07T05:54:32.849Z",
        "__v": 0
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Edit Self Profile

- **Endpoint:** `PUT /user/me`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
    ```json
    {
        "username": "string",
        "description": "string",
        "phoneNumber": "string"
    }
    ```
    ```json
    {
        "profilePhoto": "file",
        "bannerPhoto": "file"
    }
    ```
- **Success Response:** `200 OK`
    ```json
    {
        "username": "string",
        "description": "string",
        "phoneNumber": "string",
        "profilePhoto": "file",
        "bannerPhoto": "file"
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Delete Account

- **Endpoint:** `DELETE /user/me`
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
        "error": "Error message"
    }
    ```

---

## Chats

### Create Chat

- **Endpoint:** `POST /chat/create`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:**
    ```json
    {
        "userIds": ["string"],
        "isGroup": false,
        "name": "string",
        "description": "string"
    }
    ```
    ```json
    {
        "groupPhoto": "file"
    }
    ```
- **Success Response:** `201 Created`
    ```json
    {
        "userIds": ["string"],
        "isGroup": false,
        "name": "string",
        "description": "string",
        "groupPhoto": "file",
        "participants": ["string"],
        "admins": ["string"]
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Get Personal or Group Property

- **Endpoint:** `GET /chat/:chatId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "_id": "string",
        "isGroup": false,
        "name": "string",
        "description": "string",
        "groupPhoto": null,
        "participants": [
            {
                "_id": "string",
                "email": "string"
            }
        ]
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Edit Personal or Group Property

- **Endpoint:** `PUT /chat/:chatId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:** `multipart/form-data`
    ```json
    {
        "name": "string",
        "description": "string"
    }
    ```
    ```json
    {
        "groupPhoto": "file"
    }
    ```
- **Success Response:** `200 OK`
    ```json
    {
        "_id": "string",
        "isGroup": false,
        "name": "string",
        "description": "string",
        "groupPhoto": "file",
        "participants": [
            {
                "_id": "string",
                "email": "string"
            }
        ]
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Delete Personal or Group Chat

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
        "error": "Error message"
    }
    ```

---

## Messages

### Send Message

- **Endpoint:** `POST /chat/send`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:**
    ```json
    {
        "chatId": "string",
        "content": "string",
        "type": "string"
    }
    ```
    ```json
    {
        "media": "file"
    }
    ```
- **Success Response:** `201 Created`
    ```json
    {
        "chat": "string",
        "sender": "string",
        "content": "string",
        "media": "file",
        "type": "enum: text | image | file"
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Get Messages

- **Endpoint:** `GET /chat/:chatId/messages`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Request Body:**
    ```json
    {
        "start": 0,
        "limit": 1
    }
    ```
- **Success Response:** `200 OK`
    ```json
    [
        {
            "_id": "messageId",
            "chat": "chatId",
            "sender": {
                "_id": "userId",
                "email": "string"
            },
            "content": "string",
            "media": "",
            "type": "text",
            "createdAt": "2025-06-08T02:18:38.497Z",
            "updatedAt": "2025-06-08T02:18:38.497Z",
            "__v": 0
        }
    ]
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Edit Messages

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
        "_id": "messageId",
        "chat": "chatId",
        "sender": {
            "_id": "userId",
            "email": "string"
        },
        "content": "string",
        "media": "",
        "type": "text",
        "createdAt": "2025-06-08T02:18:38.497Z",
        "updatedAt": "2025-06-08T03:00:00.000Z",
        "__v": 0
    }
    ```
- **Error Response:**  
    ```json
    {
        "error": "Error message"
    }
    ```

### Delete Messages

- **Endpoint:** `DELETE /chat/message/:messageId`
- **Headers:**  
    `Authorization: Bearer <token>`
- **Success Response:** `200 OK`
    ```json
    {
        "message": "Message deleted successfully"
    }
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