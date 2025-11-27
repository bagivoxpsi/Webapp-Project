document.addEventListener("DOMContentLoaded", function () {
    const upcomingTasksContainer = document.getElementById("upcoming-tasks");

    function formatTimeHHMM(timeStr) {
        const [hour, minute] = timeStr.split(":").map(Number);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
    }

    function getDeviceIcon(device) {
        switch (device.toLowerCase()) {
            case "light": return '<i class="fa fa-lightbulb"></i>';
            case "thermostat": return '<i class="fa fa-thermometer-half"></i>';
            case "speaker": return '<i class="fa fa-volume-up"></i>';
            default: return '<i class="fa fa-question-circle"></i>';
        }
    }

    async function loadTopTasks() {
        upcomingTasksContainer.innerHTML = "Loading tasks...";
        const userId = localStorage.getItem("userId");
        if (!userId) {
            upcomingTasksContainer.innerHTML = "<div class='text-muted'>No upcoming tasks.</div>";
            return;
        }

        try {
            const res = await fetch(`/Webapp-Backend/getTopTasks?userId=${userId}`);
            if (!res.ok) throw new Error("Failed to fetch tasks");

            const tasks = await res.json();

            if (!tasks || tasks.length === 0) {
                upcomingTasksContainer.innerHTML = "<div class='text-muted'>No upcoming tasks.</div>";
                return;
            }

            upcomingTasksContainer.innerHTML = `
                <div class="d-flex flex-column align-items-center">
                    ${tasks.map(task => {
                        // Filter out empty properties
                        const propsText = Object.entries(task.properties)
                            .filter(([k,v]) => v && v.trim() !== "")
                            .map(([k,v]) => {
                                // If property name contains "color", render a color square
                                if (k.toLowerCase().includes("color")) {
                                    return `<span style="display:inline-flex; align-items:center;">
                                                <span style="width:16px; height:16px; background:${v}; border:1px solid #ccc; margin-right:4px;"></span>
                                                ${k}: ${v}
                                            </span>`;
                                } else {
                                    return `${k}: ${v}`;
                                }
                            })
                            .join(", ");

                        return `
                        <div class="card mb-2 shadow-sm rounded w-100">
                            <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
                                <div class="fw-bold mb-1">${getDeviceIcon(task.device)} ${task.device}</div>
                                <div class="text-muted mb-1">Time: ${formatTimeHHMM(task.taskTime)}</div>
                                ${propsText ? `<div class="text-muted">${propsText}</div>` : ""}
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            `;

        } catch (err) {
            console.error(err);
            upcomingTasksContainer.innerHTML = "<div class='text-danger'>Error loading tasks</div>";
        }
    }

    loadTopTasks();
});




const powerButton = document.getElementById('power-button');

powerButton.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default focus/blur behavior
    powerButton.classList.toggle('on');
});