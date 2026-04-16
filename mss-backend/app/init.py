from flask import Flask
from .extensions import db, jwt
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mss.db'
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Register routes
    from .routes.client_routes import client_bp
    from .routes.alert_routes import alert_bp

    app.register_blueprint(client_bp)
    app.register_blueprint(alert_bp)

    return app