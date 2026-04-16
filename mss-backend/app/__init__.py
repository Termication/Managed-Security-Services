from flask import Flask
from flask_cors import CORS
from .extensions import db, jwt

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mss.db'
    app.config['JWT_SECRET_KEY'] = 'key_here'

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Import and register blueprints INSIDE the function
    from .routes.client_routes import client_bp
    from .routes.alert_routes import alert_bp

    app.register_blueprint(client_bp)
    app.register_blueprint(alert_bp)

    @app.route('/')
    def home():
        return {"message": "MSS API is running 🚀"}

    return app