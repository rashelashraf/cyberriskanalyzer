
// Main JavaScript for Risk Analysis Tool

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize tab functionality
    initTabs();
    
    // Initialize sliders
    initSliders();
    
    // Initialize input change listeners
    initInputListeners();
    
    // Initialize calculations
    updateAssetValue();
    calculateSLE();
    calculateALE();
    calculateSafeguardValue();
    updateSummary();
    
    // Report generation
    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
});

// Navigation between sections
function initNavigation() {
    // Handle section navigation via data attributes
    const navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update navigation active state
            document.querySelectorAll('.nav-links a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show the correct section
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
    
    // Handle next/previous buttons
    const navigationButtons = document.querySelectorAll('[data-goto]');
    navigationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-goto');
            showSection(sectionId);
            
            // Also update the navigation menu active state
            document.querySelectorAll('.nav-links a').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('data-section') === sectionId) {
                    navLink.classList.add('active');
                }
            });
        });
    });
}

// Show a specific section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active-section');
    });
    
    // Show the selected section
    document.getElementById(sectionId).classList.add('active-section');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Initialize tab functionality
function initTabs() {
    // Tab click handlers
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all tabs
            tabItems.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show the correct tab content
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });
}

// Show a specific tab and hide others
function showTab(tabId) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Show the selected tab pane
    document.getElementById(tabId).classList.add('active');
}

// Initialize sliders
function initSliders() {
    // Exposure Factor Slider
    const efSlider = document.getElementById('exposure-factor-slider');
    const efValue = document.getElementById('exposure-factor-value');
    
    if (efSlider && efValue) {
        efSlider.addEventListener('input', function() {
            efValue.textContent = this.value + '%';
            calculateSLE();
        });
    }
    
    // ARO Sensitivity Slider
    const aroSensitivitySlider = document.getElementById('aro-sensitivity-slider');
    const aroSensitivityValue = document.getElementById('aro-sensitivity-value');
    const aroSensitivityResult = document.getElementById('aro-sensitivity-result');
    
    if (aroSensitivitySlider && aroSensitivityValue && aroSensitivityResult) {
        aroSensitivitySlider.addEventListener('input', function() {
            aroSensitivityValue.textContent = this.value;
            
            // Calculate ROSI with this ARO
            const sle = parseInt(document.getElementById('sle-result').textContent.replace('$', '').replace(',', '')) || 9000;
            const aroAfter = parseFloat(document.getElementById('aro-after').value) || 0.1;
            const costPerUnit = parseFloat(document.getElementById('safeguard-cost').value) || 200;
            const units = parseInt(document.getElementById('units-count').value) || 1;
            const totalCost = costPerUnit * units;
            
            const aleBefore = sle * this.value;
            const aleAfter = sle * aroAfter;
            const safeguardValue = aleBefore - aleAfter - totalCost;
            const rosi = (safeguardValue / totalCost) * 100;
            
            aroSensitivityResult.innerHTML = `<p><strong>ROSI at ARO = ${this.value}:</strong> ${Math.round(rosi)}%</p>`;
        });
    }
    
    // EF Sensitivity Slider
    const efSensitivitySlider = document.getElementById('ef-sensitivity-slider');
    const efSensitivityValue = document.getElementById('ef-sensitivity-value');
    const efSensitivityResult = document.getElementById('ef-sensitivity-result');
    
    if (efSensitivitySlider && efSensitivityValue && efSensitivityResult) {
        efSensitivitySlider.addEventListener('input', function() {
            efSensitivityValue.textContent = this.value + '%';
            
            // Calculate ROSI with this EF
            const av = getTotalAssetValue();
            const aro = parseFloat(document.getElementById('aro-value').value) || 0.5;
            const aroAfter = parseFloat(document.getElementById('aro-after').value) || 0.1;
            const costPerUnit = parseFloat(document.getElementById('safeguard-cost').value) || 200;
            const units = parseInt(document.getElementById('units-count').value) || 1;
            const totalCost = costPerUnit * units;
            const efDecimal = this.value / 100;
            
            const sle = av * efDecimal;
            const aleBefore = sle * aro;
            const aleAfter = sle * aroAfter;
            const safeguardValue = aleBefore - aleAfter - totalCost;
            const rosi = (safeguardValue / totalCost) * 100;
            
            efSensitivityResult.innerHTML = `<p><strong>ROSI at EF = ${this.value}%:</strong> ${Math.round(rosi)}%</p>`;
        });
    }
    
    // Cost Sensitivity Slider
    const costSensitivitySlider = document.getElementById('cost-sensitivity-slider');
    const costSensitivityValue = document.getElementById('cost-sensitivity-value');
    const costSensitivityResult = document.getElementById('cost-sensitivity-result');
    
    if (costSensitivitySlider && costSensitivityValue && costSensitivityResult) {
        costSensitivitySlider.addEventListener('input', function() {
            costSensitivityValue.textContent = '$' + this.value;
            
            // Calculate ROSI with this cost
            const aleBefore = parseInt(document.getElementById('ale-before-result').textContent.replace('$', '').replace(',', '')) || 4500;
            const aleAfter = parseInt(document.getElementById('ale-after-result').textContent.replace('$', '').replace(',', '')) || 900;
            const units = parseInt(document.getElementById('units-count').value) || 1;
            const totalCost = this.value * units;
            
            const safeguardValue = aleBefore - aleAfter - totalCost;
            const rosi = (safeguardValue / totalCost) * 100;
            
            costSensitivityResult.innerHTML = `<p><strong>ROSI at Cost = $${this.value}:</strong> ${Math.round(rosi)}%</p>`;
        });
    }
}

