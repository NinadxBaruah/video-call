# Video Call App

This is a real-time video call application built using **HTML**, **CSS**, **JavaScript**, **Node.js**, **WebRTC**, and **WebSockets**. Users can connect with each other using unique user IDs and control their video and audio streams during the call.

**Live Demo:** [Video Call App](https://ninadbaruah.me/projects/video-chat)


## Demo Video
[![Tic Tac Toe Demo](./public/gif/preview.gif)](https://ninadbaruah.me/videos/video-chat-project.mp4)

Click the image above to watch the video demo.

## Development Environment Limitation

In a local development environment, testing the app with both the caller and receiver on the same device might cause issues. This is because most video input devices (like a webcam) cannot be accessed by two browser instances simultaneously.

## Features

- **Real-Time Video Calling**: Connect with other users using unique User IDs.
- **Stream Controls**:
  - Toggle Video Stream: Pause or resume your video feed during the call.
  - Toggle Audio Stream: Mute or unmute your microphone.
- **Real-Time Signaling**: WebSocket integration for seamless connection setup.

## How to Use

1. **Enter User ID**:  
   Input your unique User ID and share it with the person you want to call.

2. **Initiate Call**:  
   Click the "Call" button to establish a connection with the other user.

3. **Control Streams**:  
   - Use the **Video Toggle** button to turn your camera on/off during the call.
   - Use the **Audio Toggle** button to mute/unmute your microphone.

4. **End the Call**:  
   Disconnect anytime to end the session.

## Development Environment Limitation

In a local development environment, testing the app with both the caller and receiver on the same device might cause issues. This is because most video input devices (like a webcam) cannot be accessed by two browser instances simultaneously.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js
- **Real-Time Communication**: WebRTC and WebSockets

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/video-call-app.git
   ```
2. Navigate to the project directory:
    ```bash
    cd video-call-app
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    npm start
    ```