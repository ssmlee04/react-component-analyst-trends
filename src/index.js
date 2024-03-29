import React from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './../index.css';

const attributes = [{
  backgroundColor: '#1D8348',
  borderColor: '#1D8348',
  attr: 'strongBuy',
  label: 'Strong Buy'
}, {
  backgroundColor: '#2ECC71',
  borderColor: '#2ECC71',
  attr: 'buy',
  label: 'Buy'
}, {
  backgroundColor: '#5DADE2',
  borderColor: '#5DADE2',
  attr: 'hold',
  label: 'Hold'
}, {
  backgroundColor: 'orange',
  borderColor: 'orange',
  attr: 'sell',
  label: 'Sell'
}, {
  backgroundColor: '#CD5C5C',
  borderColor: '#CD5C5C',
  attr: 'strongSell',
  label: 'Strong Sell'
}];

const genDataSetAndAttributes = (attribute, data) => {
  return {
    fill: false,
    lineTension: 0,
    borderWidth: 2,
    pointRadius: 2,
    pointHoverRadius: 5,
    data: data.map(d => _.get(d, attribute.attr)),
    all: data,
    ...attribute
  };
};

export class AnalystTrends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { profile, prop = 'analysts_yh', imgProp = 'analysts_trends_yh_img', theme = 'light' } = this.props;
    const { copied } = this.state;
    if (!profile) {
      return (
        <div style={{ fontSize: 12 }}>Not available at this time... </div>
      );
    }
    if (profile[imgProp] && profile[imgProp].url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-12' : 'react-components-show-url btn btn-sm btn-warning font-12';
      const btnText = copied ? 'Copied' : 'Copy Img';
      return (
        <div className='react-components-show-button'>
          <img alt={`${profile.ticker} - ${profile.name} analyst opinions`} src={profile[imgProp].url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile[imgProp].url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }
    const info = profile[prop] || {};
    const gridColor = theme === 'light' ? 'rgba(80, 80, 80, 0.1)' : 'rgba(255, 255, 255, 0.2)';
    let recommendations = _.sortBy(info.arr || [], d => d.period);
    const data = {
      labels: recommendations.map(d => d.period),
      datasets: attributes.map(attr => genDataSetAndAttributes(attr, recommendations))
    };

    const fontColor = theme === 'light' ? '#444444' : '#dddddd';
    const options = {
      legend: {
        labels: {
          fontSize: 12,
          fontColor,
          boxWidth: 3,
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12,
            fontColor
          },
          gridLines: {
            color: gridColor
          },
          stacked: true,
          barPercentage: 0.4
        }],
        yAxes: [{
          ticks: {
            fontSize: 12,
            fontColor
          },
          gridLines: {
            color: gridColor
          },
          stacked: true
        }]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            const info = data.datasets[tooltipItem.datasetIndex];
            const reportDate = info.all[tooltipItem.datasetIndex].reportDate;
              var label = `${reportDate} ${info.label}: `;
              label += tooltipItem.yLabel || 'n/a';
              label += '%';
              return label;
          }
        }
      }
    };

    return (
      <div>
        <div style={{ width: '100%', padding: 5, fontSize: 12 }}>
          <div className={`theme-darkred-${theme}`} style={{ fontWeight: 'bold' }}>{profile.ticker} - {profile.name} <span className={`theme-green-${theme}`}>Analyst Consensus</span></div>
          {info.targetHighPrice ? <div>Target high:&nbsp;<b className={`theme-green-${theme}`}>{info.targetHighPrice}&nbsp;</b>{info.currency}</div> : null}
          {info.targetLowPrice ? <div>Target low:&nbsp;<b className={`theme-green-${theme}`}>{info.targetLowPrice}&nbsp;</b>{info.currency}</div> : null}
          {info.targetMeanPrice && info.numberOfAnalystOpinions
            ? <div>
              Average:&nbsp;<b className={`theme-green-${theme}`}>{info.targetMeanPrice}</b>&nbsp;{info.currency}
                  &nbsp;based on <b className={`theme-green-${theme}`}>{info.numberOfAnalystOpinions}</b> analysts as of {info.last_crawled.slice(0, 10)}
            </div>
            : null}
        </div>
        <div style={{ width: '100%' }}>
          <Bar data={data} height={180} options={options} />
        </div>
        <div style={{ fontSize: 12, padding: 5, paddingTop: 2 }}>Crafted by <a href='https://twitter.com/tradeideashq' target='_blank' className={`theme-darkred-${theme}`}>@tradeideashq</a> with <span style={{ fontSize: 16, color: 'red' }}>💡</span></div>
      </div>
    );
  }
}

export default AnalystTrends;
