# ♻️ Next-Generation Waste Management: A Smart, Sensor-Based and Community-Driven Approach

## 🏆 Achievement

🥇 **1st Place – College Project Expo**

## 📌 Overview

**Sortify** is an IoT-powered smart waste management system designed to automate waste segregation, enable real-time bin monitoring, and improve waste collection efficiency.

The system combines hardware-based waste detection, cloud monitoring, GSM notifications, and a role-based web application to create a complete smart-city waste management solution.

The project promotes cleaner cities, efficient resource utilization, and active community participation through technology.

---

## 🚀 Features

### Smart Waste Segregation

* Automatic waste classification
* Detects:

  * Wet Waste
  * Dry Waste
  * Metallic Waste
* Sensor-based segregation mechanism

### Real-Time Bin Monitoring

* Ultrasonic sensor measures bin fill level
* Live monitoring through ThingSpeak Cloud
* Real-time gauge and graph visualizations

### Driver Alert System

* GSM-based SMS notifications
* Instant alerts when bins reach full capacity
* Enables timely waste collection

### Community Participation

* Citizen feedback system
* Reward-based engagement checklist
* Environmental awareness content

### Role-Based Dashboard System

#### Admin Dashboard

* Monitor smart bins
* View live ThingSpeak data
* Create and manage drivers
* View citizen feedback

#### User Dashboard

* Register/Login
* View waste segregation analytics
* Interactive bin location map
* Submit feedback
* Track rewards

#### Driver Dashboard

* View assigned bins
* Monitor fill levels
* Receive SMS alerts

---

## 🛠 Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Tailwind CSS
* Leaflet.js
* OpenStreetMap

### Backend

* Node.js
* Express.js

### Database & Authentication

* Supabase
* Supabase Auth

### IoT & Cloud

* Arduino UNO
* ThingSpeak Cloud
* GSM Module

---

## 🔧 Hardware Components

* Arduino UNO
* Ultrasonic Sensor
* IR Sensor
* Raindrop Sensor
* Metallic Proximity Sensor
* Servo Motor
* Stepper Motor
* GSM Module
* Jumper Wires
* Battery Pack

Most hardware components were sourced through Amazon and local electronics suppliers.

---

## ⚙️ System Workflow

1. User throws waste into the smart bin.
2. Sensors identify the waste type.
3. Arduino processes sensor data.
4. Servo and stepper motors perform segregation.
5. Data is uploaded to ThingSpeak Cloud.
6. Bin fill level is monitored continuously.
7. When the bin becomes full:

   * GSM module sends SMS alerts.
   * Driver receives notification.
8. Dashboard users can monitor waste statistics in real time.

---

## 📊 Architecture

The system consists of three layers:

### IoT Layer

* Smart Dustbin
* Sensors
* Arduino
* GSM Module

### Cloud Layer

* ThingSpeak
* Supabase

### Application Layer

* Admin Dashboard
* User Dashboard
* Driver Dashboard

---

📚 Reference

The following video was used as a reference during the development and implementation of this project:

https://youtu.be/4XedfXtPxLQ?si=3TwH9hjin6aIauR1



---

## 📸 Screenshots

Project screenshots are available in the `/screenshots` directory.

---

## 📂 Project Structure

```text
Project Report/
arduino/
media/
screenshots/
web-app/
```

---

## 🌍 Sustainable Development Goal (SDG)

**SDG 11 – Sustainable Cities and Communities**

This project contributes towards building cleaner, smarter, and more sustainable urban environments through intelligent waste management.

---

## 👩‍💻 Developer

**Harshitha N K**
Computer Science & Engineering
Global Academy of Technology

---

## 📜 License

This project is developed for academic and research purposes.
