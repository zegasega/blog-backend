# Blog Backend API Documentation

This document provides an overview of the available API routes for the blog backend application.

## Authentication

All routes, unless otherwise specified, require a valid JWT token to be sent in the `Authorization` header as a Bearer token.

`Authorization: Bearer <your_jwt_token>`

Some routes require a specific user role (e.g., "admin").

## User & Auth Routes

| Method | Endpoint             | Middleware                               | Description                               |
|--------|----------------------|------------------------------------------|-------------------------------------------|
| POST   | `/auth/register`     | `validateBody(userSchema)`               | Register a new user.                      |
| POST   | `/auth/login`        | -                                        | Log in to get an access token.            |
| POST   | `/auth/logout`       | `authMiddleware`                         | Log out the current user.                 |
| PUT    | `/auth/user`         | `authMiddleware`                         | Update the current user's profile.        |
| DELETE | `/auth/user`         | `authMiddleware`                         | Delete the current user's account.        |
| GET    | `/users`             | `authMiddleware`                         | Get a list of all users.                  |
| GET    | `/users/query`       | `authMiddleware`                         | Get users based on a query.               |
| GET    | `/users/:id`         | `authMiddleware`                         | Get a specific user by their ID.          |

## Post Routes

| Method | Endpoint             | Middleware                               | Description                               |
|--------|----------------------|------------------------------------------|-------------------------------------------|
| GET    | `/posts`             | `authMiddleware`                         | Get all posts.                            |
| GET    | `/posts/search`      | `authMiddleware`                         | Search for posts by a query string.       |
| GET    | `/posts/pagination`  | `authMiddleware`                         | Get posts with pagination.                |
| GET    | `/users/me/posts`    | `authMiddleware`                         | Get all posts created by the current user.|
| GET    | `/posts/:id`         | `authMiddleware`                         | Get a single post by its ID.              |
| POST   | `/posts`             | `authMiddleware`, `upload.single("image")` | Create a new post with an optional image. |
| PUT    | `/posts/:id`         | `authMiddleware`                         | Update a post by its ID.                  |
| DELETE | `/posts/:id`         | `authMiddleware`                         | Delete a post by its ID.                  |
| POST   | `/posts/:id/image`   | `authMiddleware`, `upload.single("image")` | Update the image for a specific post.     |

## Category Routes

| Method | Endpoint         | Middleware                               | Description                      |
|--------|------------------|------------------------------------------|----------------------------------|
| GET    | `/categories`    | `authMiddleware`                         | Get all categories.              |
| GET    | `/categories/:id`| `authMiddleware`                         | Get a single category by its ID. |
| POST   | `/categories`    | `authMiddleware`, `roleMiddleware("admin")` | Create a new category (Admin only). |
| PUT    | `/categories/:id`| `authMiddleware`                         | Update a category by its ID.     |
| DELETE | `/categories/:id`| `authMiddleware`, `roleMiddleware("admin")` | Delete a category (Admin only).  |

## Comment Routes

| Method | Endpoint                 | Middleware       | Description                               |
|--------|--------------------------|------------------|-------------------------------------------|
| POST   | `/comments`              | `authMiddleware` | Create a new comment on a post.           |
| GET    | `/comments/post/:postId` | `authMiddleware` | Get all comments for a specific post.     |
| GET    | `/comments`              | `authMiddleware` | Get all comments.                         |
| PUT    | `/comments/:commentId`   | `authMiddleware` | Update a comment by its ID.               |
| DELETE | `/comments/:commentId`   | `authMiddleware` | Delete a comment by its ID.               |

## Like Routes

| Method | Endpoint             | Middleware       | Description                       |
|--------|----------------------|------------------|-----------------------------------|
| POST   | `/posts/:postId/like`| `authMiddleware` | Toggle like/unlike on a post.     |
| GET    | `/posts/:postId/like`| `authMiddleware` | Get all likes for a specific post.|
