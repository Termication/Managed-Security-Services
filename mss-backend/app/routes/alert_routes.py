from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.alert import Alert

alert_bp = Blueprint('alert', __name__)

@alert_bp.route('/alerts', methods=['POST'])
def create_alert():
    data = request.json

    alert = Alert(
        title=data.get('title'),
        severity=data.get('severity'),
        client_id=data.get('client_id')
    )

    db.session.add(alert)
    db.session.commit()

    return jsonify({"message": "Alert created"})