from flask import Flask, render_template, request, jsonify
import json
import random
import numpy as np
from datetime import datetime, timedelta
import math

app = Flask(__name__)

# Mock data for demonstration
INDICATORS = {
    'gdp_growth': {'name': 'GDP Growth Rate', 'unit': '%', 'current': 6.8, 'target': 8.0},
    'employment': {'name': 'Employment Rate', 'unit': '%', 'current': 94.2, 'target': 96.0},
    'literacy': {'name': 'Literacy Rate', 'unit': '%', 'current': 77.7, 'target': 85.0},
    'carbon_emissions': {'name': 'Carbon Emissions', 'unit': 'MT CO2', 'current': 2.65, 'target': 2.0},
    'innovation_index': {'name': 'Innovation Index', 'unit': 'Score', 'current': 36.8, 'target': 45.0},
    'msme_growth': {'name': 'MSME Growth', 'unit': '%', 'current': 12.5, 'target': 18.0}
}

POLICY_SCENARIOS = {
    'msme_funding': {
        'name': 'MSME Funding Increase', 
        'description': 'Increase funding allocation for Micro, Small & Medium Enterprises',
        'icon': 'fas fa-coins'
    },
    'carbon_tax': {
        'name': 'Carbon Tax Implementation', 
        'description': 'Implement progressive carbon tax policy to reduce emissions',
        'icon': 'fas fa-leaf'
    },
    'education_investment': {
        'name': 'Education Investment', 
        'description': 'Boost investment in education infrastructure and programs',
        'icon': 'fas fa-graduation-cap'
    },
    'infrastructure': {
        'name': 'Infrastructure Development', 
        'description': 'Accelerate infrastructure development projects',
        'icon': 'fas fa-road'
    },
    'digital_transformation': {
        'name': 'Digital Transformation', 
        'description': 'Accelerate digital adoption across sectors',
        'icon': 'fas fa-laptop-code'
    }
}

def calculate_odi(indicators):
    """Calculate Overall Development Index with realistic weighting"""
    weights = {
        'gdp_growth': 0.25,
        'employment': 0.20,
        'literacy': 0.15,
        'carbon_emissions': -0.10,
        'innovation_index': 0.20,
        'msme_growth': 0.20
    }
    
    normalized_scores = {}
    for key, value in indicators.items():
        if key == 'carbon_emissions':
            normalized_scores[key] = max(0, 100 - (value / 5.0) * 100)
        else:
            if key == 'gdp_growth':
                normalized_scores[key] = min(100, (value / 10.0) * 100)
            elif key == 'employment':
                normalized_scores[key] = min(100, value)
            elif key == 'literacy':
                normalized_scores[key] = min(100, value)
            elif key == 'innovation_index':
                normalized_scores[key] = min(100, (value / 50.0) * 100)
            elif key == 'msme_growth':
                normalized_scores[key] = min(100, (value / 20.0) * 100)
    
    odi = sum(normalized_scores[key] * weights[key] for key in weights.keys())
    return max(0, min(100, odi))

