// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Function to save mock test results to localStorage
function saveMockTestResult(mockTest, score, date) {
  const mockTests = JSON.parse(localStorage.getItem('mockTests')) || [];

  mockTests.push({ mockTest, score, date });

  localStorage.setItem('mockTests', JSON.stringify(mockTests));
}

// Function to load mock test results from localStorage
function loadMockTestResults() {
  const mockTests = JSON.parse(localStorage.getItem('mockTests')) || [];

  for (const test of mockTests) {
    const listItem = document.createElement('li');
    listItem.textContent = `${test.mockTest} - Score: ${test.score} - Date: ${test.date}`;
    document.getElementById('mock-test-list').appendChild(listItem);
  }

  const average = calculateAverage(mockTests);
  document.getElementById('average-score').textContent = `Average Score: ${average}`;

  const lineGraphData = prepareLineGraphData(mockTests);
  displayLineGraph(lineGraphData);
}

// Countdown function
function countdown(targetDate, elementId) {
  const countdownElement = document.getElementById(elementId);

  const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = 'Completed!';
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  }, 1000);
}

// Set the target date for the countdown
const targetDate = new Date('2023-11-17T23:59:59');

// Call the countdown function for the single countdown
countdown(targetDate, 'countdown');

const mockTestForm = document.getElementById('mock-test-form-input');
const mockTestInput = document.getElementById('mock-test-input');
const scoreInput = document.getElementById('score-input');
const dateInput = document.getElementById('date-input');

mockTestForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const mockTest = mockTestInput.value;
  const score = scoreInput.value;
  const date = dateInput.value;

  if (mockTest.trim() !== '' && score.trim() !== '' && date.trim() !== '') {
    saveMockTestResult(mockTest, score, date); // Save the mock test result to localStorage

    const listItem = document.createElement('li');
    listItem.textContent = `${mockTest} - Score: ${score} - Date: ${date}`;
    document.getElementById('mock-test-list').appendChild(listItem);

    mockTestInput.value = '';
    scoreInput.value = '';
    dateInput.value = '';

    const mockTests = JSON.parse(localStorage.getItem('mockTests')) || [];
    const average = calculateAverage(mockTests);
    document.getElementById('average-score').textContent = `Average Score: ${average}`;

    const lineGraphData = prepareLineGraphData(mockTests);
    displayLineGraph(lineGraphData);
  }
});

loadMockTestResults(); // Load stored mock test results on page load

const clearStorageButton = document.getElementById('clear-storage-button');

clearStorageButton.addEventListener('click', function () {
  localStorage.clear();
  alert('LocalStorage cleared!');
});

// Function to calculate the average of mock test results
function calculateAverage(mockTests) {
  let totalScore = 0;

  for (const test of mockTests) {
    totalScore += parseFloat(test.score);
  }

  return (totalScore / mockTests.length).toFixed(2); // Return average with 2 decimal places
}

// Function to prepare data for line graph
function prepareLineGraphData(mockTests) {
  const mockTestNames = mockTests.map(test => test.mockTest);
  const scores = mockTests.map(test => test.score);

  return {
    labels: mockTestNames,
    datasets: [{
      label: 'Mock Test Performance',
      data: scores,
      borderColor: 'white',
      fill: false,
      font: {
        family: 'cursive',
        weight: 'bold'
      }
    }]
  };
}

// Function to display the line graph
// Function to display the line graph
function displayLineGraph(data) {
  const lineChartElement = document.getElementById('line-chart');
  new Chart(lineChartElement, {
    type: 'line',
    data: data,
    options: {
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Test',
            font: {
              family: 'cursive',
              weight: 'bold'
            }
          },
          ticks: {
            font: {
              family: 'cursive',
              weight: 'bold'
            }
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Score',
            font: {
              family: 'cursive',
              weight: 'bold'
            }
          },
          ticks: {
            font: {
              family: 'cursive',
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'cursive',
              weight: 'bold'
            }
          }
        }
      }
    }
  });
}