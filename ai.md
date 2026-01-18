# Twitch Clone - Project Reference Document

> **Last Updated:** 2026-01-17  
> **Status:** Phase 5 - Complete ✅  
> This document serves as the **single source of truth** for the AI agent. Reference this file at the start of every session.

---

## 📋 Project Overview

A basic Twitch clone with core streaming features, built with modern web technologies. The application supports light and dark themes using Twitch's official color palette.

### Tech Stack

| Category      | Technology                       |
| ------------- | -------------------------------- |
| Frontend      | Next.js 16, React 19, TypeScript |
| Styling       | Tailwind CSS 4, Next Themes      |
| Backend       | Convex                           |
| Auth          | Convex Auth                      |
| Forms         | React Hook Form + Zod            |
| UI Components | Custom Components (Radix-like)   |
| Streaming     | LiveKit                          |

---

## 🎥 Streaming Technology: LiveKit ✅

> [!NOTE]
> **Selected:** LiveKit has been chosen as the streaming provider for this project.

### **LiveKit**

- **Type:** WebRTC-based real-time streaming
- **Latency:** Ultra-low (~100ms)
- **Features:** Open-source, self-hostable, excellent React SDK, supports streaming + chat
- **Pricing:** Free (self-hosted) or cloud pricing based on usage
- **Docs:** https://livekit.io

### **Required Packages**

```bash
npm install @livekit/components-react livekit-client livekit-server-sdk
```

---

## 🎨 Theme Colors (Twitch Brand)

```css
/* Primary Purple */
--twitch-purple: #9146ff;
--twitch-purple-dark: #772ce8;
--twitch-purple-light: #bf94ff;

/* Light Theme */
--bg-light: #ffffff;
--bg-secondary-light: #f7f7f8;
--text-light: #18181b;
--text-secondary-light: #53535f;

/* Dark Theme */
--bg-dark: #0e0e10;
--bg-secondary-dark: #18181b;
--text-dark: #efeff1;
--text-secondary-dark: #adadb8;
```

---

## ✅ Phase 1: Database Tables ✅ COMPLETE

### Tables Created

- [x] `users` - User profiles and account data
- [x] Convex auth tables (handled by @convex-dev/auth)
- [x] `streams` - Stream metadata, status, thumbnails
- [x] `chatRooms` - Chat room configuration per stream
- [x] `chatMessages` - Individual chat messages
- [x] `follows` - User follow relationships
- [x] `streamViewers` - Track active viewers per stream

### Indexes Created (27 total)

- [x] `users` by username, email, streamKey
- [x] `streams` by userId, status, createdAt, livekitRoomName
- [x] `chatMessages` by chatRoomId, createdAt, userId
- [x] `follows` by followerId, followingId, follower_and_following
- [x] `streamViewers` by streamId, userId, stream_and_user, sessionId

---

## ✅ Phase 2: Authentication ✅ COMPLETE

### Convex Auth Setup

- [x] Install and configure @convex-dev/auth
- [x] Configure auth providers (email/password)
- [x] Set up ResendOTP for email verification

### Authentication UI

- [x] Auth layout with branding
- [x] Login page with form validation
- [x] Register page with validation
- [x] OTP verification page (6-digit input with auto-focus)
- [x] Home page with auth-aware header
- [x] Session management via ConvexAuthProvider

---

## ✅ Phase 3: Backend Endpoints ✅ COMPLETE

### Authentication Endpoints (via @convex-dev/auth)

- [x] Register user (Password provider)
- [x] Login user (Password provider)
- [x] Verify OTP (ResendOTP)
- [x] Logout (signOut)
- [x] Get current user (`users.current`)

### Dashboard Endpoints (dashboard.ts)

- [x] Get dashboard stats (`dashboard.getStats`)
- [x] Get user's streams (`dashboard.getMyStreams`)
- [x] Get recent activity (`dashboard.getRecentActivity`)

### User Endpoints (users.ts, follows.ts)

- [x] Get user profile (`users.getById`)
- [x] Update user profile (`users.updateProfile`)
- [x] Get user by username (`users.getByUsername`)
- [x] Follow/Unfollow user (`users.follow`, `users.unfollow`)
- [x] Get followers/following (`follows.getFollowers`, `follows.getFollowing`)
- [x] Check follow status (`follows.isFollowing`)

### Streaming Endpoints (streams.ts)

- [x] LiveKit selected as streaming provider
- [x] Stream creation (`streams.create`)
- [x] Stream updates (`streams.update`)
- [x] Stream status management (`streams.startStream`, `streams.endStream`)
- [x] Stream key management (`users.generateStreamKey`)
- [x] Viewer count tracking (`viewers.getViewerCount`)

### Chat Endpoints (chat.ts)

