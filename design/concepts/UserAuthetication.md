# UserAuthentication

## Purpose
Manage user identity and session access

## Operational Principle
After registering with credentisls, users can authenticate to access their personal workout data. 

## State
    a set of Users with
     a username String
     a passwordHash String

    a set of Sessions with
      a user User
      a token String  

## Actions

### register(username: String, password: String): User

**Requires:** username not already taken

**Effects:** Create user with hashed password

### login(username: String, password: String): String

**Requires:** user exists with matching credentials

**Effects:** Create session, return token

### authenticate(token: String): User

**Requires:** valid session exists for token

**Effects:** Return authenticated user

### logout(token: String)

**Requires:** session exists

**Effects:** remove session

### deleteAccount(userId: ObjectId)

**Requires:** user exists

**Effects:** Remove user and all associated sessions