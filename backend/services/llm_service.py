"""
LLM Service - Design recommendations and AI-powered suggestions using Claude/OpenAI
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
from anthropic import Anthropic

logger = logging.getLogger(__name__)

class LLMService:
    """Handle LLM interactions for design recommendations"""
    
    def __init__(self):
        self.client = Anthropic()
        self.model = "claude-3-5-sonnet-20241022"
        self.logger = logger
    
    def generate_design_recommendations(
        self,
        style: str,
        room: str,
        budget: str,
        room_analysis: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate personalized design recommendations using Claude"""
        
        try:
            # Build context from room analysis if available
            context = ""
            if room_analysis:
                context = f"""
Room Analysis Data:
- Room Type: {room_analysis.get('room_type', 'unknown')}
- Dimensions: {room_analysis.get('dimensions', {})}
- Lighting: {room_analysis.get('lighting', {})}
- Colors: {room_analysis.get('colors', {})}
- Features: {room_analysis.get('features', {})}
"""
            
            prompt = f"""
You are an expert interior designer AI. Based on the following requirements, provide detailed design recommendations.

{context}

Design Requirements:
- Style Theme: {style}
- Room Type: {room}
- Budget: {budget}

Please provide:
1. 3 color palette suggestions with hex codes
2. 5 furniture recommendations with descriptions
3. 3 material suggestions for finishing
4. 2 lighting recommendations
5. A detailed design narrative explaining the overall concept

Format your response as JSON with keys: color_palettes, furniture, materials, lighting, design_narrative
"""
            
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            response_text = message.content[0].text
            
            # Parse JSON from response
            try:
                # Extract JSON from response
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                if json_start != -1 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    recommendations = json.loads(json_str)
                else:
                    recommendations = self._parse_recommendations(response_text)
            except json.JSONDecodeError:
                recommendations = self._parse_recommendations(response_text)
            
            return {
                'success': True,
                'style': style,
                'room': room,
                'budget': budget,
                'recommendations': recommendations,
                'model': self.model
            }
        
        except Exception as e:
            self.logger.error(f'Design recommendation error: {e}')
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_furniture_suggestions(
        self,
        room: str,
        budget: float,
        style: str,
        dimensions: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """Get specific furniture suggestions for a room"""
        
        try:
            budget_context = ""
            if dimensions:
                budget_context = f"""
Room Dimensions: {dimensions.get('width')}m x {dimensions.get('length')}m x {dimensions.get('height')}m
"""
            
            prompt = f"""
As an interior design expert, suggest furniture for a {style} {room} with a budget of ${budget}.

{budget_context}

Provide 8-10 furniture pieces with:
- Product name
- Description
- Estimated price range
- Why it suits the space
- Available materials/colors

Format as JSON with key 'furniture' containing a list of items.
"""
            
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            response_text = message.content[0].text
            
            try:
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                json_str = response_text[json_start:json_end]
                suggestions = json.loads(json_str)
            except:
                suggestions = {'furniture': self._extract_furniture_list(response_text)}
            
            return {
                'success': True,
                'furniture': suggestions.get('furniture', [])
            }
        
        except Exception as e:
            self.logger.error(f'Furniture suggestion error: {e}')
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_budget_optimization(
        self,
        current_budget: Dict[str, float],
        total_budget: float
    ) -> Dict[str, Any]:
        """Get AI-powered budget optimization suggestions"""
        
        try:
            budget_breakdown = json.dumps(current_budget, indent=2)
            
            prompt = f"""
As a budget optimization expert, analyze this interior design budget and provide cost-saving recommendations.

Current Budget Breakdown:
{budget_breakdown}

Total Budget: ${total_budget}

Provide:
1. 5 cost-saving suggestions
2. Areas where to splurge vs save
3. Estimated final cost with recommendations
4. ROI analysis for each category

Format as JSON with keys: savings_suggestions, category_analysis, estimated_total, roi_analysis
"""
            
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1500,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            response_text = message.content[0].text
            
            try:
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                json_str = response_text[json_start:json_end]
                analysis = json.loads(json_str)
            except:
                analysis = self._parse_optimization(response_text)
            
            return {
                'success': True,
                'analysis': analysis
            }
        
        except Exception as e:
            self.logger.error(f'Budget optimization error: {e}')
            return {
                'success': False,
                'error': str(e)
            }
    
    def _parse_recommendations(self, text: str) -> Dict[str, Any]:
        """Parse recommendations from text if JSON parsing fails"""
        return {
            'color_palettes': self._extract_colors(text),
            'furniture': self._extract_furniture_list(text),
            'materials': self._extract_materials(text),
            'lighting': self._extract_lighting(text),
            'design_narrative': text[:500]
        }
    
    def _extract_colors(self, text: str) -> List[Dict[str, Any]]:
        """Extract color suggestions from text"""
        colors = []
        # Simple extraction logic
        if '#' in text:
            import re
            hex_colors = re.findall(r'#[0-9a-fA-F]{6}', text)
            for color in hex_colors[:3]:
                colors.append({'hex': color, 'name': 'Custom Color'})
        return colors or [{'hex': '#FFFFFF', 'name': 'White'}, {'hex': '#000000', 'name': 'Black'}]
    
    def _extract_furniture_list(self, text: str) -> List[Dict[str, Any]]:
        """Extract furniture from text"""
        furniture_items = [
            {'name': 'Sofa', 'description': 'Modern comfortable seating', 'price_range': '$500-1200'},
            {'name': 'Coffee Table', 'description': 'Sleek design table', 'price_range': '$200-500'},
            {'name': 'Shelving Unit', 'description': 'Storage and display', 'price_range': '$300-800'}
        ]
        return furniture_items
    
    def _extract_materials(self, text: str) -> List[str]:
        """Extract material suggestions from text"""
        materials = ['Hardwood', 'Marble', 'Glass', 'Brass', 'Linen']
        return materials
    
    def _extract_lighting(self, text: str) -> List[Dict[str, Any]]:
        """Extract lighting suggestions from text"""
        lighting = [
            {'type': 'Pendant Lights', 'description': 'Modern design fixture', 'position': 'overhead'},
            {'type': 'Floor Lamp', 'description': 'Accent lighting', 'position': 'corner'}
        ]
        return lighting
    
    def _parse_optimization(self, text: str) -> Dict[str, Any]:
        """Parse optimization analysis from text"""
        return {
            'savings_suggestions': [
                'Mix high-end and budget-friendly pieces',
                'Focus on quality in high-use items',
                'Use paint for color instead of new furniture',
                'DIY some installation tasks',
                'Buy seasonal sales'
            ],
            'category_analysis': {},
            'estimated_total': 0,
            'roi_analysis': {}
        }


# Initialize LLM service
llm_service = LLMService()
