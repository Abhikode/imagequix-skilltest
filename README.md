# Imagequix skilltest

CRUD API for Posts and Comments .

## Installation

Use the package manager npm.

```bash
npm install 
```

## Start-server

```bash
npm start 
```

## Run tests
this will start mocha and will run the test scripts

```bash
npm test
```

## POSTS API
### CREATE: `http://127.0.0.1:4000/api/v1/posts`

Json payload:
`{
"title": "post title",
"content": "post content"
}`

sample key : x-auth value : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM`
this is sample token for user id = 2225

### GET : `http://127.0.0.1:4000/api/v1/posts`

### PUT : `http://127.0.0.1:4000/api/v1/posts/:id`

### DELETE : `http://127.0.0.1:4000/api/v1/posts/:id`


## Comments API
### CREATE: `http://127.0.0.1:4000/api/v1/comments/:post_id`

Json payload:
`{
"content": "comment ..."
}`

sample key : x-auth value : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM`
this is sample token for user id = 2225

### CREATE child comment: `http://127.0.0.1:4000/api/v1/comments/:post_id/reply/:root_comment_id`

Json payload:
`{
"content": "comment thread ..."
}`

### GET : `http://127.0.0.1:4000/api/v1/comments/:post_id`

### GET child comment : `http://127.0.0.1:4000/api/v1/comments/:post_id/reply/:root_comment_id`

### PUT : `http://127.0.0.1:4000/api/v1/comments/:comment_id`

### DELETE : `http://127.0.0.1:4000/api/v1/comments/:comment_id`
   

