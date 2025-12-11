# MongoDB Migration Guide

Your Personal Finance Tracker has been successfully migrated from Supabase to MongoDB with Mongoose!

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install mongoose bcryptjs jsonwebtoken jose
\`\`\`

### 2. Set Environment Variables

Add these to your `.env.local` file:

\`\`\`env
# MongoDB Connection String (required)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret (required - change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
\`\`\`

To get your MongoDB connection string:
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string from the cluster dashboard
4. Replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your values

### 3. Start the Application

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

## Key Changes from Supabase

### Database
- **Supabase**: PostgreSQL with SQL
- **MongoDB**: NoSQL document database with Mongoose ODM

### Authentication
- **Supabase**: Built-in Supabase Auth with JWT
- **MongoDB**: Custom JWT authentication with bcrypt password hashing

### User Model
\`\`\`javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  fullName: String,
  avatarUrl: String,
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Transaction Model
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  category: String,
  description: String,
  amount: Number,
  type: 'income' | 'expense',
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Budget Model
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  category: String,
  limitAmount: Number,
  period: 'monthly' | 'yearly',
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Create new account
- `POST /api/auth/login` - Login to account
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get specific transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users` - Delete a user
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/stats` - Get system statistics

## Features

### User Panel
- Sign up and login with email/password
- View personal dashboard with income/expense overview
- Manage transactions (add, edit, delete)
- View transaction history with charts
- Update profile settings
- Responsive design (mobile, tablet, desktop)

### Admin Panel
- View all users in the system
- View all transactions across users
- See system-wide statistics (total income, expenses, user count)
- Delete users (except other admins)
- Manage system from `/admin` route

## Making Someone an Admin

To make a user an admin, you need to update their role in MongoDB:

1. Open MongoDB Atlas
2. Go to your cluster → Collections
3. Find the `users` collection
4. Find the user document you want to make admin
5. Edit the `role` field from `"user"` to `"admin"`

Or use Mongoose CLI:
\`\`\`javascript
db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } })
\`\`\`

## Security Notes

1. **JWT Secret**: Always use a strong, random JWT_SECRET in production
2. **Password Hashing**: Passwords are hashed with bcryptjs (10 rounds)
3. **HTTP Only Cookies**: Auth tokens are stored in HTTP-only cookies
4. **User Isolation**: Users can only see their own transactions and profile
5. **Admin Verification**: All admin routes verify user role before granting access

## Troubleshooting

### MongoDB Connection Error
- Verify your `MONGODB_URI` is correct
- Check that your IP is whitelisted in MongoDB Atlas security settings
- Ensure the database name is correct

### Authentication Issues
- Clear cookies in your browser
- Check that `JWT_SECRET` is set in environment variables
- Verify the user exists in the database

### Transactions Not Loading
- Ensure you're logged in
- Check browser console for error messages
- Verify the user ID in your JWT token matches the database

## Migration from Supabase Data

If you have existing data in Supabase, you'll need to:

1. Export data from Supabase PostgreSQL
2. Transform to MongoDB document format
3. Import to MongoDB using mongoimport or Mongoose scripts

Contact support for migration assistance.
