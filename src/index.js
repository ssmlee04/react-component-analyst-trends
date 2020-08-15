import React from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Bar } from 'react-chartjs-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './../index.css';

const options = {
  legend: {
    labels: {
      fontSize: 14,
      boxWidth: 3,
    }
  },
  scales: {
    xAxes: [{
      ticks: {
        fontSize: 12
      }
    }],
    yAxes: [{
      ticks: {
        fontSize: 12
      }
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

const attributes = [{
  backgroundColor: 'darkgreen',
  borderColor: 'darkgreen',
  attr: 'ratingBuy',
  label: 'Buy'
}, {
  backgroundColor: 'limegreen',
  borderColor: 'limegreen',
  attr: 'ratingOverweight',
  label: 'Overweight'
}, {
  backgroundColor: 'lightseagreen',
  borderColor: 'lightseagreen',
  attr: 'ratingHold',
  label: 'Hold'
}, {
  backgroundColor: 'orange',
  borderColor: 'orange',
  attr: 'ratingUnderweight',
  label: 'Underweight'
}, {
  backgroundColor: 'red',
  borderColor: 'red',
  attr: 'ratingSell',
  label: 'Sell'
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

  shouldComponentUpdate(nextProps, nextState) {
    const { profile } = this.props;
    if (!profile) return true;
    if (nextState.copied) return true;
    if (profile.ticker !== nextProps.profile.ticker) return true;
    return false;
  }

  render() {
    const { profile } = this.props;
    // eslint-disable-next-line
    const initialData = _.sortBy(_.uniqBy((profile && profile.recommendation && profile.recommendation.data || []), d => dayjs(d.consensusEndDate).format('YYYYMM')).filter(d => d.consensusEndDate), d => d.consensusEndDate).slice(-12);
    const { copied } = this.state;
    if (!profile) {
      return (
        <div style={{ fontSize: 14 }}>Not available at this time... </div>
      );
    }
    if (profile.recommendation_trend_img && profile.recommendation_trend_img.url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-10' : 'react-components-show-url btn btn-sm btn-warning font-10';
      const btnText = copied ? 'Copied' : 'Copy Img';
      return (
        <div className='react-components-show-button'>
          <img alt={`${profile.ticker} - ${profile.name} analyst opinions`} src={profile.recommendation_trend_img.url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile.recommendation_trend_img.url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }
    const data = {
      labels: initialData.map(d => dayjs(d.consensusEndDate).format('YYYYMM')),
      datasets: attributes.map(attr => genDataSetAndAttributes(attr, initialData))
    };

    return (
      <div>
        <div style={{ width: '100%', padding: 5, fontSize: 14 }}>
          <div style={{ color: 'darkred', fontWeight: 'bold' }}>{profile.ticker} - {profile.name} <span className='green'>Analyst Ratings</span></div>
        </div>
        <div style={{ width: '100%' }}>
          <Bar data={data} height={180} options={options} />
        </div>
      </div>
    );
  }
}

export default AnalystTrends;
