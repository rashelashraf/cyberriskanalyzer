# Cybersecurity Risk Investment Analysis Tool

This web application provides a comprehensive framework for conducting quantitative cybersecurity risk assessments and investment analysis, specifically designed for postgraduate students studying Risk Management in Cybersecurity.

## Project Structure

```
project/
│
├── index.html              # Main HTML file
│
├── css/
│   └── styles.css          # All CSS styles
│
├── js/
│   ├── main.js             # Main application logic
│   └── chart.js            # Chart visualization code
│
└── README.md               # This file
```

## Features

- **Step-by-Step Risk Analysis Process**
  - Asset valuation and threat analysis
  - Risk calculation using SLE and ALE metrics
  - Safeguard effectiveness evaluation
  - Return on Security Investment (ROSI) calculation
  - Sensitivity analysis for key variables
  - Report generation

- **Interactive User Interface**
  - Real-time calculations
  - Dynamic form elements
  - Visualization of key metrics
  - Responsive design for all devices

- **Educational Framework**
  - Built-in formulas and explanations
  - Tooltips explaining cybersecurity risk concepts
  - Pre-populated with ransomware/antivirus example

## Usage Instructions

1. **Setup**
   - Simply host these files on any web server or open `index.html` directly in a browser
   - No external dependencies or server-side processing required

2. **Using the Tool**
   - Navigate through the different sections using the top navigation or next/previous buttons
   - Fill in the required information in each section
   - The tool will automatically calculate key metrics based on your inputs
   - Use the sensitivity analysis to test how changes in key variables affect the results
   - Generate a report with your findings

3. **Example Scenario**
   - The tool comes pre-populated with a ransomware protection example:
     - Asset: Employee laptops ($10,000 value)
     - Threat: Ransomware infection (90% exposure factor)
     - Safeguard: Enterprise antivirus ($200/year)
     - Expected risk reduction: From once every 2 years to once every 10 years

## Extension Possibilities

For instructors or students looking to extend this project:

1. **Add Chart Integration**
   - Integrate a proper charting library like Chart.js or D3.js
   - Create dynamic visualizations that update with input changes

2. **Add PDF Report Generation**
   - Implement PDF export functionality using libraries like jsPDF
   - Create professionally formatted reports for presentations

3. **Add Multi-Safeguard Comparison**
   - Extend the model to compare multiple safeguards side-by-side
   - Implement a portfolio optimization approach for multiple controls

4. **Add Statistical Risk Modeling**
   - Implement Monte Carlo simulation for more sophisticated risk calculations
   - Add probability distributions for variables instead of point estimates

## Credits

Developed for postgraduate Cybersecurity Risk Management students as an educational tool for understanding quantitative risk assessment methodologies.

## License

This template is available for educational use.