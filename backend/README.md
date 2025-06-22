Create a `.env` file in the `backend` directory and add the following variables.

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:8080

# Database
# Replace with your actual MongoDB connection string
MONGO_URI=your_mongodb_connection_string

# Authentication
# This is a secret key for signing JWTs, can be any long random string
JWT_SECRET=your_jwt_secret_key_12345

# Email Configuration (for sending order notifications)
# Use your Gmail account for sending emails.
# IMPORTANT: You need to generate an "App Password" from your Google Account security settings.
# Do not use your regular Gmail password here.
# See: https://support.google.com/accounts/answer/185833
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Running the Backend

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install` 