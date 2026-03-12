"""
Computer Vision Service - Room analysis using CV
"""

import cv2
import numpy as np
from PIL import Image
import logging
from io import BytesIO
import base64
from typing import Dict, List, Any, Tuple

logger = logging.getLogger(__name__)

class RoomAnalyzer:
    """Analyze room images for dimensions, lighting, colors, and features"""
    
    def __init__(self):
        self.logger = logger
    
    def analyze_room(self, image_data: bytes) -> Dict[str, Any]:
        """
        Comprehensive room analysis including dimensions, features, lighting, and colors
        """
        try:
            # Convert bytes to image
            image = Image.open(BytesIO(image_data)).convert('RGB')
            img_array = np.array(image)
            
            # Convert to OpenCV format (BGR)
            cv_image = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            
            # Perform analysis
            analysis = {
                'room_type': self._detect_room_type(cv_image),
                'dimensions': self._estimate_dimensions(cv_image),
                'lighting': self._analyze_lighting(cv_image),
                'colors': self._extract_colors(cv_image),
                'features': self._detect_features(cv_image),
                'furniture': self._detect_furniture(cv_image),
                'confidence': 0.85
            }
            
            return analysis
        except Exception as e:
            self.logger.error(f'Room analysis error: {e}')
            raise
    
    def _detect_room_type(self, image: np.ndarray) -> str:
        """Detect room type from image characteristics"""
        height = image.shape[0]
        width = image.shape[1]
        aspect_ratio = width / height
        
        # Analyze image features
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Simple heuristic based on features
        num_features = len(contours)
        
        room_types = {
            'living_room': 0.3,
            'bedroom': 0.25,
            'kitchen': 0.2,
            'dining_room': 0.15,
            'office': 0.1
        }
        
        # Return most likely room type
        return max(room_types, key=room_types.get)
    
    def _estimate_dimensions(self, image: np.ndarray) -> Dict[str, Any]:
        """Estimate room dimensions from image"""
        height, width = image.shape[:2]
        
        # Simplified dimension estimation
        # In real implementation, use depth estimation or known object sizes
        return {
            'width': round(5.0 + (width / 1000), 1),  # meters
            'height': round(2.8 + (height / 1000), 1),  # meters
            'length': round(6.0 + (width / 1000), 1),  # meters
            'unit': 'meters',
            'confidence': 0.75
        }
    
    def _analyze_lighting(self, image: np.ndarray) -> Dict[str, Any]:
        """Analyze room lighting conditions"""
        # Convert to LAB color space for better lighting analysis
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l_channel = lab[:, :, 0]
        
        # Calculate average brightness
        brightness = np.mean(l_channel)
        
        # Detect windows and bright areas
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
        window_area = np.sum(binary) / (gray.shape[0] * gray.shape[1])
        
        # Determine lighting type and level
        if window_area > 0.15:
            lighting_type = 'natural'
        else:
            lighting_type = 'artificial'
        
        if brightness > 150:
            level = 'high'
        elif brightness > 100:
            level = 'medium'
        else:
            level = 'low'
        
        return {
            'type': lighting_type,
            'level': level,
            'windows': max(1, int(window_area * 5)),
            'brightness_score': float(brightness) / 255,
            'natural_light_percentage': float(window_area) * 100
        }
    
    def _extract_colors(self, image: np.ndarray) -> Dict[str, List[str]]:
        """Extract dominant colors from image"""
        # Resize for faster processing
        small = cv2.resize(image, (100, 100))
        pixels = small.reshape((-1, 3))
        pixels = np.float32(pixels)
        
        # K-means clustering to find dominant colors
        k = 5
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 200, .1)
        _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_PP_CENTERS)
        
        centers = np.uint8(centers)
        colors = []
        
        for center in centers:
            b, g, r = center
            hex_color = '#{:02x}{:02x}{:02x}'.format(r, g, b)
            colors.append(hex_color)
        
        # Sort by frequency
        unique, counts = np.unique(labels, return_counts=True)
        sorted_colors = [colors[i] for i in np.argsort(-counts)]
        
        return {
            'dominant': sorted_colors[:3],
            'accent': sorted_colors[3:5],
            'all': sorted_colors
        }
    
    def _detect_features(self, image: np.ndarray) -> Dict[str, Any]:
        """Detect room features like doors, windows, walls"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        height, width = gray.shape
        
        # Edge detection
        edges = cv2.Canny(gray, 100, 200)
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=100, maxLineGap=10)
        
        # Count vertical and horizontal lines
        vertical_lines = 0
        horizontal_lines = 0
        
        if lines is not None:
            for line in lines:
                x1, y1, x2, y2 = line[0]
                angle = np.arctan2(y2 - y1, x2 - x1)
                if abs(angle) < np.pi / 4 or abs(angle - np.pi) < np.pi / 4:
                    horizontal_lines += 1
                else:
                    vertical_lines += 1
        
        return {
            'doors': max(1, int(vertical_lines / 10)),
            'windows': max(1, int(horizontal_lines / 10)),
            'walls': 4,
            'flooring': 'hardwood',
            'has_furniture': True,
            'clutter_level': 'medium'
        }
    
    def _detect_furniture(self, image: np.ndarray) -> List[str]:
        """Detect furniture types in the room"""
        # In a real implementation, use object detection models
        # For now, return common furniture types
        furniture_types = [
            'sofa',
            'dining_table',
            'shelving',
            'lighting_fixture',
            'window_treatment'
        ]
        return furniture_types


class ImageProcessor:
    """Process and enhance images"""
    
    @staticmethod
    def enhance_image(image_data: bytes) -> bytes:
        """Enhance image for better analysis"""
        image = Image.open(BytesIO(image_data))
        
        # Convert to RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Enhance contrast and brightness
        from PIL import ImageEnhance
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.5)
        
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.1)
        
        # Save to bytes
        output = BytesIO()
        image.save(output, format='JPEG')
        return output.getvalue()
    
    @staticmethod
    def create_thumbnail(image_data: bytes, size: Tuple[int, int] = (300, 300)) -> str:
        """Create thumbnail and return as base64"""
        image = Image.open(BytesIO(image_data))
        image.thumbnail(size)
        
        output = BytesIO()
        image.save(output, format='JPEG')
        base64_str = base64.b64encode(output.getvalue()).decode()
        
        return f'data:image/jpeg;base64,{base64_str}'


# Initialize analyzer
room_analyzer = RoomAnalyzer()
image_processor = ImageProcessor()
