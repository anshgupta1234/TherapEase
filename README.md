## Inspiration
One of our team members, Aditya, has been in physical therapy (PT) for the last year after a back injury on the tennis court. He describes his experience with PT as expensive and inconvenient. Every session meant a long drive across town, followed by an hour of therapy and then the journey back home. On days he was sick or traveling, he would have to miss his PT sessions. 

Another team member, Adarsh, saw his mom rushed to the hospital after suffering from a third degree heart block. In the aftermath of her surgery, in which she was fitted with a pacemaker, he noticed how her vital signs monitors, which were supposed to aid in her recovery, inhibited her movement and impacted her mental health. 

These insights together provided us with the inspiration to create TherapEase.ai. TherapEase.ai uses AI-enabled telehealth to bring **affordable and effective PT** and **contactless vital signs monitoring services** to consumers. With virtual sessions, individuals can receive effective medical care from home with the power of pose correction technology and built-in heart rate, respiratory, and Sp02 monitoring. This evolution of telehealth flips the traditional narrative of physical development—the trainee can be in more control of their body positioning, granting them greater levels of autonomy. 

## What it does

The application consists of the following features:
Pose Detection and Similarity Tracking
Contactless Vital Signs Monitoring
Live Video Feed with Trainer
Live Assistant Trainer Chatbot

Once a PT Trainer or Medical Assistant creates a specific training room, the user is free to join said room. Immediately, the user’s body positioning will be highlighted and compared to that of the trainer. This way the user can directly mimic the actions of the trainer and use visual stimuli to better correct their position. Once the trainer and the trainee are aligned, the body position highlights will turn blue, indicating the correct orientation has been achieved. 

The application also includes a live assistant trainer chatbot to provide useful tips for the user, especially when the user would like to exercise without the presence of the trainer. 

Finally, on the side of the video call, the user can monitor their major vital signs: heart rate, respiratory rate, and blood oxygen levels without the need for any physical sensors or wearable devices. All three are estimated using remote Photoplethysmography: a technique in which fluctuations in camera color levels are used to predict physiological markers. 


## How we built it
We began first with heart rate detection. The remote Photoplethysmography (rPPG) technique at a high level works by analyzing the amount of green light that gets absorbed by the face of the trainee. This serves as a useful proxy as when the heart is expanded, there is less red blood in the face, which means there is less green light absorption. The opposite is true when the heart is contracted. By magnifying these fluctuations using Eulerian Video Magnification, we can then isolate the heart rate by applying a Fast Fourier Transform on the green signal. 

Once the heart rate detection software was developed, we integrated in PoseNet’s position estimation algorithm, which draws 17 key points on the trainee in the video feed. This lead to the development of two-way video communication using webRTC, which simulates the interaction between the trainer and the trainee. With the trainer’s and the trainee’s poses both being estimated, we built the weighted distance similarity comparison function of our application, which shows clearly when the user matched the position of the trainer.

At this stage, we then incorporated the final details of the application: the LLM assistant trainer and the additional vital signs detection algorithms. We integrated **Intel’s Prediction Guard**, into our chat bot to increase speed and robustness of the LLM. For respiratory rate and blood oxygen levels, we integrated algorithms that built off of rPPG technology to determine these two metrics.

## Challenges we ran into (and solved!)
We are particularly proud of being able to implement the two-way video communication that underlies the interaction between a patient and specialist on TherapEase.ai. There were many challenges associated with establishing this communication. We spent many hours building an understanding of webRTC, web sockets, and HTTP protocol. Our biggest ally in this process was the developer tools of Chrome, which we could use to analyze network traffic and ensure the right information is being sent. 

We are also proud of the cosine similarity algorithm which we use to compare the body pose of a specialist/trainer with that of a patient. A big challenge associated with this was finding a way to prioritize certain points (from posnet) over others (e.g. an elbow joint should be given more importance than an eye point in determining how off two poses are from each other). After hours of mathematical and programming iteration, we devised an algorithm that was able to weight certain joints more than others leading to much more accurate results when comparing poses on the two way video stream. Another challenge was finding a way to efficiently compute and compare two pose vectors in real time (since we are dealing with a live video stream). Rather than having a data store, for this hackathon we compute our cosine similarity in the browser.

## What's next for TherapEase.ai

We all are very excited about the development of this application. In terms of future technical developments, we believe that the following next steps would take our application to the next level.
Peak Enhancement for Respiratory Rate and SpO2
Blood Pressure Contactless Detection
Multi-channel video Calling
Increasing Security



