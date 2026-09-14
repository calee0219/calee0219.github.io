// Three Resort Comparison - Radar Chart
document.addEventListener('DOMContentLoaded', function() {
  initThreeResortRadar();
});

function initThreeResortRadar() {
  const canvas = document.getElementById('threeResortRadar');
  if (!canvas) return;
  
  // Wait for Chart.js to load
  if (typeof Chart === 'undefined') {
    setTimeout(initThreeResortRadar, 200);
    return;
  }

  const ctx = canvas.getContext('2d');
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        '12月雪況', 
        '雪票CP值', 
        '住宿CP值', 
        '滑雪可玩性', 
        '觀光旅遊', 
        '交通便利', 
        '美食體驗'
      ],
      datasets: [
        {
          label: '🇫🇷 Chamonix',
          data: [8, 7, 6, 8, 9, 9, 9],
          backgroundColor: 'rgba(57, 73, 171, 0.15)',
          borderColor: 'rgba(57, 73, 171, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(57, 73, 171, 1)',
          pointRadius: 4
        },
        {
          label: '🇮🇹 Dolomiti',
          data: [8, 9, 9, 10, 9, 6, 10],
          backgroundColor: 'rgba(230, 81, 0, 0.15)',
          borderColor: 'rgba(230, 81, 0, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(230, 81, 0, 1)',
          pointRadius: 4
        },
        {
          label: '🇦🇹 Sölden',
          data: [9, 6, 6, 7, 7, 7, 7],
          backgroundColor: 'rgba(183, 28, 28, 0.15)',
          borderColor: 'rgba(183, 28, 28, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(183, 28, 28, 1)',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          min: 0,
          ticks: {
            stepSize: 2,
            font: { size: 11 }
          },
          pointLabels: {
            font: { size: 12, weight: 'bold' }
          },
          grid: {
            color: 'rgba(0,0,0,0.08)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 13, weight: 'bold' },
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.raw + '/10';
            }
          }
        }
      }
    }
  });
}
