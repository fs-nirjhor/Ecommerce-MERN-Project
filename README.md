# MERN Stack E-commerce Project

## Packages 
   ### Backend: 
    express, nodemon, morgan, http-errors, express-xss-sanitizer (alternative for xss-clean), express-rate-limit, dotenv, mongoose, bcryptjs, jsonwebtoken, nodemailer, multer


## Routes 
   ### Get: 
    ~/api/users -> get all users and get users by name, email or phone with limit and pagination (admin)
    ~/api/users/:id -> get user by id 
   ### POST: 
    ~/api/seed/users -> seed initial fake data for users (admin)
    ~/api/users/process-register ->  send verification mail with JWT link 
    ~/api/users/verify -> verify JWT token and registered user
   ### DELETE: 
    ~/api/users/:id -> delete user by id 
