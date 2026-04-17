from flask import Flask
from flask_cors import CORS

from .config import configure_app
from .extensions import db, jwt


def create_app():
    app = Flask(__name__)
    configure_app(app)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from .routes.auth_routes import auth_bp
    from .routes.alert_routes import alert_bp
    from .routes.client_routes import client_bp
    from .routes.ui_routes import ui_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(client_bp)
    app.register_blueprint(alert_bp)
    app.register_blueprint(ui_bp)

    with app.app_context():
        from .models.alert import Alert
        from .models.client import Client
        from .models.user import User

        db.create_all()

    return app
