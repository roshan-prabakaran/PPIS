# Predictive Policy Intelligence System

A Flask-based prototype for AI-powered policy simulation and analysis for MSME growth and national development.

## Features

- **Interactive Dashboard**: Real-time ODI calculation and key indicator visualization
- **Policy Simulation Lab**: Test "what-if" scenarios with adjustable intensity
- **AI-Powered Forecasting**: LSTM and XGBoost model simulation
- **Presentation Mode**: Professional presentation with Reveal.js
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Run the application:
\`\`\`bash
python app.py
\`\`\`

3. Open your browser and navigate to:
\`\`\`
http://localhost:5000
\`\`\`

## Usage

### Dashboard
- View current ODI score and key indicators
- Quick policy simulations with one-click
- Real-time data visualization

### Simulation Lab
- Select policy scenarios (MSME Funding, Carbon Tax, etc.)
- Adjust policy intensity (10-100%)
- View detailed impact analysis and timeline charts

### Presentation Mode
- Professional presentation slides
- Interactive charts and visualizations
- Fullscreen mode support

## API Endpoints

- `GET /` - Dashboard
- `GET /simulation` - Simulation Lab
- `GET /presentation` - Presentation Mode
- `POST /api/simulate` - Run policy simulation
- `GET /api/indicators` - Get current indicators

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **Presentation**: Reveal.js
- **Icons**: Font Awesome
- **Styling**: Custom CSS with responsive design

## Demo Data

The prototype uses mock data for demonstration purposes. In a production environment, this would be connected to real data sources and trained ML models.
