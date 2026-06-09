#include <Servo.h>
#include <Stepper.h>
Servo myservo;
//Includes the Arduino Stepper Library


// Defines the number of steps per rotation
const int stepsPerRevolution = 2048;  //2048 1024 512

// Creates an instance of stepper class
// Pins entered in sequence IN1-IN3-IN2-IN4 for proper step sequence
Stepper myStepper = Stepper(stepsPerRevolution, 8, 10, 9, 11);
int ir = 7;
int metal = 6;
int moist = 5;
int pos = 0;
void setup()
{
  pinMode(metal, INPUT);
  pinMode(ir, INPUT);
  pinMode(moist, INPUT);
  Serial.begin(9600);
  myservo.attach(3);
}

void loop()
{
 
  if (digitalRead(ir) == 0)
  {
    delay(2000);
    if (digitalRead(metal) == 0)
    {
      stepper_rotation1();
      Serial.println("Metal waste Detected");

    }
    else if (digitalRead(moist) == 0)
    {
      stepper_rotation2();
      Serial.println("wet waste Detected");
    }
    else
    {
      delay(2000);
      clk();
      Serial.println("Dry waste Detected");
      delay(2000);
      anti_clk();
    }
  }
}

void clk()
{

  myservo.write(0);              // tell servo to go to position in variable 'pos'
  delay(15);

}

void anti_clk()
{

  myservo.write(90);              // tell servo to go to position in variable 'pos'

  Serial.println("anti-clk");// waits 15 ms for the servo to reach the position

}


void stepper_rotation1()
{
  // Rotate CW slowly at 5 RPM
  myStepper.setSpeed(5);
  myStepper.step(-600);//2048
  delay(2000);
  clk();
  delay(2000);
  anti_clk();
  // Rotate CCW quickly at 10 RPM
  myStepper.setSpeed(10);
  myStepper.step(600);
  delay(2000);
}

void stepper_rotation2()
{
  // Rotate CW slowly at 5 RPM
  myStepper.setSpeed(5);
  myStepper.step(600);
  delay(2000);
  clk();
  delay(2000);
  anti_clk();
  // Rotate CCW quickly at 10 RPM
  myStepper.setSpeed(10);
  myStepper.step(-600);
delay(1000);
} 
