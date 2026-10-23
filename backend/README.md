# TeamSync Backend API Infrastructure

Official backend service layer for **TeamSync — AI-Based Smart Team Formation System**.

Built with **Node.js, Express.js, TypeScript, and Prisma ORM with PostgreSQL**.

---

## 1. Quick Start Guide

### Prerequisites
- Node.js v18+
- PostgreSQL v14+

### Installation & Environment
```bash
cd backend
npm install
cp .env.example .env
```

### Database Migration Commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Run Database Migrations
npm run prisma:migrate

# Open Prisma Studio GUI
npm run prisma:studio
```

### Development Server
```bash
npm run dev
```

---

## 2. PostgreSQL Relational Models (20 Tables)
1. `User`
2. `StudentProfile`
3. `ProfessionalProfile`
4. `College`
5. `Department`
6. `Location`
7. `Event`
8. `Team`
9. `TeamMember`
10. `TeamJoinRequest`
11. `TeamInvitation`
12. `Skill`
13. `UserSkill`
14. `GitHubAnalysis`
15. `Participation`
16. `Ranking`
17. `Mentorship`
18. `Report`
19. `Notification`
20. `NotificationPreference`

---

## 3. Initial Endpoints
- `GET /api/health` — System status & database connectivity verification.
- `GET /api/colleges` — Institutional roster.
- `GET /api/departments/:collegeId` — Department roster for specific college.
- `GET /api/users/me` — Authenticated user profile.
