# Gemini Frontend Clone

## Project Overview

A fully functional, responsive Gemini-style conversational AI chat application built with Next.js 15, TypeScript, Redux, and Mantine UI. This application simulates an AI chat interface with OTP authentication, chatroom management, and comprehensive UX features.

## Tech Stack

- **Framework**: Next.js (App Router) with TypeScript
- **State Management**: Redux Toolkit
- **Form Validation**: React Hook Form + Zod
- **UI Framework**: Mantine UI
- **Notifications**: Mantine Notifications
- **Icons**: Tabler Icons React
- **Deployment**: Configured for Vercel

## Features Implemented

### Authentication

- OTP-based login/signup flow with country code selection
- Country data fetched from restcountries.com API with fallback data
- Form validation using React Hook Form + Zod
- Simulated OTP send and validation with setTimeout
- localStorage persistence for authenticated sessions

### Dashboard

- List of user chatrooms with create/delete functionality
- Debounced search to filter chatrooms by title
- Mantine notifications for all user actions
- Dark mode toggle
- Mobile-responsive sidebar navigation
- Loading skeletons for chatroom list

### Chat Interface

- Real-time message display with user and AI messages
- Typing indicator: "Gemini is typing..."
- Simulated AI responses with throttling
- Auto-scroll to latest message
- Reverse infinite scroll to load older messages
- Client-side pagination (20 messages per page)
- Image upload support using base64/preview URL
- Copy-to-clipboard feature on message hover
- Message timestamps
- Mobile-responsive chat layout

### Global UX Features

- Dark mode toggle with Mantine color scheme
- Fully mobile-responsive design
- Loading skeletons for async operations
- Keyboard accessibility (Enter key support, etc.)
- localStorage persistence for auth and chat data
- Toast notifications using Mantine Notifications

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main page with auth routing
│
├── components/                   # Reusable React components
│   ├── auth/                     # Authentication components
│   │   └── OTPLogin.tsx          # OTP login/signup form
│   ├── chat/                     # Chat interface components
│   │   └── ChatInterface.tsx     # Chat UI with messages
│   └── dashboard/                # Dashboard components
│       └── Dashboard.tsx         # Main dashboard with sidebar
│
├── data/                         # Static data
│   └── countrylist/              # Country list data
|
├── lib/                          # Library configurations
│   ├── StoreProvider.tsx         # Redux Provider wrapper
│   └── theme.ts                  # Mantine theme configuration
│
├── schemas/                      # Zod / Yup validation schemas
│   ├── otpSchema.ts              # OTP validation schema
│   └── phoneSchema.ts            # Phone number validation schema
|
├── store/                        # Redux store
│   ├── authSlice.ts              # Authentication state
│   ├── chatSlice.ts              # Chat state management
│   ├── hooks.ts                  # Typed Redux hooks
│   └──index.ts                   # Store configuration
|
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Global types
│
└── utils/                        # Utility functions
    ├── generateDummyMessages.ts  # Dummy data for pagination
    ├── hooks.ts                  # Custom React hooks
    ├── localStorage.ts           # localStorage helpers
    └── simulateAI.ts             # AI response simulation
```

## Key Implementation Details

### Throttling AI Responses

AI responses are simulated using `setTimeout` with a configurable delay. The `simulateAIResponse` function in `utils/simulateAI.ts` handles:

- Showing typing indicator
- Throttled response generation
- Callback-based response delivery

### Pagination & Infinite Scroll

- Reverse infinite scroll detects when user scrolls to top
- Loads 20 dummy messages per page
- Maintains scroll position after loading
- Limited to 5 pages (100 messages) in demo
- Implementation in `ChatInterface.tsx` using `onScroll` handler

### Form Validation

Uses React Hook Form with Zod resolvers for type-safe validation:

- Phone number validation (6-15 digits)
- OTP validation (exactly 6 digits)
- Country code selection required
- Real-time error messages

### localStorage Persistence

Two main storage keys:

- `gemini_auth`: User authentication data
- `gemini_chatrooms`: All chatrooms with messages
- Automatic serialization/deserialization of Date objects

## Running the Application

### Development

```bash
npm run dev
```

Server runs on <http://localhost:3000>

### Production Build

```bash
npm run build
npm run start
```

## Current State

The application is fully functional with all required features implemented. The development server is running and the app is ready for deployment to Vercel.

## Notes

- The restcountries.com API may fail due to network restrictions; fallback country data is provided
- OTP verification accepts any 6-digit code in development mode
- All date/time handling uses browser's local timezone
- Dark mode preference is not persisted (resets on page reload)

## Live Deployment & Repository

- **GitHub Repository Link:** [https://github.com/shubhadip2002git/gemini_frontend_clone](https://github.com/shubhadip2002git/gemini_frontend_clone)  

- **Live Deployment Link (Vercel):** [https://gemini-frontend-clone-shubha2002.vercel.app](https://gemini-frontend-clone-shubha2002.vercel.app)
