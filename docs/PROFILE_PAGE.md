# 👤 User Profile Page

## Overview
A comprehensive user profile page where users can view their account information, security settings, statistics, and manage their account.

---

## 🎯 Features

### 1. **Profile Header** 
- **Large Avatar**: 120px circular avatar with user initials
- **User Info**: Full name with gradient text
- **Email Display**: User's email address
- **Status Badges**: 
  - "Active User" badge (default)
  - "Admin" badge (if user has admin role)

### 2. **Account Information Section**
Displays user account details:
- ✅ First Name
- ✅ Last Name
- ✅ Email Address
- ✅ User ID
- ✅ Account Created Date
- ✅ Last Updated Date

**Features:**
- Edit button (coming soon)
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Read-only fields with styled backgrounds

### 3. **Security Section**
Security-related information:
- ✅ Password (masked as ••••••••)
- ✅ Two-Factor Authentication status
- 🔜 Change Password button (coming soon)

### 4. **Account Statistics**
Visual stats cards showing:
- 💵 **Total Expenses**: 0 (Phase 3)
- 📁 **Categories**: 0 (Phase 3)
- 📈 **Reports**: 0 (Phase 3)

### 5. **Danger Zone**
Account deletion section:
- ⚠️ Warning styling (red border, pink background)
- Delete Account button (disabled, coming soon)
- Clear warning message

---

## 🎨 Design Features

### Visual Elements
- **Large Avatar**: 120px with gradient background
- **Section Cards**: White cards with rounded corners
- **Grid Layout**: Responsive 2-column grid
- **Badges**: Gradient badges for status
- **Buttons**: Primary, Secondary, and Danger variants

### Color Coding
- **Primary Actions**: Purple gradient
- **Warning/Admin**: Orange/Red gradient
- **Danger Zone**: Red border with pink tint
- **Info Fields**: Light gray background

### Animations
- ✅ Fade-in on page load
- ✅ Button hover effects
- ✅ Avatar scale on hover
- ✅ Smooth transitions (300ms)

---

## 📱 Access Methods

### 1. **From Dashboard**
Click on your avatar (initials) in the header → Navigate to profile

### 2. **Direct URL**
```
http://localhost:3000/profile
```

### 3. **User Info Click**
Click on user name or avatar anywhere it appears

---

## 🔗 Navigation

### In Profile Page:
- **Logo Click**: Returns to dashboard
- **Back Button**: Explicit button to return to dashboard
- **Logout Button**: Signs out and redirects to login

### Navigation Flow:
```
Dashboard → Click Avatar → Profile Page → Back Button → Dashboard
```

---

## 📊 Page Sections

### Section 1: Profile Header
```
┌─────────────────────────────────────┐
│  [Avatar]  John Doe                 │
│            john@example.com          │
│            [Active User] [Admin]    │
└─────────────────────────────────────┘
```

### Section 2: Account Information
```
┌─────────────────────────────────────┐
│  Account Information    [Edit]      │
├─────────────────────────────────────┤
│  First Name    │  Last Name         │
│  John          │  Doe               │
│                                     │
│  Email Address │  User ID           │
│  john@email    │  12345             │
│                                     │
│  Created       │  Updated           │
│  Nov 2, 2025   │  Nov 2, 2025       │
└─────────────────────────────────────┘
```

### Section 3: Security
```
┌─────────────────────────────────────┐
│  Security                           │
├─────────────────────────────────────┤
│  Password      │  2FA               │
│  ••••••••      │  Not Enabled       │
│                                     │
│  [Change Password (Coming Soon)]    │
└─────────────────────────────────────┘
```

### Section 4: Statistics
```
┌───────────┐ ┌───────────┐ ┌───────────┐
│ 💵 Total  │ │ 📁 Categ. │ │ 📈 Report │
│    0      │ │    0      │ │    0      │
│ Phase 3   │ │ Ready     │ │ None yet  │
└───────────┘ └───────────┘ └───────────┘
```

### Section 5: Danger Zone
```
┌─────────────────────────────────────┐
│  ⚠️ Danger Zone                     │
├─────────────────────────────────────┤
│  Delete Account                     │
│  Once you delete your account...    │
│                                     │
│  [Delete Account (Coming Soon)]     │
└─────────────────────────────────────┘
```

---

## 🎨 Component Styles

