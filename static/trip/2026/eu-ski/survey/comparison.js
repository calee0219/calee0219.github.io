// ===== COMPARISON ENHANCEMENTS =====
// Adds interactive comparison tools for Survey/decision-making stage

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. SORTABLE TABLES =====
  // Make all comparison tables sortable by clicking headers
  document.querySelectorAll('table').forEach(table => {
    const headers = table.querySelectorAll('th');
    if (headers.length < 2) return;
    
    headers.forEach((th, colIdx) => {
      th.style.cursor = 'pointer';
      th.style.userSelect = 'none';
      th.style.position = 'relative';
      
      // Add sort indicator
      const indicator = document.createElement('span');
      indicator.className = 'sort-indicator';
      indicator.textContent = ' ⇅';
      indicator.style.opacity = '0.4';
      indicator.style.fontSize = '0.8em';
      th.appendChild(indicator);
      
      let ascending = true;
      th.addEventListener('click', () => {
        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.querySelector('th'));
        
        rows.sort((a, b) => {
          const cellA = a.cells[colIdx]?.textContent.trim() || '';
          const cellB = b.cells[colIdx]?.textContent.trim() || '';
          
          // Extract numbers for numeric sort
          const numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
          const numB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));
          
          if (!isNaN(numA) && !isNaN(numB)) {
            return ascending ? numA - numB : numB - numA;
          }
          return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });
        
        rows.forEach(row => tbody.appendChild(row));
        ascending = !ascending;
        
        // Update indicators
        headers.forEach(h => {
          const ind = h.querySelector('.sort-indicator');
          if (ind) { ind.textContent = ' ⇅'; ind.style.opacity = '0.4'; }
        });
        indicator.textContent = ascending ? ' ↑' : ' ↓';
        indicator.style.opacity = '1';
      });
    });
  });

  // ===== 2. TABLE ROW HIGHLIGHTING =====
  // Highlight best values in comparison tables
  function highlightBestValues() {
    document.querySelectorAll('table').forEach(table => {
      const rows = Array.from(table.querySelectorAll('tbody tr, tr')).filter(r => !r.querySelector('th'));
      if (rows.length < 2) return;
      
      const numCols = rows[0]?.cells?.length || 0;
      
      for (let col = 1; col < numCols; col++) {
        const values = rows.map(r => {
          const text = r.cells[col]?.textContent.trim() || '';
          return parseFloat(text.replace(/[^0-9.-]/g, ''));
        });
        
        if (values.every(v => isNaN(v))) continue;
        
        const validValues = values.filter(v => !isNaN(v));
        if (validValues.length < 2) continue;
        
        const min = Math.min(...validValues);
        const max = Math.max(...validValues);
        
        // Check header to determine if lower or higher is better
        const header = table.querySelectorAll('th')[col]?.textContent.toLowerCase() || '';
        const lowerIsBetter = header.includes('成本') || header.includes('cost') || 
                              header.includes('價') || header.includes('price') ||
                              header.includes('費') || header.includes('fee') ||
                              header.includes('日票') || header.includes('住宿');
        
        rows.forEach((row, i) => {
          if (isNaN(values[i])) return;
          const cell = row.cells[col];
          if (!cell) return;
          
          if (lowerIsBetter && values[i] === min) {
            cell.classList.add('best-value');
          } else if (!lowerIsBetter && values[i] === max) {
            cell.classList.add('best-value');
          }
        });
      }
    });
  }
  highlightBestValues();

  // ===== 3. RADAR CHART for Ski Resorts =====
  function createRadarChart() {
    const skiSection = document.getElementById('ski');
    if (!skiSection) return;
    
    // Find the section-collapsible-content within ski section
    const content = skiSection.querySelector('.section-collapsible-content');
    if (!content) return;
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') return;
    
    // Create radar chart container
    const radarWrapper = document.createElement('div');
    radarWrapper.className = 'radar-chart-wrapper';
    radarWrapper.innerHTML = `
      <h3 class="comparison-subtitle" data-zh="雪場雷達圖比較" data-en="Ski Resort Radar Comparison">雪場雷達圖比較</h3>
      <p class="radar-hint" data-zh="點擊圖例可顯示/隱藏雪場" data-en="Click legend to show/hide resorts">點擊圖例可顯示/隱藏雪場</p>
      <div class="radar-chart-container">
        <canvas id="skiRadarChart"></canvas>
      </div>
    `;
    
    // Insert after the first table
    const firstTable = content.querySelector('table');
    if (firstTable) {
      firstTable.parentNode.insertBefore(radarWrapper, firstTable.nextSibling);
    } else {
      content.prepend(radarWrapper);
    }
    
    // Radar data (normalized 0-10 scale)
    const ctx = document.getElementById('skiRadarChart').getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['雪道長度', 'CP值', '初學者友善', '高手挑戰', '雪況可靠', 'Après-ski', '交通便利'],
        datasets: [
          {
            label: 'SkiWelt',
            data: [8, 10, 9, 4, 5, 4, 8],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            pointBackgroundColor: '#10b981',
            borderWidth: 2
          },
          {
            label: 'Saalbach',
            data: [8, 7, 10, 3, 6, 9, 7],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            pointBackgroundColor: '#3b82f6',
            borderWidth: 2
          },
          {
            label: 'Sölden',
            data: [4, 4, 5, 7, 10, 6, 6],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            pointBackgroundColor: '#f59e0b',
            borderWidth: 2
          },
          {
            label: 'St. Anton',
            data: [10, 6, 6, 10, 8, 10, 5],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            pointBackgroundColor: '#ef4444',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: { size: 13, family: "'Noto Sans TC', 'Inter', sans-serif" }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: { 
              stepSize: 2,
              font: { size: 11 },
              backdropColor: 'transparent'
            },
            pointLabels: {
              font: { size: 12, family: "'Noto Sans TC', 'Inter', sans-serif" }
            },
            grid: { color: 'rgba(0,0,0,0.08)' },
            angleLines: { color: 'rgba(0,0,0,0.08)' }
          }
        }
      }
    });
  }

  // ===== 4. GRAND COMPARISON TABLE =====
  function createGrandComparison() {
    const skiSection = document.getElementById('ski');
    if (!skiSection) return;
    
    const content = skiSection.querySelector('.section-collapsible-content');
    if (!content) return;
    
    const grandDiv = document.createElement('div');
    grandDiv.className = 'grand-comparison';
    grandDiv.innerHTML = `
      <h3 class="comparison-subtitle" data-zh="全球雪場總覽比較" data-en="Global Ski Resort Overview">全球雪場總覽比較</h3>
      <p class="comparison-hint" data-zh="點擊表頭排序 · 最佳值自動標綠" data-en="Click headers to sort · Best values highlighted in green">點擊表頭排序 · 最佳值自動標綠</p>
      <div class="table-scroll">
        <table class="grand-table" id="grandCompTable">
          <thead>
            <tr>
              <th data-zh="雪場" data-en="Resort">雪場</th>
              <th data-zh="地區" data-en="Region">地區</th>
              <th data-zh="雪道(km)" data-en="Pistes(km)">雪道(km)</th>
              <th data-zh="最高海拔" data-en="Max Alt.">最高海拔</th>
              <th data-zh="每日花費" data-en="Daily Cost">每日花費</th>
              <th data-zh="適合程度" data-en="Best For">適合程度</th>
              <th data-zh="雪況可靠" data-en="Snow Reliability">雪況可靠</th>
              <th data-zh="推薦指數" data-en="Rating">推薦指數</th>
            </tr>
          </thead>
          <tbody>
            <tr class="region-austria">
              <td><strong>SkiWelt</strong></td><td>🇦🇹 奧地利</td>
              <td>275</td><td>1,957m</td><td class="price-val" data-eur="62">€62</td>
              <td data-zh="初中級/家庭" data-en="Beginner-Int/Family">初中級/家庭</td>
              <td>⭐⭐⭐</td><td>⭐⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-austria">
              <td><strong>Saalbach</strong></td><td>🇦🇹 奧地利</td>
              <td>270</td><td>2,096m</td><td class="price-val" data-eur="71">€71</td>
              <td data-zh="中級/派對族" data-en="Intermediate/Party">中級/派對族</td>
              <td>⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-austria">
              <td><strong>Sölden</strong></td><td>🇦🇹 奧地利</td>
              <td>142</td><td>3,340m</td><td class="price-val" data-eur="72">€72</td>
              <td data-zh="中高級/風景" data-en="Int-Advanced/Scenic">中高級/風景</td>
              <td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐</td>
            </tr>
            <tr class="region-austria">
              <td><strong>St. Anton</strong></td><td>🇦🇹 奧地利</td>
              <td>305</td><td>2,811m</td><td class="price-val" data-eur="75">€75</td>
              <td data-zh="中高級/專業" data-en="Int-Advanced/Expert">中高級/專業</td>
              <td>⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-europe">
              <td><strong>Bansko</strong></td><td>🇧🇬 保加利亞</td>
              <td>75</td><td>2,560m</td><td class="price-val" data-eur="45">€45</td>
              <td data-zh="初中級/CP值" data-en="Beginner-Int/Value">初中級/CP值</td>
              <td>⭐⭐⭐</td><td>⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-europe">
              <td><strong>Jasná</strong></td><td>🇸🇰 斯洛伐克</td>
              <td>49</td><td>2,024m</td><td class="price-val" data-eur="55">€55</td>
              <td data-zh="中高級" data-en="Int-Advanced">中高級</td>
              <td>⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-europe">
              <td><strong>Grandvalira</strong></td><td>🇦🇩 安道爾</td>
              <td>210</td><td>2,640m</td><td class="price-val" data-eur="58">€58</td>
              <td data-zh="各級均衡" data-en="All Levels">各級均衡</td>
              <td>⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-europe">
              <td><strong>Gudauri</strong></td><td>🇬🇪 喬治亞</td>
              <td>57</td><td>3,307m</td><td class="price-val" data-eur="30">€30</td>
              <td data-zh="中級/冒險" data-en="Intermediate/Adventure">中級/冒險</td>
              <td>⭐⭐⭐</td><td>⭐⭐⭐</td>
            </tr>
            <tr class="region-na">
              <td><strong>Jay Peak</strong></td><td>🇺🇸 佛蒙特</td>
              <td>78</td><td>1,209m</td><td class="price-val" data-eur="120">€120</td>
              <td data-zh="中高級" data-en="Int-Advanced">中高級</td>
              <td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-asia">
              <td><strong>Nozawa Onsen</strong></td><td>🇯🇵 日本</td>
              <td>50</td><td>1,650m</td><td class="price-val" data-eur="100">€100</td>
              <td data-zh="各級/溫泉" data-en="All Levels/Onsen">各級/溫泉</td>
              <td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-asia">
              <td><strong>Niseko</strong></td><td>🇯🇵 日本</td>
              <td>47</td><td>1,308m</td><td class="price-val" data-eur="150">€150</td>
              <td data-zh="各級/粉雪" data-en="All Levels/Powder">各級/粉雪</td>
              <td>⭐⭐⭐⭐⭐</td><td>⭐⭐⭐⭐</td>
            </tr>
            <tr class="region-asia">
              <td><strong>Vivaldi Park</strong></td><td>🇰🇷 韓國</td>
              <td>12</td><td>340m</td><td class="price-val" data-eur="75">€75</td>
              <td data-zh="初學者/便利" data-en="Beginner/Convenient">初學者/便利</td>
              <td>⭐⭐</td><td>⭐⭐⭐</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="region-filter">
        <span data-zh="篩選地區：" data-en="Filter region:">篩選地區：</span>
        <button class="region-filter-btn active" data-filter="all" data-zh="全部" data-en="All">全部</button>
        <button class="region-filter-btn" data-filter="region-austria" data-zh="🇦🇹 奧地利" data-en="🇦🇹 Austria">🇦🇹 奧地利</button>
        <button class="region-filter-btn" data-filter="region-europe" data-zh="🇪🇺 歐洲平價" data-en="🇪🇺 Budget EU">🇪🇺 歐洲平價</button>
        <button class="region-filter-btn" data-filter="region-na" data-zh="🇺🇸 北美" data-en="🇺🇸 N. America">🇺🇸 北美</button>
        <button class="region-filter-btn" data-filter="region-asia" data-zh="🇯🇵🇰🇷 亞洲" data-en="🇯🇵🇰🇷 Asia">🇯🇵🇰🇷 亞洲</button>
      </div>
    `;
    
    // Insert at the beginning of content
    content.prepend(grandDiv);
    
    // Region filter functionality
    grandDiv.querySelectorAll('.region-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        grandDiv.querySelectorAll('.region-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        const rows = grandDiv.querySelectorAll('tbody tr');
        rows.forEach(row => {
          if (filter === 'all' || row.classList.contains(filter)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  // ===== 5. ITINERARY SIDE-BY-SIDE COMPARISON =====
  function createItinerarySideBySide() {
    const itinSection = document.getElementById('itinerary');
    if (!itinSection) return;
    
    const content = itinSection.querySelector('.section-collapsible-content');
    if (!content) return;
    
    const compDiv = document.createElement('div');
    compDiv.className = 'itinerary-comparison';
    compDiv.innerHTML = `
      <h3 class="comparison-subtitle" data-zh="行程方案快速比較" data-en="Itinerary Quick Comparison">行程方案快速比較</h3>
      <div class="itin-compare-grid">
        <div class="itin-compare-card plan-a">
          <div class="itin-card-header" style="background: linear-gradient(135deg, #2563eb, #1d4ed8);">
            <h4 data-zh="方案 A：經典三國" data-en="Plan A: Classic 3 Countries">方案 A：經典三國</h4>
            <span class="itin-days" data-zh="10天" data-en="10 days">10天</span>
          </div>
          <div class="itin-card-body">
            <div class="itin-route">
              <span class="itin-stop">慕尼黑</span>→
              <span class="itin-stop">薩爾茲堡</span>→
              <span class="itin-stop ski">SkiWelt</span>→
              <span class="itin-stop">維也納</span>→
              <span class="itin-stop">布拉格</span>
            </div>
            <table class="itin-summary-table">
              <tr><td data-zh="滑雪天數" data-en="Ski Days">滑雪天數</td><td><strong>5天</strong></td></tr>
              <tr><td data-zh="城市天數" data-en="City Days">城市天數</td><td><strong>3天</strong></td></tr>
              <tr><td data-zh="國家數" data-en="Countries">國家數</td><td><strong>3</strong> (德奧捷)</td></tr>
              <tr><td data-zh="請假天數" data-en="PTO Days">請假天數</td><td><strong>4天</strong></td></tr>
              <tr><td data-zh="預估預算" data-en="Est. Budget">預估預算</td><td class="price-val" data-eur="1800"><strong>€1,800</strong></td></tr>
              <tr><td data-zh="節奏" data-en="Pace">節奏</td><td data-zh="適中" data-en="Moderate">適中</td></tr>
            </table>
            <div class="itin-pros">
              <span class="pro-tag" data-zh="最均衡" data-en="Most Balanced">最均衡</span>
              <span class="pro-tag" data-zh="交通順" data-en="Smooth Route">交通順</span>
            </div>
          </div>
        </div>
        
        <div class="itin-compare-card plan-b">
          <div class="itin-card-header" style="background: linear-gradient(135deg, #7c3aed, #6d28d9);">
            <h4 data-zh="方案 B：深度五國" data-en="Plan B: Deep 5 Countries">方案 B：深度五國</h4>
            <span class="itin-days" data-zh="16天" data-en="16 days">16天</span>
          </div>
          <div class="itin-card-body">
            <div class="itin-route">
              <span class="itin-stop">慕尼黑</span>→
              <span class="itin-stop">薩爾茲堡</span>→
              <span class="itin-stop ski">SkiWelt</span>→
              <span class="itin-stop">維也納</span>→
              <span class="itin-stop">布達佩斯</span>→
              <span class="itin-stop">布拉格</span>
            </div>
            <table class="itin-summary-table">
              <tr><td data-zh="滑雪天數" data-en="Ski Days">滑雪天數</td><td><strong>5天</strong></td></tr>
              <tr><td data-zh="城市天數" data-en="City Days">城市天數</td><td><strong>8天</strong></td></tr>
              <tr><td data-zh="國家數" data-en="Countries">國家數</td><td><strong>5</strong> (德奧匈捷斯)</td></tr>
              <tr><td data-zh="請假天數" data-en="PTO Days">請假天數</td><td><strong>8天</strong></td></tr>
              <tr><td data-zh="預估預算" data-en="Est. Budget">預估預算</td><td class="price-val" data-eur="2600"><strong>€2,600</strong></td></tr>
              <tr><td data-zh="節奏" data-en="Pace">節奏</td><td data-zh="悠閒" data-en="Relaxed">悠閒</td></tr>
            </table>
            <div class="itin-pros">
              <span class="pro-tag" data-zh="最豐富" data-en="Most Diverse">最豐富</span>
              <span class="pro-tag" data-zh="深度遊" data-en="Deep Travel">深度遊</span>
            </div>
          </div>
        </div>
        
        <div class="itin-compare-card plan-c">
          <div class="itin-card-header" style="background: linear-gradient(135deg, #059669, #047857);">
            <h4 data-zh="方案 C：純滑雪" data-en="Plan C: Ski Focus">方案 C：純滑雪</h4>
            <span class="itin-days" data-zh="10天" data-en="10 days">10天</span>
          </div>
          <div class="itin-card-body">
            <div class="itin-route">
              <span class="itin-stop">因斯布魯克</span>→
              <span class="itin-stop ski">St. Anton</span>→
              <span class="itin-stop ski">SkiWelt</span>→
              <span class="itin-stop">薩爾茲堡</span>
            </div>
            <table class="itin-summary-table">
              <tr><td data-zh="滑雪天數" data-en="Ski Days">滑雪天數</td><td><strong>7天</strong></td></tr>
              <tr><td data-zh="城市天數" data-en="City Days">城市天數</td><td><strong>1天</strong></td></tr>
              <tr><td data-zh="國家數" data-en="Countries">國家數</td><td><strong>1</strong> (奧地利)</td></tr>
              <tr><td data-zh="請假天數" data-en="PTO Days">請假天數</td><td><strong>4天</strong></td></tr>
              <tr><td data-zh="預估預算" data-en="Est. Budget">預估預算</td><td class="price-val" data-eur="1600"><strong>€1,600</strong></td></tr>
              <tr><td data-zh="節奏" data-en="Pace">節奏</td><td data-zh="滑雪為主" data-en="Ski-focused">滑雪為主</td></tr>
            </table>
            <div class="itin-pros">
              <span class="pro-tag" data-zh="最省錢" data-en="Best Value">最省錢</span>
              <span class="pro-tag" data-zh="滑最多" data-en="Most Skiing">滑最多</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    content.prepend(compDiv);
  }

  // ===== 6. FLIGHT COMPARISON ENHANCEMENT =====
  function enhanceFlightComparison() {
    const flightSection = document.getElementById('flights');
    if (!flightSection) return;
    
    const content = flightSection.querySelector('.section-collapsible-content');
    if (!content) return;
    
    const compDiv = document.createElement('div');
    compDiv.className = 'flight-comparison-summary';
    compDiv.innerHTML = `
      <h3 class="comparison-subtitle" data-zh="機票方案快速比較" data-en="Flight Options Quick Comparison">機票方案快速比較</h3>
      <div class="table-scroll">
        <table class="flight-compare-table">
          <thead>
            <tr>
              <th data-zh="方案" data-en="Option">方案</th>
              <th data-zh="航空公司" data-en="Airline">航空公司</th>
              <th data-zh="航線" data-en="Route">航線</th>
              <th data-zh="飛行時間" data-en="Duration">飛行時間</th>
              <th data-zh="價格" data-en="Price">價格</th>
              <th data-zh="行李" data-en="Luggage">行李</th>
              <th data-zh="推薦" data-en="Rating">推薦</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-zh="精省轉機" data-en="Budget Transit">精省轉機</td>
              <td>Scoot</td>
              <td>TPE→SIN→VIE</td>
              <td>22-40h</td>
              <td class="price-val" data-eur="1050">NT$37,100</td>
              <td data-zh="需加購" data-en="Extra fee">需加購</td>
              <td>⭐⭐⭐</td>
            </tr>
            <tr>
              <td data-zh="CP值最高" data-en="Best Value">CP值最高</td>
              <td>華航+奧航</td>
              <td>TPE→BKK→VIE</td>
              <td>17-28h</td>
              <td class="price-val" data-eur="1150">NT$40,600</td>
              <td>30kg</td>
              <td>⭐⭐⭐⭐⭐</td>
            </tr>
            <tr>
              <td data-zh="直飛省時" data-en="Direct Flight">直飛省時</td>
              <td>EVA Air</td>
              <td>TPE→VIE</td>
              <td>13-14h</td>
              <td class="price-val" data-eur="1250">NT$44,100</td>
              <td>30kg</td>
              <td>⭐⭐⭐⭐</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    content.prepend(compDiv);
  }

  // ===== 7. BUDGET COMPARISON SUMMARY =====
  function createBudgetSummary() {
    const budgetSection = document.getElementById('budget');
    if (!budgetSection) return;
    
    const content = budgetSection.querySelector('.section-collapsible-content');
    if (!content) return;
    
    const compDiv = document.createElement('div');
    compDiv.className = 'budget-comparison-summary';
    compDiv.innerHTML = `
      <h3 class="comparison-subtitle" data-zh="三方案預算總覽" data-en="Budget Overview: All Plans">三方案預算總覽</h3>
      <div class="table-scroll">
        <table class="budget-compare-table">
          <thead>
            <tr>
              <th data-zh="項目" data-en="Item">項目</th>
              <th data-zh="方案A 經典三國" data-en="Plan A Classic">方案A 經典三國</th>
              <th data-zh="方案B 深度五國" data-en="Plan B Extended">方案B 深度五國</th>
              <th data-zh="方案C 純滑雪" data-en="Plan C Ski Focus">方案C 純滑雪</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-zh="✈️ 機票" data-en="✈️ Flights">✈️ 機票</td>
              <td class="price-val" data-eur="1150">€1,150</td>
              <td class="price-val" data-eur="1150">€1,150</td>
              <td class="price-val" data-eur="1150">€1,150</td>
            </tr>
            <tr>
              <td data-zh="🎿 纜車票" data-en="🎿 Lift Pass">🎿 纜車票</td>
              <td class="price-val" data-eur="310">€310</td>
              <td class="price-val" data-eur="310">€310</td>
              <td class="price-val" data-eur="500">€500</td>
            </tr>
            <tr>
              <td data-zh="🏨 住宿" data-en="🏨 Accommodation">🏨 住宿</td>
              <td class="price-val" data-eur="450">€450</td>
              <td class="price-val" data-eur="720">€720</td>
              <td class="price-val" data-eur="400">€400</td>
            </tr>
            <tr>
              <td data-zh="🍽️ 餐飲" data-en="🍽️ Food">🍽️ 餐飲</td>
              <td class="price-val" data-eur="300">€300</td>
              <td class="price-val" data-eur="480">€480</td>
              <td class="price-val" data-eur="280">€280</td>
            </tr>
            <tr>
              <td data-zh="🚆 交通" data-en="🚆 Transport">🚆 交通</td>
              <td class="price-val" data-eur="150">€150</td>
              <td class="price-val" data-eur="250">€250</td>
              <td class="price-val" data-eur="80">€80</td>
            </tr>
            <tr>
              <td data-zh="🎿 租裝備" data-en="🎿 Gear Rental">🎿 租裝備</td>
              <td class="price-val" data-eur="150">€150</td>
              <td class="price-val" data-eur="150">€150</td>
              <td class="price-val" data-eur="210">€210</td>
            </tr>
            <tr class="total-row">
              <td data-zh="💰 總計" data-en="💰 Total"><strong>💰 總計</strong></td>
              <td class="price-val" data-eur="2510"><strong>€2,510</strong></td>
              <td class="price-val" data-eur="3060"><strong>€3,060</strong></td>
              <td class="price-val" data-eur="2620"><strong>€2,620</strong></td>
            </tr>
            <tr class="per-day-row">
              <td data-zh="📊 每日均價" data-en="📊 Per Day"><em>📊 每日均價</em></td>
              <td class="price-val" data-eur="251"><em>€251/天</em></td>
              <td class="price-val" data-eur="191"><em>€191/天</em></td>
              <td class="price-val" data-eur="262"><em>€262/天</em></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    content.prepend(compDiv);
  }

  // ===== INITIALIZE ALL COMPARISON ENHANCEMENTS =====
  // Load Chart.js first, then create radar chart
  const chartScript = document.createElement('script');
  chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
  chartScript.onload = () => {
    createRadarChart();
    createGrandComparison();
    createItinerarySideBySide();
    enhanceFlightComparison();
    createBudgetSummary();
    
    // Re-apply best value highlighting to new tables
    highlightBestValues();
    
    // Re-apply sortable to new tables
    document.querySelectorAll('.grand-table th, .flight-compare-table th, .budget-compare-table th').forEach((th, colIdx) => {
      if (th.querySelector('.sort-indicator')) return; // already has sort
      th.style.cursor = 'pointer';
      th.style.userSelect = 'none';
      const indicator = document.createElement('span');
      indicator.className = 'sort-indicator';
      indicator.textContent = ' ⇅';
      indicator.style.opacity = '0.4';
      indicator.style.fontSize = '0.8em';
      th.appendChild(indicator);
      
      let ascending = true;
      th.addEventListener('click', () => {
        const table = th.closest('table');
        const headers = table.querySelectorAll('th');
        const idx = Array.from(headers).indexOf(th);
        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => !r.querySelector('th') && !r.classList.contains('total-row') && !r.classList.contains('per-day-row'));
        
        rows.sort((a, b) => {
          const cellA = a.cells[idx]?.textContent.trim() || '';
          const cellB = b.cells[idx]?.textContent.trim() || '';
          const numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
          const numB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));
          if (!isNaN(numA) && !isNaN(numB)) {
            return ascending ? numA - numB : numB - numA;
          }
          return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });
        
        // Re-append total/per-day rows at end
        const specialRows = Array.from(tbody.querySelectorAll('.total-row, .per-day-row'));
        rows.forEach(row => tbody.appendChild(row));
        specialRows.forEach(row => tbody.appendChild(row));
        
        ascending = !ascending;
        headers.forEach(h => {
          const ind = h.querySelector('.sort-indicator');
          if (ind) { ind.textContent = ' ⇅'; ind.style.opacity = '0.4'; }
        });
        indicator.textContent = ascending ? ' ↑' : ' ↓';
        indicator.style.opacity = '1';
      });
    });
    
    // Re-apply language if currently in EN
    if (typeof currentLang !== 'undefined' && currentLang === 'en') {
      switchLanguage('en');
    }
    // Re-apply currency
    if (typeof updateAllPrices === 'function') {
      updateAllPrices();
    }
  };
  document.head.appendChild(chartScript);
});
