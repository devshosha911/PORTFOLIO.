import http.server
import socketserver
import webbrowser
import json
import urllib.request
import urllib.error
import sys

PORT = 8000

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_json = json.loads(post_data)
            
            # Configuration
            api_key = request_json.get('apiKey')
            # Try to determine the endpoint. If the user provided a key, maybe it's a cloud provider.
            # If not, try local Ollama.
            # Allowing the frontend to specify, or defaulting here.
            
            # Strategy: Try the key with the provided endpoint, or fallback to local Ollama
            target_url = request_json.get('endpoint') or 'http://localhost:11434/api/chat'
            
            # Prepare the request to the actual LLM provider
            headers = {'Content-Type': 'application/json'}
            if api_key:
                headers['Authorization'] = f'Bearer {api_key}'
            
            # Transform payload for Ollama (if strictly local ollama /api/chat format)
            # or OpenAI format. 
            # Let's assume the frontend sends the correct body for the target.
            # But we might need to handle CORS headers for the response.
            
            try:
                # Forward the request
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
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(response_body)
                    
            except urllib.error.URLError as e:
                # If cloud fails, try Local Ollama default port
                 print(f"Failed to connect to {target_url}: {e}")
                 self.send_error(500, f"Proxy Error: {e}")
                 
        else:
            self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

# Allow reuse of address to prevent "Address already in use" errors on restart
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print("AI Proxy Active on /api/chat")
    webbrowser.open(f'http://localhost:{PORT}/index.html')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()
