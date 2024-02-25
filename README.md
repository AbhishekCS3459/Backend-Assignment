Certainly! Here's the code for the README file incorporating the provided sample data:

```markdown
# Job Listings and Users Management RESTful API

This repository contains a backend RESTful API built with Node.js, Express.js, and MongoDB for managing job listings and users. The API allows users to view job listings, apply for jobs, and interact with other users by liking them to increase their points.

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your_username/your_repository.git
```

2. Install dependencies:

```bash
cd your_repository
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:

```plaintext
PORT=3000
MONGODB_URI=mongodb://localhost:27017/job_listings_users
JWT_SECRET=your_jwt_secret
```

Replace `your_jwt_secret` with your JWT secret key.

4. Start the server:

```bash
npm start
```

The server should now be running on `http://localhost:3000`.

## API Endpoints

### User API (API 1)

- **POST /api/users**: Create a new user.
  - Request Body:

```json
{
  "name": "User Name",
  "githubLink": "https://github.com/user",
  "password": "user_password"
}
```

- **GET /api/users**: Retrieve all users in ascending order of points.
- **GET /api/users/:userId**: Retrieve a specific user by ID.
- **PUT /api/users/:userId/like**: Like another user (increments points).
  - Request Body:

```json
{
  "likedUserId": "liked_user_id"
}
```

- **PUT /api/users/:userId**: Update user details.
  - Request Body:

```json
{
  "name": "New User Name",
  "githubLink": "https://github.com/new_user"
}
```

- **DELETE /api/users/:userId**: Delete a user.

### Job Listing API (API 2)

- **POST /api/joblistings**: Create a new job listing.
  - Request Body:

```json
{
  "date": "2024-02-25",
  "title": "Job Title",
  "link": "https://joblink.com"
}
```

- **GET /api/joblistings**: Retrieve all job listings.
- **GET /api/joblistings/:jobId**: Retrieve a specific job listing by ID.
- **PUT /api/joblistings/:jobId/apply**: Add a user to the list of users who applied for a job.
  - Request Body:

```json
{
  "userId": "user_id"
}
```

- **PUT /api/joblistings/:jobId**: Update job listing details.
  - Request Body:

```json
{
  "title": "New Job Title",
  "link": "https://newjoblink.com"
}
```

- **DELETE /api/joblistings/:jobId**: Delete a job listing.

### Authentication

- **POST /api/auth/register**: Register a new user.
  - Request Body:

```json
{
  "name": "User Name",
  "githubLink": "https://github.com/user",
  "password": "user_password"
}
```

- **POST /api/auth/login**: Login and receive a JWT token.
  - Request Body:

```json
{
  "githubLink": "https://github.com/user",
  "password": "user_password"
}
```

## Sample Data

Sample data for the "getusers" endpoint in the User API:

```json
[
    {
        "_id": "65da4045f748ec10ce233c84",
        "userID": "106",
        "name": "Abhisek verma",
        "points": 182,
        "githubLink": "https://github.com/AbhishekCS3459",
        "__v": 26
    },
    {
        "_id": "65dae9c08e5307be34bb6002",
        "userID": "69",
        "name": "Emma Miller",
        "points": 0,
        "githubLink": "https://github.com/emmamiller",
        "__v": 0
    },
    // Other user objects...
    {
        "userID": "938",
        "points": 0,
        "_id": "65daffce2205e21d10c749b9",
        "username": "Abhisek",
        "email": "abhishekverman3459@gmail.com",
        "password": "1234",
        "__v": 0
    }
]
```

Each object in the array represents a user with the following properties:
- `_id`: The unique identifier of the user in MongoDB.
- `userID`: An identifier for the user (not necessarily unique).
- `name`: The name of the user.
- `points`: The number of points the user has.
- `githubLink`: The GitHub link of the user.
- `__v`: Version key used by Mongoose (not relevant for API response).


