from fastapi import FastAPI
from fastapi.responses import StreamingResponse, HTMLResponse
import cv2
import requests
import numpy as np
import logging
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
import asyncio

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://localhost:8001",
    "http://0.0.0.1:8000",
    "http://0.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_frames():
    cap = cv2.VideoCapture(0)  # Mở webcam
    while True:
        success, frame = cap.read()
        if not success:
            break
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/", response_class=HTMLResponse)
def homepage():
    """Trang chủ hiển thị luồng video"""
    return """
    <html>
        <head>
            <title>Camera Streaming</title>
            <style>
                body { margin: 0; font-family: Arial, sans-serif; background: #f0f0f0; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; text-align: center; }
                h1 { color: #333; margin-bottom: 20px; }
                #videoFeed { border: 2px solid #ddd; border-radius: 4px; background: #000; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Real-time Camera Streaming</h1>
                <img id="videoFeed" src="/video_feed" width="640" height="480">
            </div>
            <script>
                // Tự động reload khi mất kết nối
                const img = document.getElementById('videoFeed');
                img.onerror = function() {
                    console.log('Connection lost. Reconnecting...');
                    setTimeout(() => {
                        img.src = '/video_feed?t=' + new Date().getTime();
                    }, 1000);
                };
            </script>
        </body>
    </html>
    """
    
    
    