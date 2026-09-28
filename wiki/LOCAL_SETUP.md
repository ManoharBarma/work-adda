# Sircilla Workers App - Local Setup Guide

Follow these steps to run the project locally on your laptop tomorrow:

## 1. Install Dependencies
Make sure you are in the project folder (`work-sircilla(tempname)`) and run:
```bash
npm install
```

## 2. Setup the Database
Since the project uses an SQLite database (`prisma/dev.db`), you need to push the Prisma schema to the database to ensure all tables are created properly:
```bash
npx prisma db push
```

## 3. Seed the Database with Dummy Data
If you want to populate the database with the categories, localities, and dummy workers:
```bash
npx prisma db seed
```

## 4. Run the Development Server
Start the local Next.js server:
```bash
npm run dev
```

## 5. View the App
Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

---

### Important URLs to Remember:
- **Home Page:** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3000/admin`
- **Register Page:** `http://localhost:3000/register`

---

## 📱 How to test on your Mobile Phone

To view the app on your mobile phone, both your laptop and phone must be connected to the **same Wi-Fi network**.

**1. Find your laptop's Local IP Address:**
Run this command in a new terminal:
```bash
ipconfig
```
*Look for the "IPv4 Address" under your Wi-Fi adapter (it usually looks like `192.168.x.x` or `10.x.x.x`).*

**2. Open the app on your phone:**
Type that IP address into your mobile browser with `:3000` at the end.
Example: `http://192.168.1.5:3000`
