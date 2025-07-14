// Main JavaScript functionality for the Policy Intelligence System

// Global variables
const currentUser = null
const dashboardCharts = {}
const simulationData = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Initialize tooltips
  initializeTooltips()

  // Initialize responsive navigation
  initializeNavigation()

  // Initialize page-specific functionality
  const currentPage = getCurrentPage()
  switch (currentPage) {
    case "dashboard":
      initializeDashboard()
      break
    case "simulation":
      initializeSimulation()
      break
    case "presentation":
      initializePresentation()
      break
  }
}

function getCurrentPage() {
  const path = window.location.pathname
  if (path.includes("simulation")) return "simulation"
  if (path.includes("presentation")) return "presentation"
  return "dashboard"
}

function initializeTooltips() {
  // Add tooltip functionality for interactive elements
  const tooltipElements = document.querySelectorAll("[data-tooltip]")
  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip)
    element.addEventListener("mouseleave", hideTooltip)
  })
}

function showTooltip(event) {
  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = event.target.getAttribute("data-tooltip")
  document.body.appendChild(tooltip)

  const rect = event.target.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip")
  if (tooltip) {
    tooltip.remove()
  }
}

function initializeNavigation() {
  // Mobile navigation toggle
  const navToggle = document.createElement("button")
  navToggle.className = "nav-toggle"
  navToggle.innerHTML = '<i class="fas fa-bars"></i>'
  navToggle.style.display = "none"

  const navContainer = document.querySelector(".nav-container")
  const navMenu = document.querySelector(".nav-menu")

  if (navContainer && navMenu) {
    navContainer.insertBefore(navToggle, navMenu)

    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("nav-menu-active")
    })

    // Show/hide mobile toggle based on screen size
    function checkScreenSize() {
      if (window.innerWidth <= 768) {
        navToggle.style.display = "block"
      } else {
        navToggle.style.display = "none"
        navMenu.classList.remove("nav-menu-active")
      }
    }

    window.addEventListener("resize", checkScreenSize)
    checkScreenSize()
  }
}

function initializeDashboard() {
  // Dashboard-specific initialization
  console.log("Initializing dashboard...")

  // Auto-refresh indicators every 30 seconds
  setInterval(refreshIndicators, 30000)

  // Initialize real-time updates
  initializeRealTimeUpdates()
}

function initializeSimulation() {
  // Simulation-specific initialization
  console.log("Initializing simulation...")

  // Initialize scenario comparison
  initializeScenarioComparison()

  // Initialize advanced controls
  initializeAdvancedControls()
}

function initializePresentation() {
  // Presentation-specific initialization
  console.log("Initializing presentation...")

  // Initialize presentation controls
  initializePresentationControls()
}

function refreshIndicators() {
  fetch("/api/indicators")
    .then((response) => response.json())
    .then((data) => {
      updateIndicatorCards(data)
    })
    .catch((error) => {
      console.error("Error refreshing indicators:", error)
    })
}

function updateIndicatorCards(indicators) {
  Object.keys(indicators).forEach((key) => {
    const card = document.querySelector(`[data-indicator="${key}"]`)
    if (card) {
      const valueElement = card.querySelector(".indicator-value .value")
      if (valueElement) {
        // Add smooth animation for value changes
        const currentValue = Number.parseFloat(valueElement.textContent)
        const newValue = indicators[key].current
        animateValue(valueElement, currentValue, newValue, 1000)
      }
    }
  })
}

function animateValue(element, start, end, duration) {
  const startTime = performance.now()
  const difference = end - start

  function updateValue(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const currentValue = start + difference * progress
    element.textContent = currentValue.toFixed(1)

    if (progress < 1) {
      requestAnimationFrame(updateValue)
    }
  }

  requestAnimationFrame(updateValue)
}

function initializeRealTimeUpdates() {
  // Simulate real-time data updates
  const indicators = ["gdp_growth", "employment", "literacy", "carbon_emissions", "innovation_index", "msme_growth"]

  setInterval(() => {
    indicators.forEach((indicator) => {
      const chart = dashboardCharts[indicator]
      if (chart) {
        // Add new data point
        const newValue = generateRandomDataPoint(indicator)
        chart.data.datasets[0].data.push(newValue)

        // Remove old data point if too many
        if (chart.data.datasets[0].data.length > 12) {
          chart.data.datasets[0].data.shift()
        }

        chart.update("none")
      }
    })
  }, 5000)
}

function generateRandomDataPoint(indicator) {
  // Generate realistic random data based on indicator type
  const baseValues = {
    gdp_growth: 6.8,
    employment: 94.2,
    literacy: 77.7,
    carbon_emissions: 2.65,
    innovation_index: 36.8,
    msme_growth: 12.5,
  }

  const base = baseValues[indicator] || 50
  const variation = base * 0.05 // 5% variation
  return base + (Math.random() - 0.5) * variation
}

