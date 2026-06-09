# ♻️ Next-Generation Waste Management: A Smart, Sensor-Based and Community-Driven Approach

An IoT-powered smart waste management platform that unites sensor-enabled bins, cloud-based data storage, and a role-based web dashboard to optimize urban waste collection.

🥇 **1st Place – College-Level Project Expo**

![Arduino](https://img.shields.io/badge/Arduino-00979D?style=flat&logo=arduino&logoColor=white)
![IoT](https://img.shields.io/badge/IoT-ThingSpeak-blue?style=flat)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

> 📌 **SDG 11: Sustainable Cities and Communities** — Major Project, 2025–26

---

## 📌 Overview

Traditional waste systems lack real-time monitoring and citizen engagement, leading to overflowing bins and rising operational costs. **Sortify** solves this by combining:

- 🗑️ IoT smart bins that auto-segregate waste into wet, dry, and metallic categories
- ☁️ ThingSpeak cloud for real-time sensor data visualization
- 📲 GSM alerts to notify drivers when bins are full
- 🌐 Role-based web dashboards for Admin, User, and Driver
- 🏆 Reward mechanism to encourage responsible citizen waste behavior

The system combines hardware-based waste detection, cloud monitoring, GSM notifications, and a role-based web application to create a complete smart-city waste management solution.

---

## ⚙️ System Architecture

The system is divided into three layers:

**IoT Hardware Layer → Cloud Layer → Web Dashboard Layer**

| Component | Role |
|-----------|------|
| Arduino UNO | Reads sensors, controls motors, uploads data |
| IR Sensor | Detects incoming waste |
| Raindrop Sensor | Identifies wet waste |
| Proximity Switch | Detects metallic waste |
| Ultrasonic Sensor | Measures bin fill level |
| Servo + Stepper Motors | Routes waste to correct compartment |
| GSM Module | Sends SMS alert to driver when bin is full |
| ThingSpeak | Stores and visualizes real-time sensor data |
| Supabase | Backend DB for users, drivers, feedback, auth |

---

## 🌐 Web App – Sortify (3 Role-Based Dashboards)

### 👤 User Dashboard
- Register/login via Supabase
- View live segregation graphs (ThingSpeak)
- Interactive bin location map (Leaflet.js)
- Submit feedback and issues
- Reward checklist system for eco-friendly habits

### 🛡️ Admin Dashboard
- Monitor real-time bin-level gauges (ThingSpeak)
- Create and manage driver accounts (Supabase)
- View all user-submitted feedback

### 🚛 Driver Dashboard
- View live bin-level gauges
- Receive SMS alerts via GSM module when bins are full
- Confirm collection via web interface

---

## 🛠️ Tech Stack

**Hardware:** Arduino UNO, IR Sensor, Raindrop Sensor, Proximity Switch, Ultrasonic Sensor, Servo Motor, Stepper Motor, GSM Module, Jumper Wires

**Frontend:** HTML5, CSS3, JavaScript, React, ThingSpeak Widgets

**Backend:** Node.js, Supabase (Auth + Database), ThingSpeak IoT Cloud

**Tools:** Arduino IDE, VS Code

> Most hardware components were sourced through Amazon and local electronics suppliers.

---

## 📁 Repository Structure

```
next-gen-waste-management/
├── arduino/               ← Arduino .ino firmware files
├── web-app/               ← Sortify web application (React + Node.js)
│   ├── src/
│   ├── api/
│   ├── public/
│   └── .env.local.example
├── docs/                  ← Full project report
├── media/
│   ├── photos/            ← Hardware prototype images
│   └── demo/              ← Demo video of working model
├── .gitignore
└── README.md
```

---

## 🚀 How to Run (Web App)

```bash
cd web-app
npm install
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local
npm run dev
```

---

## ⚙️ System Workflow

1. User throws waste into the smart bin
2. Sensors identify the waste type
3. Arduino processes sensor data
4. Servo and stepper motors perform segregation
5. Data is uploaded to ThingSpeak Cloud
6. Bin fill level is monitored continuously
7. When the bin becomes full:
   - GSM module sends SMS alerts
   - Driver receives notification
8. Dashboard users can monitor waste statistics in real time

---

## 🎥 Demo

A working demonstration of the Sortify system is available in the `media/demo/` folder of this repository, showcasing real-time waste segregation, bin-level monitoring, and dashboard functionality.

<img width="1195" height="789" alt="iot" src="https://github.com/user-attachments/assets/d2f3f382-4e14-47ea-882f-bab28ef1ecce" />

---

## 🏆 Achievements

- 🥇 **1st Place** – College-Level Project Expo (7th Semester Major Project)
- Aligned with **SDG 11**: Sustainable Cities and Communities
- Plagiarism score: **4%** (Turnitin verified)

---

## 👥 Development Team

Harshitha N K – Team Lead  
Swathi K N                
Swara Shetty M             
Shreya N

[GitHub](https://github.com/harshithank19)

This project is developed for academic and research purposes .
