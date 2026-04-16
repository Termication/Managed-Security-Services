from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.client import Client

client_bp = Blueprint('client', __name__)

@client_bp.route('/clients', methods=['POST'])
def create_client():
    data = request.json

    client = Client(
        name=data['name'],
        email=data['email']
    )

    db.session.add(client)
    db.session.commit()

    return jsonify({"message": "Client created"})