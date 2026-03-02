# localhub
This project was built for local tech communities in Nigeria — especially communities that regularly meet through innovation hubs and developer groups.

These communities are very active:

- people share job opportunities,
- announce meetups,
- ask for technical help,
- review CVs,
- collaborate on side projects,
- and mentor upcoming developers.

However, most of these valuable interactions happen inside fast-moving chat platforms where:

- information gets buried,
- opportunities are hard to find later,
- and collaboration history is lost.

LocalHub is built to give communities a simple, public and searchable workspace where these interactions can live permanently and remain useful to everyone.

---

## What I Built

LocalHub is a lightweight community workspace that helps local tech communities organise their opportunities, support requests and collaborations in one place.

Instead of building separate tools for jobs, events, help requests and project collaboration, LocalHub uses a single shared structure and exposes them as focused community boards:

- 🆘 **HelpDesk** – request help for debugging, CV review, interview prep and setup support  
- 💼 **Jobs** – community-shared job and internship opportunities  
- 📅 **Events / Meetups** – community events and learning sessions  
- 🤝 **Projects** – share what you’re building and find collaborators  
- 📝 **Wiki / Articles (optional)** – community knowledge and learning notes  

All content is:

- tagged by skills,
- searchable,
- and organised by purpose.

The goal is to turn short-lived conversations into long-term community assets.

---

## Demo

👉 [Live demo](https://localhub-one.vercel.app/)

---


## How I Built It

LocalHub was designed to be extremely small and realistic for a weekend build.

### Stack

- **Next.js** – frontend and API routes  
- **Prisma ORM (v6)** – database access layer  
- **PostgreSQL (Neon)** – serverless persistent storage  
- Simple form-based posting (no heavy authentication for MVP)

### Architecture

The platform is built around a single main data model (`Post`) which powers all community boards:

- jobs  
- events  
- help requests  
- projects  
- articles  

Each board is simply a filtered view of the same dataset using a `type` field.

This keeps the backend small, maintainable and easy to extend for future features such as notifications, moderation and role-based access.
