# DreamSoul Backend - Gender-Based User Storage

## Overview

The DreamSoul application now stores users in separate MongoDB collections based on their gender during signup. This implementation provides better data organization and potential for gender-specific features.

## User Models

The application uses three separate user models, all sharing the same schema:

- **MaleUser**: Stores male users
- **FemaleUser**: Stores female users  
- **OtherUser**: Stores users who identify as other

## User Schema

```javascript
{
  fullName: String (required),
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  gender: String (required, enum: ["male", "female", "other"]),
  profilePicture: String (default: default profile image),
  isUserAdmin: Boolean (default: false),
  status: String (default: "Inactive", enum: ["Active", "Inactive"]),
  lastVisit: Date (default: current date),
  timestamps: true
}
```

## Key Functions

### `getUserModel(gender)`
Returns the appropriate Mongoose model based on gender:
- `getUserModel('male')` → MaleUser
- `getUserModel('female')` → FemaleUser
- `getUserModel('other')` → OtherUser

### `findUserByEmail(email)`
Searches for a user across all three collections and returns:
```javascript
{
  user: UserObject | null,
  model: ModelClass | null
}
```

## Authentication Flow

### Signup Process
1. User provides: fullName, username, email, password, gender
2. System validates all fields including gender enum
3. Password is hashed using bcryptjs
4. User is saved to the appropriate collection based on gender
5. Success response is sent

### Signin Process
1. User provides: email, password
2. System searches across all three collections for the email
3. If found, password is verified
4. JWT token is generated including user ID, admin status, and gender
5. User data (excluding password) is returned with token

### Google OAuth
- New Google users are defaulted to 'other' gender collection
- Existing users are found across all collections

## API Endpoints

- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Authenticate existing user
- `POST /auth/google` - Google OAuth authentication

## Frontend Integration

The frontend signup form now includes:
- Full Name field
- Gender selection dropdown (Male/Female/Other)
- All existing fields (username, email, password)

The profile page displays:
- Full name (if available, falls back to username)
- Email, username, gender, and status

## Benefits

1. **Data Organization**: Users are logically separated by gender
2. **Scalability**: Easier to implement gender-specific features
3. **Analytics**: Better insights into user demographics
4. **Performance**: Potentially faster queries when filtering by gender
5. **Flexibility**: Easy to add gender-specific business logic

## Migration Notes

- Existing users will need to be migrated to the new structure
- The system maintains backward compatibility through the `findUserByEmail` function
- JWT tokens now include gender information for enhanced security 