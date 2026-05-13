# Nail Club

A Vue 3 nail salon booking app with customer authentication and an admin dashboard.

## Tech Stack

- **Vue 3** + Vite (Composition API)
- **Vue Router 4** with auth guards
- **Pinia** for state management
- **Firebase** — Authentication + Firestore
- **Tailwind CSS**

## Setup

### 1. Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project
2. Enable **Authentication** → Sign-in methods → Email/Password
3. Enable **Firestore Database** (start in test mode, then apply the rules below)

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your Firebase config:

```
cp .env.example .env
```

Your Firebase config keys are in: Firebase Console → Project Settings → Your apps → SDK setup

### 3. Install and run

```bash
npm install
npm run dev
```

### 4. Apply Firestore security rules

In the Firebase console, go to **Firestore → Rules** and paste the contents of `firestore.rules`.

### 5. Create your first admin user

1. Register an account through the app at `/register`
2. In the Firebase console, go to **Firestore → users collection**
3. Find your user document and change `role` from `"customer"` to `"admin"`
4. You now have access to `/admin`

## Features

### Customer
- Register / login with email + password
- Browse services on the home page
- Multi-step appointment booking (service → date/time → confirm)
- View upcoming and past appointments
- Cancel upcoming appointments

### Admin (`/admin`)
- Dashboard with stats and upcoming appointments
- Manage all appointments — confirm, complete, cancel
- CRUD for nail services
- Set available time slots per day (availability calendar)

## Project Structure

```
src/
├── firebase/config.js       # Firebase init
├── stores/
│   ├── auth.js              # Auth state + login/register/logout
│   ├── appointments.js      # Booking CRUD
│   ├── services.js          # Services CRUD
│   └── availability.js      # Time slot management
├── router/index.js          # Routes + auth guards
├── views/
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── BookingView.vue      # 3-step booking flow
│   ├── MyAppointmentsView.vue
│   └── admin/
│       ├── AdminDashboard.vue
│       ├── AdminAppointments.vue
│       ├── AdminServices.vue
│       └── AdminAvailability.vue
└── components/ui/           # Navbar, Footer, Modal, Spinner
```
