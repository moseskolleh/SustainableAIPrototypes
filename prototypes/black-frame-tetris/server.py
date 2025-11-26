#!/usr/bin/env python3
"""
Simple HTTP server to test the Tetris game locally
Run: python3 server.py
Then open: http://localhost:8000
"""
import http.server
import socketserver
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"🎮 Tetris Game Server Running!")
    print(f"📂 Serving from: {os.getcwd()}")
    print(f"🌐 Open in browser: http://localhost:{PORT}")
    print(f"⏹️  Press Ctrl+C to stop")
    print()
    httpd.serve_forever()
