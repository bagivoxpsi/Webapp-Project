// dashboard.js

// Function to get user ID from localStorage
function getUserId() {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        console.error('No user ID found in localStorage');
        alert('Please log in to view your dashboard');
        return null;
    }
    
    console.log('Found user ID:', userId);
    return userId;
}

// Function to fetch dashboard stats
async function fetchDashboardStats() {
    const userId = getUserId();
    
    if (!userId) return;
    
    try {
        console.log('Fetching dashboard data for user:', userId);
        const response = await fetch(`/Webapp-Backend/api/dashboard/stats?userId=${userId}`);
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Dashboard data received:', data);
        updateDashboardUI(data);
        
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        useDemoData();
        showError('Unable to load dashboard data. Using demo data.');
    }
}

// Function to fetch upcoming tasks
async function fetchUpcomingTasks() {
    const userId = getUserId();
    
    if (!userId) return;
    
    try {
        console.log('Fetching tasks for user:', userId);
        const response = await fetch(`/Webapp-Backend/getTasks?userId=${userId}`);
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const tasks = await response.json();
        console.log('Tasks received:', tasks);
        updateTasksUI(tasks);
        
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showError('Unable to load tasks.');
    }
}

// Update dashboard with real data
function updateDashboardUI(stats) {
    console.log('Updating dashboard with:', stats);
    
    // Update stats cards
    if (document.getElementById('totalDevices')) {
        document.getElementById('totalDevices').textContent = stats.totalDevices || 0;
    }
    
    if (document.getElementById('onlineDevices')) {
        document.getElementById('onlineDevices').textContent = stats.onlineDevices || 0;
    }
    
    if (document.getElementById('energyUsage')) {
        document.getElementById('energyUsage').textContent = (stats.energyConsumption || 0).toFixed(1) + ' kWh';
    }
    
    if (document.getElementById('securityEvents')) {
        document.getElementById('securityEvents').textContent = stats.securityEvents || 0;
    }
    
    if (document.getElementById('temperature')) {
        document.getElementById('temperature').textContent = (stats.temperatureAvg || 0).toFixed(1) + '°C';
    }
    
    if (document.getElementById('dailySavings')) {
        document.getElementById('dailySavings').textContent = '$' + (stats.dailySavings || 0).toFixed(2);
    }
    
    // Update online percentage
    const totalDevices = stats.totalDevices || 1;
    const onlineDevices = stats.onlineDevices || 0;
    const onlinePercentage = Math.round((onlineDevices / totalDevices) * 100);
    
    if (document.getElementById('onlinePercentage')) {
        document.getElementById('onlinePercentage').textContent = onlinePercentage + '% Online';
        
        const percentageElement = document.getElementById('onlinePercentage');
        percentageElement.className = 'text-muted';
        if (onlinePercentage >= 80) {
            percentageElement.classList.add('text-success');
        } else if (onlinePercentage >= 50) {
            percentageElement.classList.add('text-warning');
        } else {
            percentageElement.classList.add('text-danger');
        }
    }
    
    // Update security status
    if (document.getElementById('securityStatus')) {
        const securityStatus = document.getElementById('securityStatus');
        const securityEvents = stats.securityEvents || 0;
        
        if (securityEvents === 0) {
            securityStatus.textContent = 'All Secure';
            securityStatus.className = 'mb-1 text-success';
        } else if (securityEvents <= 2) {
            securityStatus.textContent = 'Minor Issues';
            securityStatus.className = 'mb-1 text-warning';
        } else {
            securityStatus.textContent = 'Attention Needed';
            securityStatus.className = 'mb-1 text-danger';
        }
    }
    
    updateEnergyChart(stats.energyConsumption);
}

