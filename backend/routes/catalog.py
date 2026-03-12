"""Catalog endpoints - Product catalog management"""
from flask import Blueprint, request, jsonify, current_app
import logging
import os
import json
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

catalog_bp = Blueprint('catalog', __name__, url_prefix='/api/catalog')

def _read_design_index(index_path: Path):
    if not index_path.exists():
        return []
    try:
        return json.loads(index_path.read_text(encoding='utf-8') or '[]')
    except Exception:
        return []

def _write_design_index(index_path: Path, items):
    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding='utf-8')

@catalog_bp.route('/designs', methods=['GET'])
def get_saved_designs():
    """List saved designs from local catalogs storage"""
    try:
        base = Path(current_app.config.get('CATALOGS_FOLDER', os.path.abspath('./catalogs')))
        index_path = base / 'designs' / 'index.json'
        items = _read_design_index(index_path)
        return jsonify({'success': True, 'data': items}), 200
    except Exception as e:
        logger.error(f'Get saved designs error: {e}')
        return jsonify({'success': False, 'error': str(e)}), 500

@catalog_bp.route('/designs', methods=['POST'])
def save_design_to_catalog():
    """Save a generated design image into catalogs storage"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'image required'}), 400

        image_file = request.files['image']
        design_id = request.form.get('id') or f"design_{int(datetime.now().timestamp())}"
        title = request.form.get('title') or design_id
        style = request.form.get('style') or ''
        room = request.form.get('room') or ''
        budget = request.form.get('budget') or ''
        colors_raw = request.form.get('colors') or '[]'
        tags_raw = request.form.get('tags') or '[]'

        try:
            colors = json.loads(colors_raw) if colors_raw else []
        except Exception:
            colors = []
        try:
            tags = json.loads(tags_raw) if tags_raw else []
        except Exception:
            tags = []

        base = Path(current_app.config.get('CATALOGS_FOLDER', os.path.abspath('./catalogs')))
        designs_dir = base / 'designs'
        designs_dir.mkdir(parents=True, exist_ok=True)

        # Always store as PNG to keep predictable
        filename = f"{design_id}.png"
        file_path = designs_dir / filename
        image_file.save(str(file_path))

        image_url = f"/catalogs/designs/{filename}"

        item = {
            'id': design_id,
            'title': title,
            'style': style,
            'room': room,
            'budget': budget,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'colors': colors,
            'starred': False,
            'tags': tags if isinstance(tags, list) else ['Saved'],
            'image': image_url,
        }

        index_path = designs_dir / 'index.json'
        items = _read_design_index(index_path)
        # de-dupe by id (new first)
        items = [i for i in items if isinstance(i, dict) and i.get('id') != design_id]
        items.insert(0, item)
        _write_design_index(index_path, items[:200])

        return jsonify({'success': True, 'data': {**item, 'imageUrl': image_url}}), 200
    except Exception as e:
        logger.error(f'Save design error: {e}')
        return jsonify({'success': False, 'error': str(e)}), 500

@catalog_bp.route('/products', methods=['GET'])
def get_products():
    """Get products with filtering"""
    try:
        # Get filter parameters
        category = request.args.get('category')
        search = request.args.get('search')
        price_min = request.args.get('priceMin', type=float)
        price_max = request.args.get('priceMax', type=float)
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        # Mock products data
        products = [
            {
                'id': 'prod_001',
                'name': 'Modern Sofa',
                'category': 'furniture',
                'price': 1200,
                'currency': 'USD',
                'rating': 4.5,
                'reviews': 42,
                'availability': True
            },
            {
                'id': 'prod_002',
                'name': 'Coffee Table',
                'category': 'furniture',
                'price': 350,
                'currency': 'USD',
                'rating': 4.2,
                'reviews': 28,
                'availability': True
            }
        ]
        
        return jsonify({
            'success': True,
            'data': {
                'products': products,
                'total': len(products),
                'page': page,
                'limit': limit,
                'categories': ['furniture', 'decor', 'lighting']
            }
        }), 200
    
    except Exception as e:
        logger.error(f'Get products error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get product details"""
    try:
        return jsonify({
            'success': True,
            'data': {
                'id': product_id,
                'name': 'Product Name',
                'category': 'furniture',
                'price': 999,
                'currency': 'USD',
                'description': 'Product description',
                'images': [],
                'rating': 4.5,
                'reviews': 50
            }
        }), 200
    
    except Exception as e:
        logger.error(f'Get product error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get product categories"""
    try:
        categories = ['furniture', 'decor', 'lighting', 'textiles', 'accessories']
        return jsonify({
            'success': True,
            'data': categories
        }), 200
    
    except Exception as e:
        logger.error(f'Get categories error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/categories/<category>/subcategories', methods=['GET'])
def get_subcategories(category):
    """Get subcategories"""
    try:
        subcategories = {
            'furniture': ['sofas', 'chairs', 'tables', 'beds', 'shelves'],
            'decor': ['wall art', 'mirrors', 'vases', 'plants'],
            'lighting': ['ceiling lights', 'floor lamps', 'pendant lights'],
            'textiles': ['rugs', 'curtains', 'pillows', 'blankets'],
            'accessories': ['clocks', 'frames', 'decorative items']
        }
        
        subs = subcategories.get(category, [])
        return jsonify({
            'success': True,
            'data': subs
        }), 200
    
    except Exception as e:
        logger.error(f'Get subcategories error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/trending', methods=['GET'])
def get_trending_products():
    """Get trending products"""
    try:
        limit = request.args.get('limit', 12, type=int)
        
        return jsonify({
            'success': True,
            'data': []
        }), 200
    
    except Exception as e:
        logger.error(f'Get trending error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    """Get recommended products"""
    try:
        design_id = request.args.get('designId')
        limit = request.args.get('limit', 20, type=int)
        
        return jsonify({
            'success': True,
            'data': []
        }), 200
    
    except Exception as e:
        logger.error(f'Get recommendations error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/wishlist', methods=['POST'])
def add_to_wishlist():
    """Add product to wishlist"""
    try:
        data = request.get_json()
        
        if 'productId' not in data:
            return jsonify({
                'success': False,
                'error': 'productId required'
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'Product added to wishlist'
        }), 200
    
    except Exception as e:
        logger.error(f'Add to wishlist error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/wishlist', methods=['GET'])
def get_wishlist():
    """Get user wishlist"""
    try:
        return jsonify({
            'success': True,
            'data': []
        }), 200
    
    except Exception as e:
        logger.error(f'Get wishlist error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/wishlist/<product_id>', methods=['DELETE'])
def remove_from_wishlist(product_id):
    """Remove from wishlist"""
    try:
        return jsonify({
            'success': True,
            'message': 'Product removed from wishlist'
        }), 200
    
    except Exception as e:
        logger.error(f'Remove from wishlist error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@catalog_bp.route('/filters', methods=['GET'])
def get_filters():
    """Get filter metadata"""
    try:
        return jsonify({
            'success': True,
            'data': {
                'materials': ['wood', 'metal', 'glass', 'leather', 'fabric'],
                'colors': ['#FFFFFF', '#000000', '#808080', '#FF0000', '#0000FF'],
                'priceRanges': [
                    {'min': 0, 'max': 500, 'label': 'Budget'},
                    {'min': 500, 'max': 1500, 'label': 'Mid-range'},
                    {'min': 1500, 'max': 5000, 'label': 'Premium'},
                    {'min': 5000, 'max': 1000000, 'label': 'Luxury'}
                ]
            }
        }), 200
    
    except Exception as e:
        logger.error(f'Get filters error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
