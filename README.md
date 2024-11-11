# File uploader project
To build a stripped down version of a personal storage service eg google drive.


## Live Project
deployed on: railway
https://fileuploader-production-ffbc.up.railway.app/


## Features

- User authentication with Passport.js and session management
- File upload and download functionality
- Folder organization system (Create, Read, Update, Delete)
- Cloud storage integration with Supabase
- File metadata tracking (name, size, upload time)

## Tech Stack

- **Backend**: Express.js
- **Database**: PostgreSQL with Prisma ORM, stored on railway
- **Authentication**: Passport.js with Local Strategy
- **Session Management**: express-session with @quixo3/prisma-session-store
- **File Upload**: Multer
- **Cloud Storage**: Supabase Storage
- **Password Hashing**: bcryptjs
