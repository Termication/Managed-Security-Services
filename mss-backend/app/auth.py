from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request

from app.models.user import User


def current_user():
    user_id = get_jwt_identity()
    if not user_id:
        return None
    return db_lookup_user(user_id)


def db_lookup_user(user_id):
    try:
        normalized_id = int(user_id)
    except (TypeError, ValueError):
        return None

    return User.query.get(normalized_id)


def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()

            if claims.get("role") not in allowed_roles:
                return jsonify({"error": "Forbidden"}), 403

            user = db_lookup_user(get_jwt_identity())
            if not user or not user.is_active:
                return jsonify({"error": "Unauthorized"}), 401

            return fn(*args, **kwargs)

        return wrapper

    return decorator
