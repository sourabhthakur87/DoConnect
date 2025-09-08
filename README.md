# DoConnect: Q&A Platform

## 📌 Overview
DoConnect is a full-stack Question & Answer platform where users can post questions, provide answers, and attach images. 
Admins manage content by approving or rejecting questions and answers. 
The project is built using **Angular 20**, **.NET 9 Web API**, **SQL Server**, **JWT authentication** .

---

## 🚀 Features
- **User Management**
  - Register & Login using JWT authentication.
  - Role-based access (User & Admin).
- **Question Management**
  - Users can post questions with images.
  - Admins approve/reject questions.
- **Answer Management**
  - Users can answer approved questions.
  - Admins approve/reject answers.
- **Image Uploads**
  - Users can upload images with their questions.
- **Swagger API Testing**
  - All APIs can be tested via Swagger UI.

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Angular 20
- **HTTP Client**: Angular HttpClient
- **Routing & Guards**: AuthGuard, AdminGuard, JWT Interceptor
- **UI Styling**: Bootstrap / Custom CSS

### **Backend**
- **Framework**: ASP.NET Core 9 Web API
- **Authentication**: JWT (JSON Web Tokens)
- **Real-Time Communication**: SignalR
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core



git clone <your-repo-url>
cd DoConnect
