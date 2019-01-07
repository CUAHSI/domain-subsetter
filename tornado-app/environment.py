import os

# Server settings

address="0.0.0.0"
port="8080"

debug=True
static_path = os.path.join(os.path.dirname(__file__), "static")
template_path = os.path.join(os.path.dirname(__file__), "templates")
