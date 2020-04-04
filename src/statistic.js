import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default class Statistic {
  constructor(data) {
    this._target = data.target;
    this._title = data.title;
    this._data = data.data;

    this._element = null;
  }

  render() {
    this._element = new Chart(this._target, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: this._data,
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: this._title,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    })

    return this._element;
  }

  unrender() {
    this._element = null;
  }

  update(newData) {
    this._data = newData;
  }
}
