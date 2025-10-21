# PetSitter – Web Application for Pet Services 🐾


[![Watch the demo](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID/hqdefault.jpg)](https://www.youtube.com/watch?v=USQxZs0qh_c&list=PL_Ucvi_-8VOwpWoBVJ2dEecu-vzqPNpB2&index=1)


**Repository:** [GitHub](https://github.com/DanaDonev/systems3_project)
**Demo Videos:** [YouTube Playlist](https://www.youtube.com/playlist?list=PL_Ucvi_-8VOwpWoBVJ2dEecu-vzqPNpB2)
**Live Application:** [PetSitter Web App](http://88.200.63.148:5006/)

---

## About

PetSitter connects pet owners with trusted caretakers, veterinarians, and pet lovers. 🐶🐱
Users can manage profiles, list or book services, and interact in a fun, safe community forum. The platform ensures secure, role-based access for all users.

---

## Tech Stack

* **Frontend:** React, Bootstrap
* **Backend:** Node.js, Express
* **Database:** MySQL (managed via phpMyAdmin)
* **Languages:** JavaScript, HTML, CSS

---

## Core Features

* User registration & pet profiles 🐕
* Service listings & bookings 📅
* Search & filtering for caretakers 🔍
* Forum for community interaction 💬
* Admin moderation & control 🛡️

---

## Demo Access

Try the app without registering using these demo accounts:

* **Admin:** `adminemail@email.com` | `Petsitter25`
* **Pet Sitter:** `tina_k31@example.com` | `_25mqI0l`
* **Pet Owner:** `nika_m99@example.com` | `@&8gCEgf`

---

## Folder Structure 🗂️

Here’s how the project is organized:

```
/sistemi_project      # Frontend React application (your main stage!)
/backend              # Express backend with API routes & database connection
README.md             # This file (hello! 👋)
SRS.pdf               # Software Requirements Specification document
```

> The frontend and backend are separate, but they’re best friends—they talk to each other to make the magic happen! ✨

---

## How to Run Locally 💻

Want to try it yourself? Just follow these steps:

1. **Clone the repository**

```bash
git clone https://github.com/DanaDonev/systems3_project.git
cd systems3_project
```

2. **Set up the backend**

```bash
cd backend
npm install
# Configure your MySQL database in the backend config (phpMyAdmin/MySQL)
npm start
```

3. **Set up the frontend**

```bash
cd ../sistemi_project
npm install
npm start
```

4. **Open your browser**
   Go to [http://localhost:3000](http://localhost:3000) and enjoy! 🎉

> Make sure the backend is running first so the frontend can talk to it.

---

*For full functionality details, see the SRS document in this repository.*
