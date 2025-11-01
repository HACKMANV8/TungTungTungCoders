# CaseMate Pro - Frontend Documentation

## 🎉 What's Built

A complete, professional React frontend for your LegalTech CRM with:

### ✅ Pages & Features
- **Landing Page** (`/`) - Professional hero section with features showcase
- **Authentication** (`/auth`) - Login & signup with role selection (lawyer/client)
- **Lawyer Dashboard** (`/lawyer/dashboard`) - Stats, active cases, quick actions
- **Client Dashboard** (`/client/dashboard`) - Personal case view, documents, appointments
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### 🎨 Design System
- Professional blue primary color (legal trust)
- Amber accent color (premium feel)
- Clean semantic tokens in `src/index.css`
- Reusable components with proper variants
- Modern shadows, transitions, and animations

### 🧩 Components Created
- `DashboardLayout` - Main layout with sidebar and header
- `AppSidebar` - Collapsible navigation sidebar
- `DashboardHeader` - Search, notifications, user profile
- `StatsCard` - Reusable stats display with icons
- `CaseCard` - Case information cards with status badges

### 📁 File Structure
```
src/
├── components/
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   ├── AppSidebar.tsx
│   ├── DashboardHeader.tsx
│   ├── StatsCard.tsx
│   └── CaseCard.tsx
├── pages/
│   ├── Index.tsx (landing)
│   ├── Auth.tsx (login/signup)
│   ├── lawyer/
│   │   └── LawyerDashboard.tsx
│   └── client/
│       └── ClientDashboard.tsx
├── index.css (design tokens)
└── App.tsx (routing)
```

---

## 🔌 Backend Integration Guide

### Step 1: API Configuration
Create `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Cases
  getCases: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/cases`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // Add more endpoints as needed...
};
```

### Step 2: Environment Variables
Create `.env` file:
```
VITE_API_URL=http://localhost:8080/api
```

### Step 3: Update Auth Page
In `src/pages/Auth.tsx`, replace mock calls:

```typescript
// Replace lines 18-30 with:
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  
  const formData = new FormData(e.currentTarget);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  try {
    const data = await api.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    toast({ title: "Login successful!" });
    navigate(data.user.role === 'lawyer' ? '/lawyer/dashboard' : '/client/dashboard');
  } catch (error) {
    toast({ 
      title: "Login failed", 
      description: "Please check your credentials",
      variant: "destructive" 
    });
  } finally {
    setIsLoading(false);
  }
};
```

### Step 4: Update Dashboard Pages
In `src/pages/lawyer/LawyerDashboard.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const LawyerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        const [statsData, casesData] = await Promise.all([
          api.getStats(token),
          api.getCases(token)
        ]);
        setStats(statsData);
        setCases(casesData.cases);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  // ... rest of component
};
```

---

## 📋 Complete Backend API Spec

See `API_DOCUMENTATION.md` for:
- ✅ All 16 endpoint specifications
- ✅ Request/response examples
- ✅ Authentication flow
- ✅ Error handling
- ✅ Security guidelines
- ✅ Database schema suggestions
- ✅ Spring Boot setup guide

---

## 🚀 Next Steps

### 1. Set Up Your Spring Boot Backend
```bash
# Create Spring Boot project with dependencies:
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL Driver
- JWT (jjwt)
```

### 2. Implement the API Endpoints
Follow the exact specifications in `API_DOCUMENTATION.md`

### 3. Configure CORS
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:8080", "https://yourdomain.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 4. Test with Postman
Test each endpoint before connecting frontend

### 5. Connect Frontend
- Update `src/lib/api.ts` with all endpoints
- Replace mock data in components
- Add loading states
- Add error handling

### 6. Deploy
- Frontend: Deploy to Vercel/Netlify (npm run build)
- Backend: Deploy to Heroku/Railway/AWS

---

## 🎨 Customization Tips

### Change Colors
Edit `src/index.css`:
```css
--primary: 221 83% 53%;  /* Blue */
--accent: 43 96% 56%;    /* Amber */
```

### Add More Pages
1. Create file in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation in `AppSidebar.tsx`

### Modify Sidebar
Edit `src/components/AppSidebar.tsx`:
- Add/remove menu items
- Change icons
- Adjust styling

---

## 📦 What You Have

- ✅ Modern, professional UI
- ✅ Responsive design
- ✅ Clean architecture
- ✅ Reusable components
- ✅ Type-safe TypeScript
- ✅ Semantic design tokens
- ✅ Complete routing
- ✅ Ready for backend integration

---

## 🔗 Important Files

- **Design System**: `src/index.css`, `tailwind.config.ts`
- **Routing**: `src/App.tsx`
- **API Spec**: `API_DOCUMENTATION.md`
- **Components**: `src/components/`
- **Pages**: `src/pages/`

---

## ❓ Need Help?

The frontend is 100% ready and waiting for your Spring Boot backend! Just follow the API documentation and you'll be up and running quickly.

Happy coding! 🚀
