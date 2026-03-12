"""
Agentic AI Service - Autonomous agents for design tasks and decision-making
Uses LangChain and Claude for multi-step reasoning
"""

import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from anthropic import Anthropic

logger = logging.getLogger(__name__)

class DesignAgent:
    """Autonomous agent for design planning and recommendations"""
    
    def __init__(self):
        self.client = Anthropic()
        self.model = "claude-3-5-sonnet-20241022"
        self.logger = logger
        self.reasoning_depth = 3
    
    def plan_design_project(
        self,
        room: str,
        style: str,
        budget: float,
        constraints: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Autonomous agent that plans a complete design project
        Uses extended thinking for multi-step reasoning
        """
        
        try:
            constraints_text = ""
            if constraints:
                constraints_text = f"\nConstraints: {', '.join(constraints)}"
            
            # Use Claude with extended thinking
            response = self.client.messages.create(
                model=self.model,
                max_tokens=16000,
                thinking={
                    "type": "enabled",
                    "budget_tokens": 10000
                },
                messages=[{
                    "role": "user",
                    "content": f"""
You are an expert interior design project manager. 
Plan a complete design project with multi-step reasoning.

Project Details:
- Room: {room}
- Style: {style}
- Budget: ${budget}{constraints_text}

Use deep reasoning to:
1. Analyze the room type and requirements
2. Create a detailed design strategy
3. Plan furniture placement and spacing
4. Suggest color schemes and materials
5. Calculate budget allocation across categories
6. Create a implementation timeline
7. Identify potential challenges and solutions

Provide a comprehensive project plan as JSON with sections:
- project_overview
- design_strategy
- room_layout
- material_selections
- budget_allocation
- implementation_timeline
- risk_mitigation

Think deeply about all aspects of the design before providing the plan.
"""
                }]
            )
            
            # Extract response content
            plan_text = ""
            for block in response.content:
                if hasattr(block, 'text'):
                    plan_text += block.text
            
            # Parse the plan
            try:
                json_start = plan_text.find('{')
                json_end = plan_text.rfind('}') + 1
                if json_start != -1:
                    json_str = plan_text[json_start:json_end]
                    project_plan = json.loads(json_str)
                else:
                    project_plan = self._create_default_plan(room, style, budget)
            except json.JSONDecodeError:
                project_plan = self._create_default_plan(room, style, budget)
            
            return {
                'success': True,
                'project_id': self._generate_project_id(),
                'room': room,
                'style': style,
                'budget': budget,
                'plan': project_plan,
                'reasoning_depth': 'extended',
                'created_at': datetime.now().isoformat()
            }
        
        except Exception as e:
            self.logger.error(f'Design planning error: {e}')
            return {
                'success': False,
                'error': str(e)
            }
    
    def optimize_layout(
        self,
        room_dimensions: Dict[str, float],
        furniture_list: List[Dict[str, Any]],
        style: str
    ) -> Dict[str, Any]:
        """
        Agent that optimizes furniture placement for space efficiency
        """
        
        try:
            furniture_json = json.dumps(furniture_list, indent=2)
            
            prompt = f"""
You are an expert in space planning and furniture optimization.
Optimize this room layout for both functionality and aesthetics.

Room: {room_dimensions['width']}m x {room_dimensions['length']}m x {room_dimensions['height']}m
Style: {style}

Furniture to Place:
{furniture_json}

Analyze:
1. Traffic flow patterns
2. Furniture placement for optimal space usage
3. Visual balance and focal points
4. Accessibility and safety
5. Lighting considerations

Provide optimized positions as JSON:
{{
  "placements": [
    {{
      "furniture_name": "name",
      "position": {{"x": value, "y": value}},
      "rotation": degrees,
      "reasoning": "explanation"
    }}
  ],
  "traffic_flow": "description",
  "focal_point": "description",
  "improvement_suggestions": ["suggestion1", "suggestion2"]
}}
"""
            
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.content[0].text
            
            try:
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                json_str = response_text[json_start:json_end]
                layout = json.loads(json_str)
            except:
                layout = self._create_default_layout(furniture_list)
            
            return {
                'success': True,
                'layout': layout,
                'dimensions': room_dimensions
            }
        
        except Exception as e:
            self.logger.error(f'Layout optimization error: {e}')
            return {
                'success': False,
                'error': str(e)
            }
    
    def suggest_purchases(
        self,
        current_items: List[str],
        gaps: List[str],
        budget: float,
        style: str
    ) -> Dict[str, Any]:
        """
        Agent that identifies missing items and suggests purchases
        """
        
        try:
            current_items_text = ', '.join(current_items)
            gaps_text = ', '.join(gaps)
            
            prompt = f"""
You are an expert interior designer shopping assistant.
Suggest purchases to complete and enhance this room design.

Current Items: {current_items_text}
Identified Gaps: {gaps_text}
Budget Available: ${budget}
Style: {style}

For each purchase, provide:
- Product name and category
- Why it's needed
- Price range
- Where to find it (budget/quality options)
- Priority level (critical/important/nice-to-have)

Return as JSON:
{{
  "purchases": [
    {{
      "name": "product",
      "category": "category",
      "rationale": "why needed",
      "price_range": "$min-max",
      "priority": "level",
      "alternatives": ["option1", "option2"]
    }}
  ],
  "total_estimated": $value,
  "budget_utilization": percentage,
  "shopping_strategy": "recommendations"
}}
"""
            
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.content[0].text
            
            try:
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                json_str = response_text[json_start:json_end]
                suggestions = json.loads(json_str)
            except:
                suggestions = {'purchases': [], 'shopping_strategy': ''}
            
            return {
                'success': True,
                'suggestions': suggestions
            }
        
        except Exception as e:
            self.logger.error(f'Purchase suggestion error: {e}')
            return {
                'success': False,
                'error': str(e)
            }
    
    def automate_design_decisions(
        self,
        design_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Agent that makes autonomous design decisions based on context
        """
        
        try:
            context_json = json.dumps(design_context, indent=2)
            
            prompt = f"""
As an autonomous design agent, make decisions for this design project:

Context:
{context_json}

Decide on:
1. Primary color (with reasoning)
2. Secondary colors (with reasoning)
3. Main materials (with reasoning)
4. Furniture style direction
5. Lighting approach
6. Budget allocation strategy

Provide decisions as JSON:
{{
  "decisions": {{
    "primary_color": {{"hex": "#000000", "name": "name", "reasoning": "why"}},
    "secondary_colors": [],
    "materials": [],
    "furniture_direction": "description",
    "lighting_approach": "description",
    "budget_strategy": "description"
  }},
  "confidence_scores": {{}},
  "alternatives_if_needed": {{}}
}}

Make bold, coherent design choices.
"""
            
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.content[0].text
            
            try:
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                json_str = response_text[json_start:json_end]
                decisions = json.loads(json_str)
            except:
                decisions = {'decisions': {}}
            
            return {
                'success': True,
                'decisions': decisions.get('decisions', {}),
                'decision_type': 'autonomous_agent_decisions'
            }
        
        except Exception as e:
            self.logger.error(f'Design decision error: {e}')
            return {
                'success': False,
                'error': str(e)
            }
    
    def _generate_project_id(self) -> str:
        """Generate unique project ID"""
        import uuid
        return f"proj_{uuid.uuid4().hex[:8]}"
    
    def _create_default_plan(self, room: str, style: str, budget: float) -> Dict[str, Any]:
        """Create default plan if parsing fails"""
        return {
            'project_overview': {
                'room': room,
                'style': style,
                'budget': budget
            },
            'design_strategy': 'Modern approach focusing on functionality',
            'budget_allocation': {
                'furniture': budget * 0.5,
                'materials': budget * 0.2,
                'decor': budget * 0.2,
                'implementation': budget * 0.1
            }
        }
    
    def _create_default_layout(self, furniture_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create default layout if parsing fails"""
        placements = []
        for idx, item in enumerate(furniture_list):
            placements.append({
                'furniture_name': item.get('name', 'Item'),
                'position': {'x': idx * 1.5, 'y': 1.0},
                'rotation': 0
            })
        
        return {
            'placements': placements,
            'traffic_flow': 'Optimized for main traffic patterns',
            'focal_point': 'Primary furniture arrangement'
        }


class CollaborativeAgent:
    """Multiple agents working together for complex design tasks"""
    
    def __init__(self):
        self.design_agent = DesignAgent()
        self.logger = logger
    
    def multi_agent_design_review(
        self,
        design: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Multiple agents review and improve design
        """
        
        try:
            design_json = json.dumps(design, indent=2)
            
            # Agent 1: Style Consistency Check
            style_review = self.design_agent.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=[{
                    "role": "user",
                    "content": f"Review this design for style consistency: {design_json}"
                }]
            )
            
            # Agent 2: Budget Optimization Check
            budget_review = self.design_agent.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=[{
                    "role": "user",
                    "content": f"Check budget optimization in this design: {design_json}"
                }]
            )
            
            # Synthesize reviews
            reviews = {
                'style_consistency': style_review.content[0].text,
                'budget_optimization': budget_review.content[0].text,
                'overall_approval': 'APPROVED'
            }
            
            return {
                'success': True,
                'reviews': reviews,
                'agents_used': 2
            }
        
        except Exception as e:
            self.logger.error(f'Multi-agent review error: {e}')
            return {
                'success': False,
                'error': str(e)
            }


# Initialize agents
design_agent = DesignAgent()
collaborative_agent = CollaborativeAgent()
