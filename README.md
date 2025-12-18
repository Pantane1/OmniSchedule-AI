Smart Appointment & Client Management System (PHP)

A web-based appointment booking and client management system built with core PHP and MySQL, designed to help businesses manage appointments, clients, and automated notifications efficiently.

🚀 Project Overview

The Smart Appointment & Client Management System allows clients to book appointments online while enabling administrators to manage schedules, clients, and notifications from a centralized dashboard.

This project was built to practice real-world PHP backend development, focusing on clean architecture, security, and scalability.

🎯 Key Features
🔐 Authentication & Roles

Secure user registration and login

Role-based access:

Admin

Client

📅 Appointment Management

Clients can:

View available time slots

Book appointments

Reschedule or cancel bookings

Admin can:

Approve, decline, or modify appointments

Block unavailable dates

📧 Automated Notifications

Email confirmations on booking

Appointment reminders

Cancellation notifications
(Implemented using PHPMailer)

👥 Client Management

Client profiles with contact details

Appointment history tracking

Private admin notes per client

📊 Admin Dashboard

Daily and weekly appointment overview

Upcoming appointments summary

Basic booking analytics

🛠️ Tech Stack

Backend: PHP (OOP-based)

Database: MySQL

Frontend: HTML, CSS, JavaScript

Server: Apache (XAMPP / LAMP)

Email Service: PHPMailer

🔒 Security Measures

Password hashing using password_hash()

Prepared statements (PDO/MySQLi)

Input validation and sanitization

CSRF protection

Session-based authentication

🗂️ Project Structure
/config
   database.php
   config.php

/controllers
   AuthController.php
   AppointmentController.php
   ClientController.php

/models
   User.php
   Appointment.php
   Client.php

/views
   auth/
   dashboard/
   appointments/
   clients/

/public
   index.php
   login.php
   register.php

/vendor
   (PHPMailer)

README.md

🗄️ Database Tables

users

clients

appointments

admin_notes

Each table is relationally structured to ensure data integrity and scalability.

⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/pantane1/smart-appointment-system.git


Move the project to your server directory:

htdocs/ (XAMPP) or /var/www/html (Linux)


Create a MySQL database and import the SQL schema.

Update database credentials in:

/config/database.php


Configure PHPMailer SMTP settings.

Start Apache & MySQL and access the app via browser.

📌 Future Improvements

Calendar-based UI

SMS notifications

REST API endpoints

Staff role support

Export appointments (CSV/PDF)

👤 Author

Pantane (Martin Wamuhu)

GitHub: https://github.com/pantane1

Email: pantane254@gmail.com

WhatsApp: +254740312402

📄 License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it.