// Initialize input change listeners
function initInputListeners() {
    // Asset value inputs
    const hardwareValueInput = document.getElementById('hardware-value');
    const dataValueInput = document.getElementById('data-value');
    
    if (hardwareValueInput) {
        hardwareValueInput.addEventListener('input', updateAssetValue);
    }
    
    if (dataValueInput) {
        dataValueInput.addEventListener('input', updateAssetValue);
    }
    
    // ARO inputs
    const aroInput = document.getElementById('aro-value');
    const aroAfterInput = document.getElementById('aro-after');
    
    if (aroInput) {
        aroInput.addEventListener('input', calculateALE);
    }
    
    if (aroAfterInput) {
        aroAfterInput.addEventListener('input', calculateALE);
    }
    
    // Safeguard cost inputs
    const safeguardCostInput = document.getElementById('safeguard-cost');
    const unitsCountInput = document.getElementById('units-count');
    
    if (safeguardCostInput) {
        safeguardCostInput.addEventListener('input', calculateSafeguardValue);
    }
    
    if (unitsCountInput) {
        unitsCountInput.addEventListener('input', calculateSafeguardValue);
    }
    
    // Other inputs for summary updates
    const assetNameInput = document.getElementById('asset-name');
    const threatDescriptionInput = document.getElementById('threat-description');
    const safeguardDescriptionInput = document.getElementById('safeguard-description');
    
    [assetNameInput, threatDescriptionInput, safeguardDescriptionInput].forEach(input => {
        if (input) {
            input.addEventListener('input', updateSummary);
        }
    });
}

// Calculate and update total asset value
function updateAssetValue() {
    const hardwareValue = parseFloat(document.getElementById('hardware-value').value) || 1000;
    const dataValue = parseFloat(document.getElementById('data-value').value) || 9000;
    
    const totalAssetValue = hardwareValue + dataValue;
    document.getElementById('asset-value-result').textContent = '$' + totalAssetValue.toLocaleString();
    
    // Also update SLE if exposure factor exists
    calculateSLE();
}

// Get total asset value
function getTotalAssetValue() {
    return parseFloat(document.getElementById('asset-value-result').textContent.replace('$', '').replace(',', '')) || 10000;
}

// Calculate SLE based on asset value and exposure factor
function calculateSLE() {
    const assetValue = getTotalAssetValue();
    const exposureFactor = parseInt(document.getElementById('exposure-factor-slider').value) / 100;
    
    const sle = assetValue * exposureFactor;
    document.getElementById('sle-result').textContent = '$' + sle.toLocaleString();
    
    // Also update ALE
    calculateALE();
}

// Calculate ALE based on SLE and ARO
function calculateALE() {
    const sle = parseInt(document.getElementById('sle-result').textContent.replace('$', '').replace(',', '')) || 9000;
    const aroBefore = parseFloat(document.getElementById('aro-value').value) || 0.5;
    const aroAfter = parseFloat(document.getElementById('aro-after').value) || 0.1;
    
    const aleBefore = sle * aroBefore;
    const aleAfter = sle * aroAfter;
    
    document.getElementById('ale-before-result').textContent = '$' + aleBefore.toLocaleString();
    document.getElementById('ale-after-result').textContent = '$' + aleAfter.toLocaleString();
    
    // Update safeguard value
    calculateSafeguardValue();
}

