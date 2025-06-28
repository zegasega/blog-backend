# Blog Backend API Documentation

This document provides a detailed overview of the API endpoints for this blog application.

## General Information

*   **Base URL**: All routes are prefixed with `/api/v1`. For example, the `/users` route is accessible at `/api/v1/users`.
*   **Authentication**: Most routes are protected and require a valid JSON Web Token (JWT). The token must be sent in the `Authorization` header as a Bearer token: `Authorization: Bearer <your_jwt_token>`.
*   **Roles**: Certain administrative routes require the authenticated user to have a specific role (e.g., `admin`).
*   **File Uploads**: Routes that handle image uploads expect `multipart/form-data` requests.
*   **Error Responses**: Errors are returned in a consistent JSON format: `{ "error": "Error message" }`.

---

## Auth Routes

Handles user registration, login, and profile management for the authenticated user.

| Method | Path             | Description                                        | Authentication | Body Validation         |
| :----- | :--------------- | :------------------------------------------------- | :------------- | :---------------------- |
| `POST` | `/auth/register` | Registers a new user.                              | None           | `userSchema`            |
| `POST` | `/auth/login`    | Logs in a user and returns JWTs.                   | None           | None                    |
| `POST` | `/auth/logout`   | Logs out the currently authenticated user.         | Required       | None                    |
| `PUT`  | `/auth/user`     | Updates the profile of the authenticated user.     | Required       | None                    |
| `DELETE`| `/auth/user`    | Deletes the account of the authenticated user.     | Required       | None                    |

---

## User Routes

Provides access to public user information.

| Method | Path             | Description                                        | Authentication |
| :----- | :--------------- | :------------------------------------------------- | :------------- |
| `GET`  | `/users`         | Retrieves a list of all users.                     | Required       |
| `GET`  | `/users/query`   | Finds users based on query parameters.             | Required       |
| `GET`  | `/users/:id`     | Retrieves a single user by their ID.               | Required       |

---

## Post Routes

Manages the creation, retrieval, and modification of blog posts.

| Method | Path                          | Description                                        | Authentication | Notes                               |
| :----- | :---------------------------- | :------------------------------------------------- | :------------- | :---------------------------------- |
| `GET`  | `/posts`                      | Retrieves all posts.                               | Required       |                                     |
| `POST` | `/posts`                      | Creates a new post.                                | Required       | Expects `multipart/form-data` for image upload. |
| `GET`  | `/posts/search`               | Searches for posts via a `query` parameter.        | Required       | Example: `/posts/search?query=tech` |
| `GET`  | `/posts/page/:page/limit/:limit` | Retrieves posts with pagination.                   | Required       |                                     |
| `GET`  | `/users/me/posts`             | Retrieves all posts by the authenticated user.     | Required       |                                     |
| `GET`  | `/posts/:id`                  | Retrieves a single post by its ID.                 | Required       |                                     |
| `PUT`  | `/posts/:id`                  | Updates a post.                                    | Required       | User must be the post author.       |
| `DELETE`| `/posts/:id`                 | Deletes a post.                                    | Required       | User must be the post author.       |
| `POST` | `/posts/:id/image`            | Uploads an image to a post.             | Required       | Expects `multipart/form-data`.      |

---

## Category Routes

Manages blog post categories.

| Method | Path             | Description                                        | Authentication | Role Required |
| :----- | :--------------- | :------------------------------------------------- | :------------- | :------------ |
| `GET`  | `/categories`    | Retrieves all categories.                          | Required       | None          |
| `POST` | `/categories`    | Creates a new category.                            | Required       | `admin`       |
| `GET`  | `/categories/:id`| Retrieves a single category by its ID.             | Required       | None          |
| `PUT`  | `/categories/:id`| Updates a category.                                | Required       | None          |
| `DELETE`| `/categories/:id`| Deletes a category.                                | Required       | `admin`       |

---

## Comment Routes

Handles comments on posts.

| Method | Path                   | Description                                        | Authentication | Notes                         |
| :----- | :--------------------- | :------------------------------------------------- | :------------- | :-------------------------- |
| `GET`  | `/comments`            | Retrieves all comments across all posts.           | Required       |                             |
| `POST` | `/comments`            | Creates a new comment on a post.                   | Required       | Request body needs `post_id`. |
| `GET`  | `/comments/post/:postId`| Retrieves all comments for a specific post.        | Required       |                             |
| `PUT`  | `/comments/:commentId` | Updates a comment.                                 | Required       | User must be the author.    |
| `DELETE`| `/comments/:commentId` | Deletes a comment.                                 | Required       | User must be the author.    |

---

## Like Routes

Manages likes on posts.

| Method | Path                | Description                                        | Authentication |
| :----- | :------------------ | :------------------------------------------------- | :------------- |
| `POST` | `/posts/:postId/like`| Toggles a like on a post (likes if not liked, unlikes if liked). | Required       |
| `GET`  | `/posts/:postId/like`| Retrieves all likes for a specific post.           | Required       |

