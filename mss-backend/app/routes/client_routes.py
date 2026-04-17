from flask import Blueprint, jsonify, request

from app.auth import current_user, role_required
from app.extensions import db
from app.models.client import Client

client_bp = Blueprint("client", __name__)


@client_bp.route("/clients", methods=["POST"])
@role_required("admin")
def create_client():
    data = request.get_json() or {}
    if not data.get("name") or not data.get("email"):
        return jsonify({"error": "name and email are required"}), 400

    email = data["email"].strip().lower()
    if Client.query.filter_by(email=email).first():
        return jsonify({"error": "Client already exists"}), 409

    client = Client(
        name=data["name"].strip(),
        email=email,
    )

    db.session.add(client)
    db.session.commit()

    return jsonify({"message": "Client created", "client": client.to_dict()}), 201


@client_bp.route("/clients", methods=["GET"])
@role_required("admin", "client")
def list_clients():
    user = current_user()
    if user.role == "admin":
        clients = Client.query.order_by(Client.created_at.desc()).all()
        return jsonify({"clients": [client.to_dict() for client in clients]})

    if not user.client_id:
        return jsonify({"clients": []})

    client = Client.query.get(user.client_id)
    if not client:
        return jsonify({"clients": []})

    return jsonify({"clients": [client.to_dict()]})