// Calculate safeguard value and ROSI
function calculateSafeguardValue() {
    const aleBefore = parseInt(document.getElementById('ale-before-result').textContent.replace('$', '').replace(',', '')) || 4500;
    const aleAfter = parseInt(document.getElementById('ale-after-result').textContent.replace('$', '').replace(',', '')) || 900;
    
    const costPerUnit = parseFloat(document.getElementById('safeguard-cost').value) || 200;
    const units = parseInt(document.getElementById('units-count').value) || 1;
    const totalCost = costPerUnit * units;
    
    document.getElementById('total-cost-result').textContent = '$' + totalCost.toLocaleString();
    
    const safeguardValue = aleBefore - aleAfter - totalCost;
    document.getElementById('safeguard-value-result').textContent = '$' + safeguardValue.toLocaleString();
    
    // Calculate ROSI
    const rosi = (safeguardValue / totalCost) * 100;
    document.getElementById('rosi-percentage').textContent = Math.round(rosi) + '%';
    
    // Calculate risk reduction percentage
    const riskReduction = ((aleBefore - aleAfter) / aleBefore) * 100;
    document.getElementById('risk-reduction-percentage').textContent = Math.round(riskReduction) + '%';
    
    // Update summary
    updateSummary();
    
    // Update recommendation based on ROSI
    updateRecommendation(rosi, safeguardValue);
}

// Update recommendation based on ROSI
function updateRecommendation(rosi, safeguardValue) {
    const recommendationBox = document.getElementById('recommendation-box');
    
    if (rosi > 100) {
        recommendationBox.className = 'alert alert-info';
        recommendationBox.innerHTML = `<strong>Recommendation:</strong> Since the safeguard saves $${safeguardValue.toLocaleString()} per year and provides a ROSI of ${Math.round(rosi)}%, it is strongly recommended to implement the proposed security control.`;
    } else if (rosi > 0) {
        recommendationBox.className = 'alert alert-info';
        recommendationBox.innerHTML = `<strong>Recommendation:</strong> With a positive ROSI of ${Math.round(rosi)}%, the safeguard is financially justified but with a moderate return. Consider implementation as part of a broader security strategy.`;
    } else {
        recommendationBox.className = 'alert alert-warning';
        recommendationBox.innerHTML = `<strong>Recommendation:</strong> With a negative ROSI of ${Math.round(rosi)}%, the safeguard is not financially justified based on purely quantitative factors. Consider other qualitative benefits before deciding.`;
    }
}

// Update executive summary
function updateSummary() {
    // Asset
    const assetName = document.getElementById('asset-name').value || 'Employee laptops containing sensitive business data';
    document.getElementById('summary-asset').textContent = assetName;
    
    // Threat
    const threatDescription = document.getElementById('threat-description').value || 'Ransomware infection leading to data loss';
    document.getElementById('summary-threat').textContent = threatDescription;
    
    // Safeguard
    const safeguardDescription = document.getElementById('safeguard-description').value || 'Installing enterprise-level antivirus software';
    document.getElementById('summary-safeguard').textContent = safeguardDescription;
    
    // Cost
    const costPerUnit = document.getElementById('safeguard-cost').value || '200';
    const units = document.getElementById('units-count').value || '1';
    document.getElementById('summary-cost').textContent = `$${costPerUnit} per year per unit (× ${units} units)`;
    
    // SLE, ALE, etc.
    document.getElementById('summary-sle').textContent = document.getElementById('sle-result').textContent;
    document.getElementById('summary-ale-before').textContent = document.getElementById('ale-before-result').textContent;
    document.getElementById('summary-ale-after').textContent = document.getElementById('ale-after-result').textContent;
    document.getElementById('summary-value').textContent = document.getElementById('safeguard-value-result').textContent;
    document.getElementById('summary-rosi').textContent = document.getElementById('rosi-percentage').textContent;
}

// Generate full report
function generateReport() {
    alert('Report Generation: In a complete implementation, this would generate a PDF or printable report with all analysis details for stakeholders.');
}
