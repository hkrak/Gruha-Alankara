"""
Home Design AI - Main Flask Application
Agentic AI-powered interior design assistant
"""

import os
import logging
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Application factory"""
    app = Flask(__name__)
    
    # Configuration
    app.config['ENV'] = os.getenv('FLASK_ENV', 'development')
    app.config['DEBUG'] = os.getenv('FLASK_ENV') == 'development'
    app.config['JSON_SORT_KEYS'] = False
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

    # Local file storage (generated images, catalog saves, etc.)
    catalogs_folder = os.path.abspath(os.getenv('CATALOGS_FOLDER', './catalogs'))
    app.config['CATALOGS_FOLDER'] = catalogs_folder
    os.makedirs(catalogs_folder, exist_ok=True)

    @app.route('/catalogs/<path:filename>', methods=['GET'])
    def serve_catalog_file(filename: str):
        return send_from_directory(app.config['CATALOGS_FOLDER'], filename)
    
    # CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv('CORS_ORIGINS', 'http://localhost:8080').split(','),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Register blueprints
    from routes import (
        health_bp,
        rooms_bp,
        designs_bp,
        catalog_bp,
        ar_bp,
        budget_bp,
        agents_bp
    )
    
    app.register_blueprint(health_bp)
    app.register_blueprint(rooms_bp)
    app.register_blueprint(designs_bp)
    app.register_blueprint(catalog_bp)
    app.register_blueprint(ar_bp)
    app.register_blueprint(budget_bp)
    app.register_blueprint(agents_bp)
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'error': 'Bad Request',
            'message': str(error)
        }), 400
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Not Found',
            'message': 'Endpoint not found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f'Server Error: {error}')
        return jsonify({
            'success': False,
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred'
        }), 500
    
    logger.info('Flask application initialized successfully')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_PORT', 3000)),
        debug=os.getenv('FLASK_ENV') == 'development'
    )
