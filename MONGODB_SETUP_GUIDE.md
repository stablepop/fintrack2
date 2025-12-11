# MongoDB Setup Guide for FinTrack

Complete step-by-step instructions to run FinTrack with MongoDB locally on your machine using MongoDB Compass.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB installed locally or MongoDB Community
- MongoDB Compass (GUI for MongoDB)
- VS Code or your preferred code editor

---

## Step 1: Install MongoDB Locally

### For Windows:
1. Download MongoDB Community from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the installation wizard
3. MongoDB will be installed at `C:\Program Files\MongoDB\Server\{version}`
4. MongoDB runs as a service by default

### Verify MongoDB is Running:
Open Terminal/Command Prompt and run:
\`\`\`bash
mongosh
\`\`\`

You should see the MongoDB shell prompt. Type `exit` to quit.

---

## Step 2: Install MongoDB Compass

1. Download from: https://www.mongodb.com/products/compass
2. Install on your machine
3. Launch MongoDB Compass

---

## Step 3: Connect MongoDB Compass to Local MongoDB

1. Open MongoDB Compass
2. The default connection string should already be filled:
   \`\`\`
   mongodb://localhost:27017
   \`\`\`
3. Click **Connect**
4. You should now see your MongoDB databases in Compass

---

## Step 4: Set Up Your Project

### Clone or Download the FinTrack Project
\`\`\`bash
# Navigate to your desired directory
cd your-project-folder

# If you have the ZIP file, extract it
# Or if using Git:
git clone <your-repo-url>
cd fintrack
\`\`\`

### Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

---

## Step 5: Create Environment Variables

Create a `.env.local` file in the root of your project:

\`\`\`bash
touch .env.local
\`\`\`

Add the following environment variables:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fintrack

# JWT Secret (create a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-secure-12345

# Node Environment
NODE_ENV=development
\`\`\`

### To Generate a Secure JWT_SECRET:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

Use the output as your `JWT_SECRET` value.

---

## Step 6: Run the Application

### Start the Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

You should see:
\`\`\`
> next dev

  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
\`\`\`

### The app is now running at: **http://localhost:3000**

---

## Step 7: Connect to MongoDB in VS Code (Optional)

### Using VS Code MongoDB Extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search and install **MongoDB for VS Code**
4. Click the MongoDB icon in the left sidebar
5. Click **Add MongoDB Connection**
6. Enter connection string:
   \`\`\`
   mongodb://localhost:27017
   \`\`\`
7. Click **Connect**
8. You can now browse your databases directly in VS Code

---

## Step 8: Test the Application

### Create an Account
1. Go to http://localhost:3000/auth/sign-up
2. Enter:
   - Full Name: Your Name
   - Email: test@example.com
   - Password: testpassword123
3. Click Sign Up
4. You should be redirected to the dashboard

### Check Data in MongoDB Compass
1. Open MongoDB Compass
2. Navigate to: `fintrack` → `users` collection
3. You should see your newly created user

### Add a Transaction
1. Go to Dashboard → Transactions
2. Add a new transaction (Income/Expense)
3. View it in MongoDB Compass under: `fintrack` → `transactions` collection

---

## Step 9: Make Someone an Admin (Optional)

### Using MongoDB Compass:
1. Open MongoDB Compass
2. Go to: `fintrack` → `users` collection
3. Find your user document
4. Edit the user and change `role` from `"user"` to `"admin"`
5. Click Update
6. Refresh your app to see admin features

### Using MongoDB Shell:
\`\`\`bash
mongosh
use fintrack
db.users.updateOne({ email: "test@example.com" }, { $set: { role: "admin" } })
\`\`\`

---

## Step 10: View MongoDB Data

### Using MongoDB Compass:
1. **Users Collection**: `fintrack` → `users`
   - See all registered users, their profiles, and roles

2. **Transactions Collection**: `fintrack` → `transactions`
   - See all income/expense transactions

3. **Budgets Collection**: `fintrack` → `budgets`
   - See all budget records (if any exist)

### Using MongoDB Shell:
\`\`\`bash
mongosh
use fintrack

# View all users
db.users.find()

# View all transactions
db.transactions.find()

# View a specific user's transactions
db.transactions.find({ userId: ObjectId("...") })
\`\`\`

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/sign-up` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Transactions
- `GET /api/transactions` - Get user's transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### User Profile
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile

### Admin Only
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/stats` - Get system statistics

---

## Troubleshooting

### MongoDB Connection Error
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:27017
\`\`\`
**Solution**: Make sure MongoDB is running:
\`\`\`bash
# Windows: MongoDB should run as a service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
\`\`\`

### Port 3000 Already in Use
\`\`\`bash
# Kill the process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
\`\`\`

### JWT Token Errors
Delete your browser cookies or use incognito mode to test login again.

### MongoDB Authentication Failed
If you set up MongoDB with authentication, update `.env.local`:
\`\`\`env
MONGODB_URI=mongodb://username:password@localhost:27017/fintrack
\`\`\`

---

## Development Tips

- **Hot Reload**: The app automatically reloads when you make changes
- **Database Reset**: Delete the `fintrack` database in MongoDB Compass to start fresh
- **Check Logs**: Look at your terminal for API errors
- **Test API**: Use Postman or Thunder Client VS Code extension to test endpoints

---

## Next Steps

1. Customize the app with your branding
2. Deploy to Vercel or another hosting platform
3. Set up a production MongoDB instance (MongoDB Atlas)
4. Add more features and integrations

Enjoy using FinTrack!
