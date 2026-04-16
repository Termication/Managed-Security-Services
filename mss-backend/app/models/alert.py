from app.extensions import db
from datetime import datetime

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    severity = db.Column(db.String(50))
    status = db.Column(db.String(50), default="open")
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)