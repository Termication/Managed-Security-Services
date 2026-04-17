from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required

from app.auth import current_user, role_required
from app.extensions import db
from app.models.client import Client
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


def _required_fields(data, *fields):
    missing = [field for field in fields if not data.get(field)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
    return None


@auth_bp.route("/auth/setup-admin", methods=["POST"])
def setup_admin():
    if User.query.filter_by(role="admin").first():
        return jsonify({"error": "Admin user already exists"}), 409

    data = request.get_json() or {}
    validation_error = _required_fields(data, "email", "password")
    if validation_error:
        return validation_error

    user = User(email=data["email"].strip().lower(), role="admin")
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Admin account created", "user": user.to_dict()}), 201


@auth_bp.route("/auth/status", methods=["GET"])
def auth_status():
    has_admin = User.query.filter_by(role="admin").first() is not None
    return jsonify({"has_admin": has_admin})


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    validation_error = _required_fields(data, "email", "password")
    if validation_error:
        return validation_error

    user = User.query.filter_by(email=data["email"].strip().lower()).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.is_active:
        return jsonify({"error": "Account is inactive"}), 403

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "client_id": user.client_id},
    )

    return jsonify({"access_token": token, "user": user.to_dict()})


@auth_bp.route("/auth/me", methods=["GET"])
@jwt_required()
def me():
    user = current_user()
    if not user or not user.is_active:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"user": user.to_dict()})


@auth_bp.route("/auth/client-users", methods=["POST"])
@role_required("admin")
def create_client_user():
    data = request.get_json() or {}
    validation_error = _required_fields(data, "email", "password", "client_id")
    if validation_error:
        return validation_error

    client = Client.query.get(data["client_id"])
    if not client:
        return jsonify({"error": "Client not found"}), 404

    email = data["email"].strip().lower()
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 409

    user = User(email=email, role="client", client_id=client.id)
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Client user created", "user": user.to_dict()}), 201