// Update tasks section
function updateTasksUI(tasks) {
    const tasksContainer = document.getElementById('upcomingTasksContainer');
    if (!tasksContainer) return;
    
    tasksContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="list-group-item text-center text-muted px-0">
                <i class="fa fa-tasks me-2"></i>No upcoming tasks
            </div>
        `;
        return;
    }
    
    // Sort tasks by time (closest first)
    const sortedTasks = tasks.sort((a, b) => {
        const timeA = convertToMinutes(a.taskTime);
        const timeB = convertToMinutes(b.taskTime);
        return timeA - timeB;
    });
    
    // Display tasks
    sortedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
}

// Convert time string to minutes for sorting
function convertToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// Create HTML element for a task
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'list-group-item d-flex justify-content-between align-items-center px-0';
    
    const { icon, description } = getTaskDetails(task);
    
    taskElement.innerHTML = `
        <div>
            <i class="${icon} me-2"></i>
            <span>${description}</span>
        </div>
        <small class="text-muted">${formatTime(task.taskTime)}</small>
    `;
    
    return taskElement;
}

// Get icon and description based on device
function getTaskDetails(task) {
    const device = task.device.toLowerCase();
    const properties = task.properties || {};
    
    let icon = 'fa fa-tasks';
    let description = `${task.device} task`;
    
    switch(device) {
        case 'light':
            icon = 'fa fa-lightbulb text-warning';
            const action = properties.action === 'off' ? 'OFF' : 'ON';
            const room = properties.room || 'Room';
            description = `${room} Lights ${action}`;
            break;
            
        case 'thermostat':
            icon = 'fa fa-thermometer-half text-info';
            const temp = properties.temperature || 'set';
            description = `Thermostat ${temp}°F`;
            break;
            
        case 'speaker':
            icon = 'fa fa-volume-up text-primary';
            const volume = properties.volume || 'adjust';
            description = `Speaker Volume ${volume}`;
            break;
            
        case 'lock':
            icon = 'fa fa-lock text-success';
            const lockAction = properties.action === 'lock' ? 'LOCK' : 'UNLOCK';
            description = `Doors ${lockAction}`;
            break;
            
        default:
            icon = 'fa fa-cog text-secondary';
            description = `${task.device} automation`;
    }
    
    return { icon, description };
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Fallback to demo data
function useDemoData() {
    console.log('Using demo data');
    const demoStats = {
        totalDevices: 8,
        onlineDevices: 6,
        energyConsumption: 15.5,
        securityEvents: 2,
        temperatureAvg: 22.5,
        dailySavings: 3.25
    };
    updateDashboardUI(demoStats);
}

// Show error message
function showError(message) {
    console.error('Dashboard Error:', message);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-warning alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container-fluid');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
    }
}

// Update energy chart
function updateEnergyChart(energyConsumption) {
    const ctx = document.getElementById('energyBarChart');
    if (!ctx) return;
    
    const baseEnergy = energyConsumption || 15.5;
    const weeklyData = [
        baseEnergy * 0.8, baseEnergy * 0.9, baseEnergy * 0.85,
        baseEnergy, baseEnergy * 1.1, baseEnergy * 0.9, baseEnergy * 1.05
    ];
    
    let tickColor = localStorage.getItem("darkmode") === "active" ? "#ffffff" : "#333333";
    
    if (window.energyChart instanceof Chart) {
        window.energyChart.destroy();
    }
    
    window.energyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Energy (kWh)',
                data: weeklyData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: tickColor }
                },
                x: {
                    ticks: { color: tickColor }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Refresh all dashboard data
function refreshDashboard() {
    console.log('Refreshing dashboard...');
    fetchDashboardStats();
    fetchUpcomingTasks();
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function() {
    console.log('Dashboard initialized');
    
    const userId = getUserId();
    if (!userId) {
        window.location.href = 'account/login.html';
        return;
    }
    
    // Load data when page loads
    fetchDashboardStats();
    fetchUpcomingTasks();
    
    // Auto-refresh every 30 seconds
    setInterval(refreshDashboard, 30000);
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshDashboard();
            refreshBtn.innerHTML = '<i class="fa fa-refresh me-2"></i>Refreshing...';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fa fa-refresh me-2"></i>Refresh Dashboard';
            }, 1000);
        });
    }
    
    // Tasks refresh button
    const refreshTasksBtn = document.getElementById('refreshTasksBtn');
    if (refreshTasksBtn) {
        refreshTasksBtn.addEventListener('click', function() {
            fetchUpcomingTasks();
            refreshTasksBtn.innerHTML = '<i class="fa fa-refresh fa-spin"></i>';
            setTimeout(() => {
                refreshTasksBtn.innerHTML = '<i class="fa fa-refresh"></i>';
            }, 1000);
        });
    }

    // Quick action buttons
    const lightsOffBtn = document.getElementById("lightsOffBtn");
    const awayModeBtn = document.getElementById("awayModeBtn");
    const thermostatBtn = document.getElementById("thermostatBtn");
    const lightStatusText = document.getElementById("lightStatusText");
    const thermostatStatus = document.getElementById("thermostatStatus");
    let lightsAreOff = false;
    let awayModeOn = false;

    // Add activity to list
    function addActivity(iconClass, text) {
        const list = document.getElementById("activityList");
        if (!list) return;

        const item = document.createElement("div");
        item.className = "list-group-item d-flex justify-content-between align-items-center px-0";
        item.innerHTML = `
            <div><i class="${iconClass} me-2"></i>${text}</div>
            <small class="text-muted">Just now</small>
        `;

        list.prepend(item);
        while (list.children.length > 3) {
            list.removeChild(list.lastElementChild);
        }
    }

    // Lights Off button
    if (lightsOffBtn) {
        lightsOffBtn.addEventListener("click", function() {
            lightsAreOff = !lightsAreOff;
            if (lightsAreOff) {
                lightsOffBtn.innerHTML = `<i class="fa fa-lightbulb me-2"></i>Set Lights On <span id="lightIndicator" class="light-indicator off ms-2"></span>`;
                if (lightStatusText) lightStatusText.textContent = "Living Room Lights OFF";
                alert("💡 All lights have been turned off!");
            } else {
                lightsOffBtn.innerHTML = `<i class="fa fa-lightbulb me-2"></i>Set Lights Off <span id="lightIndicator" class="light-indicator ms-2"></span>`;
                if (lightStatusText) lightStatusText.textContent = "Living Room Lights ON";
                alert("🔆 All lights have been turned on!");
            }
            addActivity("fa fa-lightbulb text-warning", lightsAreOff ? "Lights turned OFF" : "Lights turned ON");
        });
    }

    // Away Mode button
    if (awayModeBtn) {
        awayModeBtn.addEventListener("click", function() {
            awayModeOn = !awayModeOn;
            const awayModeLabel = document.getElementById("awayModeLabel");
            if (awayModeOn) {
                awayModeLabel.textContent = "Away Mode Turned On";
                awayModeBtn.classList.add("btn-away-active");
                awayModeBtn.classList.remove("btn-outline-secondary");
                alert("🏠 Away Mode activated — doors locked and thermostat adjusted.");
                addActivity("fa fa-shield text-danger", "Away Mode activated");
            } else {
                awayModeLabel.textContent = "Set Away Mode";
                awayModeBtn.classList.remove("btn-away-active");
                awayModeBtn.classList.add("btn-outline-secondary");
                alert("🏡 Away Mode deactivated — normal mode resumed.");
                addActivity("fa fa-shield text-success", "Away Mode deactivated");
            }
        });
    }

    // Thermostat button
    if (thermostatBtn) {
        thermostatBtn.addEventListener("click", function() {
            const temp = prompt("🌡️ Set thermostat temperature (°F):", "72");
            if (temp) {
                thermostatBtn.innerHTML = `<i class="fa fa-thermometer me-2"></i>Set to ${temp}°F`;
                if (thermostatStatus) {
                    thermostatStatus.textContent = `${temp}°F`;
                    thermostatStatus.classList.add("flash");
                    setTimeout(() => thermostatStatus.classList.remove("flash"), 600);
                }
                alert(`Thermostat adjusted to ${temp}°F`);
                addActivity("fa fa-thermometer text-info", `Thermostat set to ${temp}°F`);
            }
        });
    }
});