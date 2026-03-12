"""Agentic AI endpoints - Uses autonomous agents for design tasks"""
from flask import Blueprint, request, jsonify
import logging
from services.agent_service import design_agent, collaborative_agent

logger = logging.getLogger(__name__)

agents_bp = Blueprint('agents', __name__, url_prefix='/api/agents')

@agents_bp.route('/plan-design', methods=['POST'])
def plan_design():
    """Use agent to plan complete design project"""
    try:
        data = request.get_json()
        
        required_fields = ['room', 'style', 'budget']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        room = data.get('room')
        style = data.get('style')
        budget = float(data.get('budget', 0))
        constraints = data.get('constraints', [])
        
        # Use design agent to plan project
        result = design_agent.plan_design_project(
            room=room,
            style=style,
            budget=budget,
            constraints=constraints
        )
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
    
    except Exception as e:
        logger.error(f'Design planning error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@agents_bp.route('/optimize-layout', methods=['POST'])
def optimize_layout():
    """Use agent to optimize furniture layout"""
    try:
        data = request.get_json()
        
        required_fields = ['room_dimensions', 'furniture_list', 'style']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        result = design_agent.optimize_layout(
            room_dimensions=data.get('room_dimensions'),
            furniture_list=data.get('furniture_list'),
            style=data.get('style')
        )
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
    
    except Exception as e:
        logger.error(f'Layout optimization error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@agents_bp.route('/suggest-purchases', methods=['POST'])
def suggest_purchases():
    """Use agent to suggest missing items and purchases"""
    try:
        data = request.get_json()
        
        required_fields = ['current_items', 'gaps', 'budget', 'style']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        result = design_agent.suggest_purchases(
            current_items=data.get('current_items'),
            gaps=data.get('gaps'),
            budget=float(data.get('budget', 0)),
            style=data.get('style')
        )
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
    
    except Exception as e:
        logger.error(f'Purchase suggestion error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@agents_bp.route('/make-decisions', methods=['POST'])
def make_decisions():
    """Use agent to make autonomous design decisions"""
    try:
        data = request.get_json()
        
        if 'design_context' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing design_context'
            }), 400
        
        result = design_agent.automate_design_decisions(
            design_context=data.get('design_context')
        )
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
    
    except Exception as e:
        logger.error(f'Decision making error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@agents_bp.route('/review-design', methods=['POST'])
def review_design():
    """Use multiple agents to review design"""
    try:
        data = request.get_json()
        
        if 'design' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing design'
            }), 400
        
        result = collaborative_agent.multi_agent_design_review(
            design=data.get('design')
        )
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
    
    except Exception as e:
        logger.error(f'Design review error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@agents_bp.route('/automate-process', methods=['POST'])
def automate_process():
    """Automate entire design process using agents"""
    try:
        data = request.get_json()
        
        required_fields = ['room', 'style', 'budget', 'room_analysis']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Step 1: Plan design
        plan = design_agent.plan_design_project(
            room=data.get('room'),
            style=data.get('style'),
            budget=float(data.get('budget', 0))
        )
        
        if not plan.get('success'):
            return jsonify(plan), 500
        
        # Step 2: Make autonomous decisions
        decisions = design_agent.automate_design_decisions(
            design_context=data.get('room_analysis', {})
        )
        
        return jsonify({
            'success': True,
            'data': {
                'plan': plan.get('plan'),
                'decisions': decisions.get('decisions'),
                'status': 'design_automated'
            }
        }), 200
    
    except Exception as e:
        logger.error(f'Automation error: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
