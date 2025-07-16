# Email Confirmation Flow Documentation

This document describes the complete email confirmation flow implemented for the Round application.

## Overview

The email confirmation flow ensures that users verify their email addresses before they can access the application. This is a security measure to prevent unauthorized access and ensure valid email addresses.

## Flow Diagram

```
User Registration → Email Sent → User Clicks Link → Email Confirmed → Redirect to Get Started
      ↓                ↓                ↓               ↓                    ↓
   [Register]    [Pending Page]    [Confirm Page]   [Success State]    [/get-started]
```

## Backend Integration

### API Endpoints

1. **Registration** - `POST /identities/register`
   - Registers user and sends confirmation email
   - Returns success message
   - Does NOT automatically log in user

2. **Email Confirmation** - `GET /identities/confirm-email`
   - Parameters: `userId` and `token`
   - Confirms email address in database
   - Returns success/failure message

3. **Resend Confirmation** - `POST /identities/resend`
   - Body: `{ email: string }`
   - Resends confirmation email
   - Returns success/failure message

## Frontend Implementation

### Pages

#### 1. Registration Pages

- **Path**: `/auth/register/personal`, `/auth/register/business`
- **Behavior**: After successful registration, redirects to confirmation pending page
- **State**: Passes user email to next page

#### 2. Confirmation Pending Page

- **Path**: `/auth/confirmation-pending`
- **Purpose**: Shows user that email was sent and provides instructions
- **Features**:
  - Displays user's email address
  - Shows step-by-step instructions
  - Provides resend email functionality
  - Link back to login

#### 3. Email Confirmation Page

- **Path**: `/auth/confirm-email`
- **Purpose**: Handles email confirmation when user clicks link
- **URL Parameters**: `userId` and `token`
- **States**:
  - **Loading**: Shows spinner while confirming
  - **Success**: Shows success message, auto-redirects to get-started
  - **Error**: Shows error message with helpful actions

#### 4. Resend Confirmation Page

- **Path**: `/auth/resend-confirmation`
- **Purpose**: Allows users to request new confirmation email
- **Features**:
  - Email input with validation
  - Success/error messaging
  - Link back to login

### Updated Login Page

- **Enhanced Error Handling**: Shows link to resend confirmation if email-related error
- **Additional Link**: "Resend confirmation" link at bottom of form

## User Experience Flow

### 1. New User Registration

```
1. User fills registration form
2. User clicks "Create Account"
3. System sends confirmation email
4. User redirected to confirmation pending page
5. User sees instructions and email address
```

### 2. Email Confirmation

```
1. User receives email with confirmation link
2. User clicks link in email
3. Link opens /auth/confirm-email?userId=xxx&token=xxx
4. System validates userId and token
5. If valid: Email confirmed, redirect to /get-started
6. If invalid: Error message with resend option
```

### 3. Resend Confirmation

```
1. User clicks "Resend confirmation" link
2. User enters email address
3. System sends new confirmation email
4. User receives new email with fresh link
```

## Email Template Requirements

The backend should send emails with the following structure:

### Subject

```
Confirm your Round account
```

### Body

```
Welcome to Round!

Please confirm your email address by clicking the link below:

[Confirm Email Button/Link]

The link goes to:
https://yourdomain.com/auth/confirm-email?userId={userId}&token={token}

If you didn't create this account, please ignore this email.

Best regards,
The Round Team
```

## Security Considerations

1. **Token Expiration**: Confirmation tokens should expire after 24 hours
2. **Single Use**: Tokens should be invalidated after successful use
3. **Rate Limiting**: Limit resend requests to prevent spam
4. **URL Validation**: Validate userId and token format before processing

## Error Handling

### Frontend Error States

1. **Invalid Link**: Missing or malformed userId/token
2. **Expired Token**: Token has expired
3. **Already Confirmed**: Email already confirmed
4. **Network Error**: Connection issues
5. **Server Error**: Backend unavailable

### User-Friendly Error Messages

- **Invalid Link**: "This confirmation link is invalid. Please check your email and try again."
- **Expired Token**: "This confirmation link has expired. Please request a new one."
- **Already Confirmed**: "This email has already been confirmed. You can now log in."
- **Network Error**: "Unable to connect. Please check your internet connection and try again."

## Testing

### Unit Tests Coverage

1. **Email Confirmation Page**
   - Loading state rendering
   - Success state handling
   - Error state handling
   - Navigation after success
   - Invalid URL parameter handling

2. **Confirmation Pending Page**
   - Email display
   - Resend functionality
   - Success/error messaging
   - Navigation links

3. **Resend Confirmation Page**
   - Form validation
   - API integration
   - Success/error handling
   - Navigation

### Integration Tests

1. **Complete Flow Testing**
   - Registration → Confirmation → Login
   - Resend email flow
   - Error recovery scenarios

### Manual Testing Checklist

- [ ] Register new user
- [ ] Receive confirmation email
- [ ] Click confirmation link
- [ ] Verify redirect to get-started
- [ ] Test expired token scenario
- [ ] Test resend email functionality
- [ ] Test invalid link handling
- [ ] Test network error scenarios

## Configuration

### Environment Variables

```bash
# Frontend (.env.local)
VITE_API_URL=https://your-backend-url.com

# Backend (appsettings.json)
{
  "EmailSettings": {
    "FromEmail": "noreply@round.com",
    "FromName": "Round Team",
    "SmtpServer": "smtp.your-provider.com",
    "SmtpPort": 587,
    "SmtpUser": "your-smtp-user",
    "SmtpPassword": "your-smtp-password"
  },
  "JwtSettings": {
    "TokenExpiration": "24:00:00"
  }
}
```

## Deployment Considerations

1. **Email Service**: Configure SMTP settings for production
2. **Domain Configuration**: Update confirmation links to use production domain
3. **SSL/TLS**: Ensure email confirmation links use HTTPS
4. **Monitoring**: Set up monitoring for email delivery rates
5. **Logging**: Log confirmation attempts for debugging

## Future Enhancements

1. **Email Templates**: Rich HTML email templates
2. **Multi-language Support**: Localized confirmation emails
3. **Social Login**: Skip email confirmation for social providers
4. **Magic Links**: Passwordless authentication via email
5. **SMS Confirmation**: Alternative phone number confirmation

## Troubleshooting

### Common Issues

1. **Emails Not Received**
   - Check spam folder
   - Verify SMTP configuration
   - Check email service logs

2. **Confirmation Links Not Working**
   - Verify URL encoding
   - Check token expiration
   - Validate database connectivity

3. **Infinite Loading**
   - Check network connectivity
   - Verify API endpoint availability
   - Review browser console for errors

### Debug Steps

1. Check browser network tab for API calls
2. Verify backend logs for error messages
3. Test API endpoints directly with curl/Postman
4. Check email delivery logs
5. Validate database user records

## Support

For issues with the email confirmation flow:

1. Check this documentation first
2. Review test files for expected behavior
3. Check API client implementation
4. Verify backend endpoint responses
5. Test with different email providers

This flow ensures a secure and user-friendly email confirmation process that integrates seamlessly with the Round application's authentication system.
