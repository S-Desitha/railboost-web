
document.addEventListener('DOMContentLoaded', function () {
        
    const chartCanvas = document.querySelector(".chart");

    // Check if the canvas element exists
    if (chartCanvas) {
        // Initialize the chart
        const chart = new Chart(chartCanvas.getContext("2d"), {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        label: "Revenue by Tickets",
                        data: [250000, 150000, 180000, 400000, 220000, 250000, 200000, 500000, 270000, 240000, 210000, 700000],
                        backgroundColor: "rgba(82, 113, 255, 0.2)",
                        borderColor: "rgba(82, 113, 255, 1)",
                        borderWidth: 2,
                        pointRadius: 5,
                        pointStyle: 'circle'
                    },
                    {
                        label: "Revenue by Parcel Delivery",
                        data: [80000, 90000, 100000, 300000, 120000, 130000, 350000, 150000, 140000, 130000, 600000, 650000],
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 2,
                        pointRadius: 5,
                        pointStyle: 'rect'
                    }
                    // Add more datasets if needed
                ]
            },
            options: {
                responsive: true,
    plugins: {
        tooltip: {
            mode: 'index',
            intersect: false,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Month',
                font: {
                    size: 20,
                    weight: 'bold'
                }
            }
        },
        y: {
            title: {
                display: true,
                text: 'Revenue (in thousands)',
                font: {
                    size: 20,
                    weight: 'bold'
                }
            }
        }
    }
            }
        });
    } else {
        console.error("Canvas element with class 'chart' not found.");
    }

       
        
    const DchartCanvas = document.querySelector(".donut-chart");
    if (DchartCanvas) {
        const dchart = new Chart(DchartCanvas.getContext("2d"), {
            type: 'doughnut',
            data: {
                labels: [
                    'Delayed',
                    'On-Time',
                    'Cancelled'
                ],
                datasets: [{
                    label: 'Punctuality Rate of Trains',
                    data: [50, 80, 20],
                    backgroundColor: [
                        '#5271FF',   // Primary Color (Original Theme Color)
                        '#6495ED',   // Secondary Color (Lighter Shade)
                        '#3A50B6' 
                    ],
                    cutout: 100,
                    radius: 160,
                    borderWidth: 4,
                    hoverOffset: 10,
                    title: 'Punctuality Rate of Trains'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Punctuality Rate of Trains Today',
                        font: {
                            size: 20,
                            weight: 'bold'
                        }
                    }
                },
            }
        });
    } else {
        console.error("Canvas element with class 'donut-chart' not found.");
    }

         
    const polarchartCanvas = document.querySelector(".polar-chart");
    if (polarchartCanvas) {
        const pchart = new Chart(polarchartCanvas.getContext("2d"), {
            type: 'polarArea',
            data: {
                labels: [
                    'Delayed',
                    'On-Time',
                    'Cancelled'
                ],
                datasets: [{
                    label: 'Punctuality Rate of Trains',
                    data: [50, 100, 60],
                    backgroundColor: [
                        '#5271FF',   // Primary Color (Original Theme Color)
                        '#6495ED',   // Secondary Color (Lighter Shade)
                        '#3A50B6' 
                    ],
                    hoverBackgroundColor: [
                        '#0056b3',   // Primary Color (Original Theme Color - Darker Shade)
                        '#005cbf',   // Secondary Color (Lighter Shade - Darker Shade)
                        '#003c80' 
                    ],
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Punctuality Rate of Trains Today',
                        font: {
                            size: 22,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                                // weight: 'bold'
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: '#e9ecef', // Grid color
                        },
                        grid: {
                            color: '#e9ecef', // Grid color
                        },
                        ticks: {
                            font: {
                                size: 14,
                                // weight: 'bold'
                            },
                            color: '#495057', // Tick color
                        }
                    }
                }
            }
        });
    } else {
        console.error("Canvas element with class 'polar-chart' not found.");
    }

});