def simulate_policy_impact(scenario, intensity):
    """Enhanced simulation with more realistic policy impact modeling"""
    base_indicators = {key: data['current'] for key, data in INDICATORS.items()}
    
    impact_factors = {
        'msme_funding': {
            'gdp_growth': 0.8,
            'employment': 1.2,
            'msme_growth': 2.0,
            'innovation_index': 0.6,
            'literacy': 0.2
        },
        'carbon_tax': {
            'carbon_emissions': -1.5,
            'gdp_growth': -0.3,
            'innovation_index': 0.4,
            'employment': -0.1
        },
        'education_investment': {
            'literacy': 1.0,
            'innovation_index': 0.8,
            'employment': 0.4,
            'gdp_growth': 0.3
        },
        'infrastructure': {
            'gdp_growth': 1.2,
            'employment': 0.8,
            'msme_growth': 0.6,
            'innovation_index': 0.3
        },
        'digital_transformation': {
            'innovation_index': 1.5,
            'msme_growth': 1.0,
            'gdp_growth': 0.6,
            'employment': 0.2,
            'literacy': 0.3
        }
    }
    
    projected_indicators = base_indicators.copy()
    
    if scenario in impact_factors:
        for indicator, factor in impact_factors[scenario].items():
            if indicator in projected_indicators:
                intensity_factor = intensity / 100
                diminishing_factor = math.sqrt(intensity_factor)
                
                change = factor * diminishing_factor * random.uniform(0.9, 1.1)
                projected_indicators[indicator] += change
                
                # Apply realistic bounds
                if indicator == 'literacy':
                    projected_indicators[indicator] = min(100, max(0, projected_indicators[indicator]))
                elif indicator == 'employment':
                    projected_indicators[indicator] = min(100, max(85, projected_indicators[indicator]))
                elif indicator == 'carbon_emissions':
                    projected_indicators[indicator] = max(0.5, projected_indicators[indicator])
                elif indicator == 'gdp_growth':
                    projected_indicators[indicator] = max(-2, min(15, projected_indicators[indicator]))
                elif indicator == 'innovation_index':
                    projected_indicators[indicator] = max(0, min(100, projected_indicators[indicator]))
                elif indicator == 'msme_growth':
                    projected_indicators[indicator] = max(-5, min(30, projected_indicators[indicator]))
    
    return projected_indicators

@app.route('/')
def dashboard():
    current_odi = calculate_odi({key: data['current'] for key, data in INDICATORS.items()})
    return render_template('dashboard.html', 
                         indicators=INDICATORS, 
                         current_odi=current_odi,
                         scenarios=POLICY_SCENARIOS)

@app.route('/simulation')
def simulation():
    return render_template('simulation.html', scenarios=POLICY_SCENARIOS, indicators=INDICATORS)

@app.route('/presentation')
def presentation():
    return render_template('presentation.html')

@app.route('/api/simulate', methods=['POST'])
def api_simulate():
    data = request.json
    scenario = data.get('scenario')
    intensity = data.get('intensity', 50)
    
    if scenario not in POLICY_SCENARIOS:
        return jsonify({'error': 'Invalid scenario'}), 400
    
    current_indicators = {key: data['current'] for key, data in INDICATORS.items()}
    current_odi = calculate_odi(current_indicators)
    
    projected_indicators = simulate_policy_impact(scenario, intensity)
    projected_odi = calculate_odi(projected_indicators)
    
    months = []
    current_date = datetime.now()
    for i in range(12):
        months.append((current_date + timedelta(days=30*i)).strftime('%b %Y'))
    
    time_series = {}
    for indicator in current_indicators.keys():
        current_val = current_indicators[indicator]
        projected_val = projected_indicators[indicator]
        
        values = []
        for i in range(12):
            progress = i / 11
            base_value = current_val + (projected_val - current_val) * progress
            seasonal_factor = 0.05 * math.sin(2 * math.pi * i / 12)
            noise_factor = random.uniform(-0.02, 0.02)
            final_value = base_value * (1 + seasonal_factor + noise_factor)
            values.append(round(final_value, 2))
        
        time_series[indicator] = values
    
    return jsonify({
        'scenario': POLICY_SCENARIOS[scenario],
        'intensity': intensity,
        'current_indicators': current_indicators,
        'projected_indicators': projected_indicators,
        'current_odi': round(current_odi, 1),
        'projected_odi': round(projected_odi, 1),
        'odi_change': round(projected_odi - current_odi, 1),
        'time_series': time_series,
        'months': months,
        'risk_assessment': {
            'level': 'Medium',
            'factors': ['Implementation complexity', 'Market volatility', 'Regulatory changes']
        },
        'recommendations': [
            'Monitor implementation progress closely',
            'Establish feedback mechanisms',
            'Prepare contingency plans'
        ]
    })

@app.route('/api/indicators')
def api_indicators():
    return jsonify(INDICATORS)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
