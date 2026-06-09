#include <Servo.h>
#include <Stepper.h>
#include <SoftwareSerial.h>

SoftwareSerial mySerial(12, 13);  // GSM module: RX, TX

Servo myservo;
const int stepsPerRevolution = 2048;
Stepper myStepper = Stepper(stepsPerRevolution, 8, 10, 9, 11);

// --- Sensor pins ---
const int trigPin = A0;
const int echoPin = A1;

float duration1, distance1, duration2, distance2, duration3, distance3;

int ir = 7;
int metal = 6;
int moist = 5;
int k = 0;

// --- ThingSpeak API Keys ---
String writeAPI = "VYDGXT6JYUZ3IU69"; // Write Key
String readAPI  = "LSE8AZBHV7WFC691"; // Read Key (not used here)

// --- Setup ---
void setup() {
  pinMode(metal, INPUT);
  pinMode(ir, INPUT);
  pinMode(moist, INPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  Serial.begin(115200);      // Serial monitor
  mySerial.begin(9600);      // GSM module serial

  myservo.attach(3);
  Serial.println("System Booting...");
  wifi_init();

  // Test SMS on startup
  send_sms();
  mySerial.println("System Initialized: Smart Waste Segregation Ready");
  ctrl_z();
  delay(2000);
}

// --- Main Loop ---
void loop() {
  if (digitalRead(ir) == 0) {
    k = 1;
    delay(2000);
    if (digitalRead(metal) == 0) {
      stepper_rotation1();
      Serial.println("Metal waste Detected");
    } 
    else if (digitalRead(moist) == 0) {
      stepper_rotation2();
      Serial.println("Wet waste Detected");
    } 
    else {
      delay(2000);
      clk();
      Serial.println("Dry waste Detected");
      delay(2000);
      anti_clk();
      ultrasonic1();

      // --- SMS Alert for full bin ---
      if (distance1 < 6.0) {  // threshold distance (adjust as needed)
        send_sms();
        mySerial.println("DUSTBIN ID-001, Dry Waste bin is full, vacate it...");
        mySerial.println("https://www.google.com/maps/place/Global+Academy+of+Technology/@12.9274286,77.5269078,496m/");
        ctrl_z();
      }
    }
  }

  if (k == 1) {
    iot_upload();
    k = 0;
    delay(16000);  // ThingSpeak requires minimum 15s between updates
  }

  ultrasonic1();
  delay(2000);  // 2 sec delay between readings
}

// --- Servo Control ---
void clk() {
  myservo.write(0);
  delay(15);
}
void anti_clk() {
  myservo.write(90);
  Serial.println("anti-clk");
}

// --- Stepper for Metal Waste ---
void stepper_rotation1() {
  myStepper.setSpeed(5);
  myStepper.step(-600);
  delay(2000);
  clk();
  delay(5000);
  anti_clk();
  ultrasonic2();
  myStepper.setSpeed(10);
  myStepper.step(600);

  if (distance2 < 6.0) {
    send_sms();
    mySerial.println("DUSTBIN ID-001, Metal Waste bin is full, vacate it...");
    mySerial.println("https://www.google.com/maps/place/Global+Academy+of+Technology/@12.9274286,77.5269078,496m/");
    ctrl_z();
  }
}

// --- Stepper for Wet Waste ---
void stepper_rotation2() {
  myStepper.setSpeed(5);
  myStepper.step(600);
  delay(2000);
  clk();
  delay(5000);
  anti_clk();
  ultrasonic3();
  myStepper.setSpeed(10);
  myStepper.step(-600);

  if (distance3 < 6.0) {
    send_sms();
    mySerial.println("DUSTBIN ID-001, Wet Waste bin is full, vacate it...");
    mySerial.println("https://www.google.com/maps/place/Global+Academy+of+Technology/@12.9274286,77.5269078,496m/");
    ctrl_z();
  }
}

// --- Ultrasonic Functions ---
float averageDistance() {
  float total = 0;
  for (int i = 0; i < 5; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    float duration = pulseIn(echoPin, HIGH, 30000);
    total += (duration * 0.0343) / 2.0;
    delay(50);
  }
  return total / 5.0;
}

void ultrasonic1() {
  distance1 = averageDistance();
  Serial.print("Distance1: "); Serial.println(distance1);
}
void ultrasonic2() {
  distance2 = averageDistance();
  Serial.print("Distance2: "); Serial.println(distance2);
}
void ultrasonic3() {
  distance3 = averageDistance();
  Serial.print("Distance3: "); Serial.println(distance3);
}

// --- WiFi Initialization ---
void wifi_init() {
  Serial.println("Initializing WiFi...");
  delay(1000);
  Serial.println("AT");
  delay(2000);
  Serial.println("AT+CWMODE=1");
  delay(2000);
  Serial.println("AT+CWLAP");
  delay(2000);
  Serial.println("AT+CWJAP=\"Galaxy\",\"Shreya22\""); // removed space
  delay(7000);
  Serial.println("WiFi Connected to OnePlus Nord2 5G");
}

// --- Send Data to ThingSpeak ---
void iot_upload() {
  Serial.println("Uploading data to ThingSpeak...");

  // Establish TCP connection
  Serial.println("AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80");
  delay(4000);

  // Proper HTTP 1.1 GET request (with Host header)
  String getStr = "GET /update?api_key=" + writeAPI +
                  "&field1=" + String(distance1) +
                  "&field2=" + String(distance2) +
                  "&field3=" + String(distance3) +
                  " HTTP/1.1\r\nHost: api.thingspeak.com\r\nConnection: close\r\n\r\n";

  Serial.print("AT+CIPSEND=");
  Serial.println(getStr.length());
  delay(2000);

  Serial.print(getStr);
  delay(4000);

  Serial.println("AT+CIPCLOSE");
  delay(1000);
  Serial.println("✅ Data uploaded to ThingSpeak successfully!");
}

// --- SMS Functions ---
void send_sms() {
  delay(500);
  mySerial.println("AT+CMGF=1");                // Text mode
  delay(1000);
  mySerial.println("AT+CMGS=\"+91 9513500123\""); // Your phone number
  delay(1000);
}

void ctrl_z() {
  mySerial.write(26);  // Ctrl+Z
  Serial.println("Message Sent...");
  delay(2000);
}
