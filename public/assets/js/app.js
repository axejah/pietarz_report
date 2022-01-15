const collectionId = window.location.pathname.slice(8);

async function getData() {
  const response = await fetch(
    `http://localhost:5005/api/csv/getReportData/${collectionId}`
  );
  const data = await response.json();

  return data;
}

const tableBody = document.getElementsByTagName('tbody')[0];

let topMostVolumeData = [];
let topMostVolumeLabel = [];
let leastVolumeData = [];
let leastVolumeLabel = [];
let topMostDifficultData = [];
let topMostDifficultLabel = [];

getData()
  .then((data) => {
    for (let i = 0; i < data.unsortedData.keywordLabel.length; i++) {
      let color =
        data.unsortedData.rankChange[i] < 0
          ? 'style="color: red;"'
          : 'style="color: green;"';

      tableBody.innerHTML += `
    <th>${data.unsortedData.keywordLabel[i]}</th>
    <td>${data.unsortedData.rankValue[i]}</td>
    <td ${color}>${data.unsortedData.rankChange[i]}</td>
    <td>${data.unsortedData.rankDifficulty[i]}</td>
    <td>${data.unsortedData.rankVolume[i]}</td>
    <td>${data.unsortedData.rankUrl[i]}</td>
    `;
    }
    return data;
  })
  .then((data) => {
    topMostVolumeData.push(data.sortedData.byVolume.volumeData.slice(0, 10));
    topMostVolumeLabel.push(data.sortedData.byVolume.volumeLabel.slice(0, 10));
    leastVolumeData.push(
      data.sortedData.byVolume.volumeData.slice(
        data.sortedData.byVolume.volumeData.length - 10,
        data.sortedData.byVolume.volumeData.length
      )
    );
    leastVolumeLabel.push(
      data.sortedData.byVolume.volumeLabel.slice(
        data.sortedData.byVolume.volumeLabel.length - 10,
        data.sortedData.byVolume.volumeLabel.length
      )
    );
    topMostDifficultData.push(
      data.sortedData.byDifficulty.difficultyData.slice(0, 10)
    );
    topMostDifficultLabel.push(
      data.sortedData.byDifficulty.difficultyLabel.slice(0, 10)
    );
  })
  .then((next) => {
    const labels = topMostVolumeLabel;
    const data = {
      labels: labels[0],
      datasets: [
        {
          label: 'Top 10 Most Search Volume',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: topMostVolumeData[0],
        },
      ],
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    const topVolumeChart = new Chart(
      document.getElementById('topVolumeChart'),
      config
    );
  })
  .then((next) => {
    const labels = topMostDifficultLabel;
    const data = {
      labels: labels[0],
      datasets: [
        {
          label: 'Top 10 Lowest Search Difficulty',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: topMostDifficultData[0],
        },
      ],
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    const difficultyChart = new Chart(
      document.getElementById('difficultyChart'),
      config
    );
  })
  .catch((err) => console.log(err));
