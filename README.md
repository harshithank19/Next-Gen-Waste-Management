# ♻️ Next-Generation Waste Management: A Smart, Sensor-Based and Community-Driven Approach

An IoT-powered smart waste management platform that unites sensor-enabled bins, cloud-based data storage, and a role-based web dashboard to optimize urban waste collection. 

🥇 **1st Place – College-Level Project Expo**

## 📌 Overview

Traditional waste systems lack real-time monitoring and citizen engagement, leading to overflowing bins and rising operational costs. Sortify solves this by combining:

🗑️ IoT smart bins that auto-segregate waste into wet, dry, and metallic categories
☁️ ThingSpeak cloud for real-time sensor data visualization
📲 GSM alerts to notify drivers when bins are full
🌐 Role-based web dashboards for Admin, User, and Driver
🏆 Reward mechanism to encourage responsible citizen waste behavior

The system combines hardware-based waste detection, cloud monitoring, GSM notifications, and a role-based web application to create a complete smart-city waste management solution.

The project promotes cleaner cities, efficient resource utilization, and active community participation through technology.


⚙️ System Architecture
The system is divided into three layers:
IoT Hardware Layer → Cloud Layer → Web Dashboard Layer
ComponentRoleArduino UNOReads sensors, controls motors, uploads dataIR SensorDetects incoming wasteRaindrop SensorIdentifies wet wasteProximity SwitchDetects metallic wasteUltrasonic SensorMeasures bin fill levelServo + Stepper MotorsRoutes waste to correct compartmentGSM ModuleSends SMS alert to driver when bin is fullThingSpeakStores and visualizes real-time sensor dataSupabaseBackend DB for users, drivers, feedback, auth

**🌐 Web App – Sortify (3 Role-Based Dashboards)**

**👤 User Dashboard**

Register/login via Supabase
View live segregation graphs (ThingSpeak)
Interactive bin location map (Leaflet.js)
Submit feedback and issues
Reward checklist system for eco-friendly habits

**🛡️ Admin Dashboard**

Monitor real-time bin-level gauges (ThingSpeak)
Create and manage driver accounts (Supabase)
View all user-submitted feedback

**🚛 Driver Dashboard**

View live bin-level gauges
Receive SMS alerts via GSM module when bins are full
Confirm collection via web interface

**🛠️ Tech Stack**

**Hardware**: Arduino UNO, IR Sensor, Raindrop Sensor, Proximity Switch, Ultrasonic Sensor, Servo Motor, Stepper Motor, GSM Module, Jumper Wires
**Frontend**: HTML5, CSS3, JavaScript, React, ThingSpeak Widgets
**Backend**: Node.js, Supabase (Auth + Database), ThingSpeak IoT Cloud
**Tools**: Arduino IDE, VS Code

Most hardware components were sourced through Amazon and local electronics suppliers.

**📁 Repository Structure**

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

**🚀 How to Run (Web App)**

bashcd web-app
npm install
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local
npm run dev

**⚙️ System Workflow**

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


**📊 Architecture**

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


**📸 Screenshots**

Project demo and screenshots are available in the `/media` & `/screenshots` directory.

<img width="1195" height="789" alt="iot" src="https://github.com/user-attachments/assets/32033bc3-2f49-4e12-9506-13c108f5320e" />


**🏆 Achievements**

🥇 1st Place – College-Level Project Expo (7th Semester Major Project)
Aligned with UN SDG 11: Sustainable Cities and Communities
Plagiarism score: 4% (Turnitin verified)


**👩‍💻 Development Team**

**Harshitha N K (Team Lead),
Swathi K N,
Swara Shetty M,
Shreya N**

Computer Science & Engineering
Global Academy of Technology

[GitHub](https://github.com/harshithank19)

This project is developed for academic and research purposes


## 📜 License

This project is developed for academic and research purposes.
