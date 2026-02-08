import http.server
import socketserver
import webbrowser
import json
import urllib.request
import urllib.error
from flask import Flask, request, jsonify
import jwt
import datetime
from functools import wraps

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            # Forward the request to the proxy logic
            target_url = 'http://localhost:11434/api/chat'
            headers = {'Content-Type': 'application/json'}

            try:
                req = urllib.request.Request(
                    target_url,
                    data=post_data,
                    headers=headers,
                    method='POST'
                )

                with urllib.request.urlopen(req) as response:
                    response_body = response.read()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(response_body)

            except urllib.error.URLError as e:
                self.send_error(500, f"Proxy Error: {e}")
        else:
            self.send_error(404, "Endpoint not found")

# Replace the default handler with the custom one
Handler = CustomHTTPRequestHandler

app = Flask(__name__)

# Secret key for JWT
app.config['SECRET_KEY'] = 'your_secret_key'

# Decorator for verifying tokens
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(*args, **kwargs)
    return decorated

# Route for generating tokens
@app.route('/login', methods=['POST'])
def login():
    auth = request.json
    if auth and auth['username'] == 'admin' and auth['password'] == 'password':
        token = jwt.encode({'user': auth['username'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials!'}), 401

# Protected route
@app.route('/protected', methods=['GET'])
@token_required
def protected():
    return jsonify({'message': 'This is a protected route.'})

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    webbrowser.open(f'http://localhost:{PORT}/index.html')
    httpd.serve_forever()
