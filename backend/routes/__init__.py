"""Routes initialization"""
from flask import Blueprint

# Import blueprints from individual route modules
from .health import health_bp
from .rooms import rooms_bp
from .designs import designs_bp
from .catalog import catalog_bp
from .ar import ar_bp
from .budget import budget_bp
from .agents import agents_bp

__all__ = [
    'health_bp',
    'rooms_bp',
    'designs_bp',
    'catalog_bp',
    'ar_bp',
    'budget_bp',
    'agents_bp'
]
