from app.extensions import db
from datetime import datetime


class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    severity = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="open", nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "severity": self.severity,
            "status": self.status,
            "client_id": self.client_id,
            "created_at": self.created_at.isoformat(),
        }
