# How to Access the Admin Panel

## Step-by-Step Instructions

### Step 1: Create a User Account
1. Go to your app at `http://localhost:3000`
2. Click on **Sign Up** or go to `http://localhost:3000/auth/sign-up`
3. Fill in the form:
   - **Full Name**: Enter your name (e.g., "Admin User")
   - **Email**: Enter your email (e.g., `admin@example.com`)
   - **Password**: Enter a secure password
4. Click **Sign Up**
5. You'll be redirected to the dashboard

### Step 2: Make Your Account an Admin

You need to promote your user account to admin role. You have two options:

#### Option A: Using MongoDB Compass (Recommended)

1. **Open MongoDB Compass**
2. Connect to your MongoDB database (usually `mongodb://localhost:27017`)
3. Navigate to: `Database` → `fintrack` → `users` collection
4. Find your user by email (click the user document)
5. Look for the `role` field - it should say `"user"`
6. Click on the `role` field and change it from `"user"` to `"admin"`
7. Click the **Update** button
8. **Refresh your app** (`http://localhost:3000`)

#### Option B: Using MongoDB Shell

\`\`\`bash
# Open MongoDB Shell
mongosh

# Connect to your database and update the user
use fintrack
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
\`\`\`

Replace `admin@example.com` with your actual email.

### Step 3: Access the Admin Panel

1. **Log in** to your account at `http://localhost:3000/auth/login`
2. Once logged in, go directly to: `http://localhost:3000/admin`
3. You should now see the **Admin Dashboard**

### What You'll See in Admin Panel

- **Overview Stats**:
  - Total number of users in the system
  - Total transactions across all users
  - Total income from all users
  - Total expenses from all users

- **User Management Table**:
  - List of all users with their email, name, and role
  - Join dates for each user
  - Delete user button (can't delete other admins)

- **Transaction Viewing**:
  - See all transactions from all users
  - Filter by user if needed

## Troubleshooting

### Admin Panel Not Loading?

1. **Check if you're logged in**
   - Visit `http://localhost:3000/auth/login` to log in

2. **Verify your role is set to "admin"**
   - Open MongoDB Compass
   - Check your user document in the `users` collection
   - Confirm the `role` field says `"admin"`

3. **Clear browser cache and refresh**
   - Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
   - Clear cookies and cached data
   - Refresh the app

4. **Check MongoDB connection**
   - Make sure MongoDB is running: `mongosh`
   - Verify `MONGODB_URI` in your `.env.local` is correct

### Users Table Not Showing?

- Make sure you're logged in as an admin
- Check that there are other users in the system
- If no users appear, you may need to create more test accounts first

## Creating Test Admin Users

To have multiple admin users:

1. Create user accounts through `/auth/sign-up`
2. Use MongoDB Compass to set their `role` to `"admin"`
3. Log in with each account to test different admin scenarios

## Removing Admin Access

If you want to downgrade an admin back to a regular user:

1. Open MongoDB Compass
2. Find the user in the `users` collection
3. Change their `role` from `"admin"` to `"user"`
4. Click **Update**
5. They'll lose admin access after their next login