# MERN Stack E-commerce Project (under development)

## Packages

### Backend:
    express, nodemon, morgan, http-errors, express-xss-sanitizer (alternative for xss-clean), express-rate-limit, dotenv, mongoose, bcryptjs, jsonwebtoken, nodemailer, multer, cookie-parser, winston, slugify

## Routes
### Get:
    ~/api/users -> get all users and get users by name, email or phone with limit and pagination (admin)
    ~/api/users/:id -> get user by id

    ~/api/auth/refresh-token -> refresh access token
    ~/api/auth/protected-route -> verify access token 

    ~/api/category -> get all categories 
    ~/api/category/:slug -> get category by slug 

### POST:
    ~/api/seed/users -> seed initial fake data for users (admin)

    ~/api/users/process-register -> send verification mail with JWT link
    ~/api/users/activate -> verify JWT token and registered user
    ~/api/users/forgot-password -> send password reset email

    ~/api/auth/login -> user login with jwt access token
    ~/api/auth/logout -> user logout

    ~/api/category -> create new category

   
### DELETE:
    ~/api/users/:id -> delete user by id

### UPDATE (put):
    ~/api/users/:id -> update user by id
    ~/api/users/ban/:id -> banned user by id (admin)
    ~/api/users/unban/:id -> unbanned user by id (admin)
    ~/api/users/update-password/:id -> update password by id
    ~/api/users/reset-password -> reset password by token

    ~/api/category -> update category name and slug
