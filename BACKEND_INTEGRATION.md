# Backend Integration Summary

This document outlines the integration between the Round frontend and backend authentication APIs.

## Integration Overview

The frontend has been updated to connect to the real backend APIs instead of using mock data. This includes:

1. **Login API Integration** - `/identities/login`
2. **Register API Integration** - `/identities/register`
3. **Token Management** - JWT token storage and refresh
4. **Error Handling** - Proper error handling for API failures

## Changes Made

### 1. New API Client Service

Created `src/shared/services/apiClient.ts` with:

- **Axios-based HTTP client** with interceptors for authentication
- **Token management** with localStorage storage
- **Error handling** for network issues and authentication failures
- **Type-safe interfaces** matching backend request/response formats

### 2. Updated Authentication Pages

**LoginPage.tsx**:

- Replaced `mockApi.login()` with `apiClient.login()`
- Enhanced error handling for backend responses
- Proper token storage and user authentication

**BusinessRegisterPage.tsx** & **PersonalRegisterPage.tsx**:

- Replaced `mockApi.register()` with `apiClient.register()`
- Auto-login after successful registration
- Improved error messaging for backend validation failures

### 3. Updated Authentication Context

**AuthContextType.ts** & **AuthContext.tsx**:

- Updated to use proper `User` types instead of `MockUser`
- Integrated with new API client for session management
- Better error handling for expired tokens

### 4. Environment Configuration

**`.env.local`**:

- Added `VITE_API_URL` configuration for backend endpoint
- Default set to `https://localhost:7000` (adjust as needed)

## Backend API Endpoints

### Login Endpoint

```
POST /identities/login
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "password123",
  "roundAccountId": "optional-guid"
}
```

**Response (Success)**:

```json
{
  "succeeded": true,
  "token": "jwt-token-string",
  "refreshToken": "refresh-token-string"
}
```

**Response (Failure)**:

```json
{
  "succeeded": false,
  "errors": [
    {
      "code": "InvalidCredentials",
      "description": "Invalid email or password"
    }
  ]
}
```

### Register Endpoint

```
POST /identities/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "userName": "optional-username",
  "password": "password123",
  "phoneNumber": "+1234567890"
}
```

**Response (Success)**:

```json
{
  "message": "Registration successful. Please check your email to confirm your email address."
}
```

## Key Features

### 1. Automatic Token Management

- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Token refresh handling
- Auto-logout on token expiration

### 2. Error Handling

- Network error handling with user-friendly messages
- Validation error display for form fields
- Proper HTTP status code handling
- Fallback error messages for unexpected issues

### 3. Type Safety

- TypeScript interfaces for all API requests/responses
- Proper type checking for user data
- Type-safe error handling

### 4. Security Features

- HTTPS-only token transmission
- Automatic token cleanup on logout
- Session validation on app load
- CSRF protection ready

## Testing

Added comprehensive tests in `src/shared/services/__tests__/apiClient.test.ts`:

- Login success/failure scenarios
- Registration success/failure scenarios
- Token management functionality
- Error handling for network issues

## Configuration

### Backend URL Configuration

Update `.env.local` with your backend URL:

```
VITE_API_URL=https://your-backend-domain.com
```

### Development Setup

For local development, ensure your backend is running on:

- HTTPS: `https://localhost:7000`
- HTTP: `http://localhost:5000`

## Future Enhancements

1. **User Profile API** - Fetch complete user profile after login
2. **Refresh Token Rotation** - Implement automatic token refresh
3. **Social Login** - Google/Facebook OAuth integration
4. **Multi-Factor Authentication** - SMS/Email verification
5. **Session Management** - Better session handling and cleanup

## Notes

- The backend currently doesn't return user profile data in the login response
- User profile information is mocked in the API client
- Consider adding a separate `/users/profile` endpoint for complete user data
- Email confirmation flow is handled by the backend but not yet integrated in the frontend

## Error Handling Improvements

The integration includes robust error handling for:

- Network connectivity issues
- Invalid credentials
- Server errors (500, 503, etc.)
- Validation errors from the backend
- Token expiration and refresh failures

This ensures a smooth user experience even when things go wrong.
