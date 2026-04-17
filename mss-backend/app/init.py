from flask import Flask
from flask_cors import CORS

from .extensions import db, jwt


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mss.db"
    app.config["JWT_SECRET_KEY"] = "key_here"

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from .routes.alert_routes import alert_bp
    from .routes.client_routes import client_bp

    app.register_blueprint(client_bp)
    app.register_blueprint(alert_bp)

    with app.app_context():
        from .models.alert import Alert
        from .models.client import Client

        db.create_all()

    return app
