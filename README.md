# MERN Stack E-commerce Project

## Packages 
   ### Backend: 
    express, nodemon, morgan, http-errors, express-xss-sanitizer (alternative for xss-clean), express-rate-limit, dotenv, mongoose, bcrypt, jsonwebtoken

## Routes 
   ### Get: 
    ~/api/users -> get all users and get users by name, email or phone with limit and pagination (admin)
    ~/api/users/:id -> get user by id 
   ### POST: 
    ~/api/seed/users -> seed initial fake data for users (admin)
    ~/api/users/process-register -> create JWT to verify user email 
   ### DELETE: 
    ~/api/users/:id -> delete user by id 
