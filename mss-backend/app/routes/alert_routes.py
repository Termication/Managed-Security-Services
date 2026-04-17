from flask import Blueprint, jsonify, request

from app.auth import current_user, role_required
from app.extensions import db
from app.models.alert import Alert
from app.models.client import Client

alert_bp = Blueprint("alert", __name__)


@alert_bp.route("/alerts", methods=["POST"])
@role_required("admin")
def create_alert():
    data = request.get_json() or {}
    if not data.get("title") or not data.get("severity") or not data.get("client_id"):
        return jsonify({"error": "title, severity and client_id are required"}), 400

    client = Client.query.get(data["client_id"])
    if not client:
        return jsonify({"error": "Client not found"}), 404

    alert = Alert(
        title=data["title"].strip(),
        severity=data["severity"].strip(),
        client_id=client.id,
    )

    db.session.add(alert)
    db.session.commit()

    return jsonify({"message": "Alert created", "alert": alert.to_dict()}), 201


@alert_bp.route("/alerts", methods=["GET"])
@role_required("admin", "client")
def list_alerts():
    user = current_user()
    query = Alert.query.order_by(Alert.created_at.desc())

    if user.role == "client":
        query = query.filter_by(client_id=user.client_id)

    alerts = query.all()
    return jsonify({"alerts": [alert.to_dict() for alert in alerts]})