- [x] Create chat room (`chat.createRoom`)
- [x] Get chat room (`chat.getRoomByStreamId`)
- [x] Send message (`chat.sendMessage`)
- [x] Get chat history (`chat.getMessages`)
- [x] Moderate chat (`chat.deleteMessage`, `chat.updateRoomSettings`)

### Search Endpoints (search.ts)

- [x] Search users by username (`search.searchUsers`)
- [x] Search streams by title (`search.searchStreams`)
- [x] Search live streams (`search.searchLive`)

---

## ✅ Phase 4: Layout & Components ✅ COMPLETE

### Reusable Components

- [x] Button variants (primary, secondary, ghost, danger)
- [x] Input with icons and error states
- [x] Modal/Dialog system
- [x] Avatar with online/live indicators
- [x] Badge (live, mod, etc.)
- [x] Card components (StreamCard, UserCard)
- [x] Dropdown menu
- [x] Toast notifications
- [x] Loading skeletons + Spinner

### Layout

- [x] Main layout wrapper
- [x] Collapsible Sidebar with persisted state
- [x] Header with SearchBar and UserMenu
- [x] Theme toggle (light/dark)
- [x] Mobile responsive navigation

---

## ✅ Phase 5: Dashboard ✅ COMPLETE

### Dashboard Features

- [x] Dashboard overview page
- [x] Stats cards (followers, views, streams)
- [x] Stream manager with stream key display
- [x] Quick actions panel
- [x] Recent activity feed

### Backend Integration

- [x] Connected to dashboard.getStats
- [x] Connected to dashboard.getMyStreams
- [x] Connected to dashboard.getRecentActivity
- [x] Loading states & error handling

---

## ✅ Phase 6: Stream Page ✅ COMPLETE

### Stream Page

- [x] Video player component
- [x] Stream info section
- [x] Streamer profile card
- [x] Viewer count display
- [x] Follow button

### Chat Component

- [x] Chat message list
- [x] Chat input
- [x] Emote picker
- [x] User badges
- [x] Moderation tools

### Backend Integration

- [x] Real-time chat with Convex
- [x] Stream data fetching
- [x] Viewer tracking

---

## ✅ Phase 7: Search

### Search Page

- [ ] Search results layout
- [ ] User results section
- [ ] Stream results section
- [ ] Filters (live, categories)
- [ ] Pagination

### Header Search Bar

- [x] Search input with suggestions (Implemented in Phase 4)
- [x] Quick results dropdown (Implemented in Phase 4)
- [ ] Navigate to search page

---

## ✅ Phase 8: Admin Dashboard

### Admin Features

- [ ] Admin authentication/role check
- [ ] Admin dashboard overview
- [ ] User management (list, ban, edit)
- [ ] Stream management (moderate, feature)
- [ ] Site statistics
- [ ] Report handling
- [ ] Content moderation tools

---

## 📁 Project Structure

```
twitch/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── verify/
│   ├── (main)/
│   │   ├── dashboard/page.tsx
│   │   ├── [username]/
│   │   ├── search/
│   │   └── stream/[id]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Sidebar, Header, etc.
│   ├── stream/      # Stream cards, etc.
│   ├── dashboard/   # Dashboard widgets
│   └── providers/
├── convex/
│   ├── schema.ts
│   ├── auth.ts
│   └── ... (backend functions)
├── lib/
│   └── utils.ts
└── ai.md
```

---

## 📝 Session Notes

### Session 1 - 2026-01-17

- Created ai.md file
- Project structure reviewed
- Selected LiveKit for streaming
- **Phase 1 Complete:** Database schema & indexes
- **Phase 2 Complete:** Auth UI & Convex Auth setup
- **Phase 3 Complete:** 37 backend endpoints deployed

### Session 2 - 2026-01-17

- **Phase 4 Complete:**
  - Implemented comprehensive UI component library (10+ components)
  - Built main layout with collapsible sidebar and mobile drawer
  - Created header with global search and theme toggle
- **Phase 5 Complete:**
  - Built dashboard with stats, stream manager, and activity feed
  - Integrated all dashboard components with Convex backend
  - Added stream key management (generate/view)

### Session 3 - 2026-01-18

- **Phase 6 Complete:**
  - Implemented complete stream page with responsive layout
  - Built real-time chat system with emojis and moderation
  - Created video player component with LiveKit integration (placeholder mode)
  - Added stream info display and streamer profile card
  - Fixed Next.js 16 async params handling
  - Created `useAuth` utility hook

---

## 🚀 Current Focus

**Phase:** Phase 7 - Search  
**Next Action:** Implement search results page and filtering

---

## ⚠️ Blockers & Dependencies

| Item             | Status     | Notes               |
| ---------------- | ---------- | ------------------- |
| Resend API key   | ⏳ Pending | Needed for OTP      |
| LiveKit API keys | ⏳ Pending | Needed for Phase 6+ |
