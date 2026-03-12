"""Health check endpoints"""
from flask import Blueprint, jsonify
import logging

logger = logging.getLogger(__name__)

health_bp = Blueprint('health', __name__, url_prefix='/api')

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Check if backend is running"""
    return jsonify({
        'success': True,
        'status': 'healthy',
        'service': 'Home Design AI',
        'version': '1.0.0'
    }), 200