function initializeScenarioComparison() {
  // Add scenario comparison functionality
  const compareBtn = document.createElement("button")
  compareBtn.className = "btn-secondary"
  compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Compare Scenarios'
  compareBtn.onclick = openScenarioComparison

  const controlSection = document.querySelector(".simulation-controls")
  if (controlSection) {
    controlSection.appendChild(compareBtn)
  }
}

function openScenarioComparison() {
  // Create modal for scenario comparison
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.id = "scenarioComparisonModal"
  modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Scenario Comparison</h2>
            <div class="comparison-grid">
                <div class="scenario-column">
                    <h3>Scenario A</h3>
                    <select class="scenario-select" id="scenarioA">
                        <option value="">Select scenario...</option>
                    </select>
                    <div class="scenario-results" id="resultsA"></div>
                </div>
                <div class="scenario-column">
                    <h3>Scenario B</h3>
                    <select class="scenario-select" id="scenarioB">
                        <option value="">Select scenario...</option>
                    </select>
                    <div class="scenario-results" id="resultsB"></div>
                </div>
            </div>
            <div class="comparison-chart">
                <canvas id="comparisonChart"></canvas>
            </div>
        </div>
    `

  document.body.appendChild(modal)
  modal.style.display = "block"

  // Add close functionality
  modal.querySelector(".close").onclick = () => {
    modal.remove()
  }

  // Populate scenario options
  populateScenarioOptions()
}

function populateScenarioOptions() {
  const scenarios = {
    msme_funding: "MSME Funding Increase",
    carbon_tax: "Carbon Tax Implementation",
    education_investment: "Education Investment",
    infrastructure: "Infrastructure Development",
    digital_transformation: "Digital Transformation",
  }

  const selectA = document.getElementById("scenarioA")
  const selectB = document.getElementById("scenarioB")

  Object.keys(scenarios).forEach((key) => {
    const optionA = document.createElement("option")
    optionA.value = key
    optionA.textContent = scenarios[key]
    selectA.appendChild(optionA)

    const optionB = document.createElement("option")
    optionB.value = key
    optionB.textContent = scenarios[key]
    selectB.appendChild(optionB)
  })
}

function initializeAdvancedControls() {
  // Add advanced simulation controls
  const advancedSection = document.createElement("div")
  advancedSection.className = "control-section"
  advancedSection.innerHTML = `
        <h3>Advanced Options</h3>
        <div class="advanced-controls">
            <label>
                <input type="checkbox" id="includeUncertainty"> Include Uncertainty Bands
            </label>
            <label>
                <input type="checkbox" id="enableMonteCarlo"> Monte Carlo Simulation
            </label>
            <label>
                Time Horizon: 
                <select id="timeHorizon">
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                </select>
            </label>
        </div>
    `

  const controlsContainer = document.querySelector(".simulation-controls")
  if (controlsContainer) {
    controlsContainer.appendChild(advancedSection)
  }
}

function initializePresentationControls() {
  // Add presentation-specific controls
  const controls = document.querySelector(".presentation-controls")
  if (controls) {
    // Add export button
    const exportBtn = document.createElement("button")
    exportBtn.className = "btn-secondary"
    exportBtn.innerHTML = '<i class="fas fa-download"></i> Export PDF'
    exportBtn.onclick = exportPresentationToPDF
    controls.appendChild(exportBtn)

    // Add share button
    const shareBtn = document.createElement("button")
    shareBtn.className = "btn-secondary"
    shareBtn.innerHTML = '<i class="fas fa-share"></i> Share'
    shareBtn.onclick = sharePresentation
    controls.appendChild(shareBtn)
  }
}

function exportPresentationToPDF() {
  // Simulate PDF export
  showNotification("PDF export feature would generate a comprehensive presentation report.", "info")
}

function sharePresentation() {
  // Simulate sharing functionality
  if (navigator.share) {
    navigator.share({
      title: "Predictive Policy Intelligence System",
      text: "Check out this AI-powered policy simulation platform",
      url: window.location.href,
    })
  } else {
    // Fallback for browsers without native sharing
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl).then(() => {
      showNotification("Presentation link copied to clipboard!", "success")
    })
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `

  // Add notification styles if not already present
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style")
    styles.id = "notification-styles"
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 3000;
                animation: slideIn 0.3s ease;
            }
            
            .notification-success { border-left: 4px solid #10b981; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-info { border-left: 4px solid #3b82f6; }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
                color: #6b7280;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `
    document.head.appendChild(styles)
  }

  document.body.appendChild(notification)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideIn 0.3s ease reverse"
    setTimeout(() => notification.remove(), 300)
  }, 5000)

  // Manual close
  notification.querySelector(".notification-close").onclick = () => {
    notification.style.animation = "slideIn 0.3s ease reverse"
    setTimeout(() => notification.remove(), 300)
  }
}

// Utility functions
function formatNumber(num, decimals = 1) {
  return Number.parseFloat(num).toFixed(decimals)
}

function formatCurrency(num) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

function formatPercentage(num) {
  return `${formatNumber(num)}%`
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Export functions for use in other scripts
window.PolicyIntelligence = {
  showNotification,
  formatNumber,
  formatCurrency,
  formatPercentage,
  debounce,
}