### Badges
```css
.badge-primary    → Purple gradient (Active User)
.badge-admin      → Red gradient (Admin)
.badge-warning    → Orange gradient (Not Enabled)
```

### Buttons
```css
.btn-primary      → Purple gradient, hover lift
.btn-secondary    → White with purple border
.btn-danger       → Red gradient for dangerous actions
```

### Layout
```css
Profile Container → Max-width 900px, centered
Profile Header    → Flex row, gap 32px
Profile Grid      → 2-column responsive
Profile Section   → White card with shadow
```

---

## 📱 Responsive Design

### Desktop (> 768px)
- 2-column grid layout
- Horizontal profile header
- Side-by-side buttons

### Mobile (< 768px)
- Single column layout
- Stacked profile header (centered)
- Full-width buttons
- Compact padding

---

## 🔐 Security & Privacy

### Protected Route
- ✅ Requires authentication
- ✅ Redirects to login if not authenticated
- ✅ Only shows own user data

### Data Display
- ✅ Read-only by default
- ✅ Password masked (••••••••)
- ✅ User ID visible (for support)
- ✅ Timestamps for audit

---

## 🚀 Future Enhancements (Coming Soon)

### Phase 3 Features
1. **Edit Profile**
   - Inline editing
   - Form validation
   - Save/Cancel buttons

2. **Change Password**
   - Current password verification
   - New password with strength meter
   - Confirmation field

3. **Two-Factor Authentication**
   - QR code setup
   - Enable/Disable toggle
   - Backup codes

4. **Profile Picture Upload**
   - Image upload
   - Crop and resize
   - Avatar preview

5. **Real Statistics**
   - Actual expense counts
   - Category breakdown
   - Monthly trends

6. **Account Deletion**
   - Confirmation modal
   - Password verification
   - Export data before deletion

---

## 🎯 User Experience Features

### Visual Feedback
- ✅ Hover effects on interactive elements
- ✅ Smooth transitions
- ✅ Clear section separation
- ✅ Consistent styling

### Accessibility
- ✅ Clear labels (uppercase, bold)
- ✅ High contrast text
- ✅ Logical tab order
- ✅ Descriptive titles

### Navigation
- ✅ Back to dashboard button
- ✅ Clickable logo
- ✅ Logout option
- ✅ Breadcrumb-style navigation

---

## 📊 Data Displayed

### From User Object
```typescript
{
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  roles: string[],
  createdAt: string,
  updatedAt: string
}
```

### Calculated Fields
- **Initials**: First letter of first name + first letter of last name
- **Full Name**: firstName + lastName
- **Formatted Dates**: Month Day, Year at HH:MM AM/PM

---

## 🎨 Design Highlights

### Gradient Text
```
User Name → Purple to pink gradient
```

### Shadow Layers
```
Cards     → 0 4px 12px rgba(0,0,0,0.05)
Avatar    → 0 8px 24px rgba(102,126,234,0.3)
Buttons   → 0 4px 12px with color tint
```

### Border Radius
```
Cards     → 16px
Badges    → 20px (pill shape)
Buttons   → 8px
Avatar    → 50% (circle)
```

---

## 🧪 Testing Checklist

✅ Page loads with user data
✅ Avatar displays correct initials
✅ All fields show correct information
✅ Dates format correctly
✅ Badges display based on roles
✅ Navigation works (back, logout, logo)
✅ Responsive on mobile
✅ Hover effects work
✅ Disabled buttons are non-clickable

---

## 🔗 Related Files

### Components
- `/frontend/src/pages/ProfilePage.tsx` - Main component
- `/frontend/src/App.tsx` - Route configuration

### Styles
- `/frontend/src/App.css` - Profile page styles
  - Lines 490-755: Profile-specific styles

### Store
- `/frontend/src/store/authStore.ts` - User state management

### API
- `/frontend/src/api/authApi.ts` - Authentication API

---

## 💡 Usage Example

### Navigating to Profile
```typescript
// From any component
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/profile')
```

### Accessing User Data
```typescript
import { useAuthStore } from '../store/authStore'

const { user } = useAuthStore()
console.log(user.firstName) // "John"
console.log(user.email)     // "john@example.com"
```

---

**Built with ❤️ for excellent user account management!**

**View your profile at:** http://localhost:3000/profile 👤✨

