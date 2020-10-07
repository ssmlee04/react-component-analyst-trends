"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AnalystTrends = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _dayjs = _interopRequireDefault(require("dayjs"));

var _reactChartjs = require("react-chartjs-2");

var _reactCopyToClipboard = require("react-copy-to-clipboard");

require("./../index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var options = {
  legend: {
    labels: {
      fontSize: 14,
      boxWidth: 3
    }
  },
  scales: {
    xAxes: [{
      ticks: {
        fontSize: 12
      },
      stacked: true,
      barPercentage: 0.4
    }],
    yAxes: [{
      ticks: {
        fontSize: 12
      },
      stacked: true
    }]
  },
  tooltips: {
    callbacks: {
      label: function label(tooltipItem, data) {
        var info = data.datasets[tooltipItem.datasetIndex];
        var reportDate = info.all[tooltipItem.datasetIndex].reportDate;
        var label = "".concat(reportDate, " ").concat(info.label, ": ");
        label += tooltipItem.yLabel || 'n/a';
        label += '%';
        return label;
      }
    }
  }
};
var attributes = [{
  backgroundColor: '#1D8348',
  borderColor: '#1D8348',
  attr: 'ratingBuy',
  label: 'Buy'
}, {
  backgroundColor: '#2ECC71',
  borderColor: '#2ECC71',
  attr: 'ratingOverweight',
  label: 'Overweight'
}, {
  backgroundColor: '#5DADE2',
  borderColor: '#5DADE2',
  attr: 'ratingHold',
  label: 'Hold'
}, {
  backgroundColor: 'orange',
  borderColor: 'orange',
  attr: 'ratingUnderweight',
  label: 'Underweight'
}, {
  backgroundColor: '#CD5C5C',
  borderColor: '#CD5C5C',
  attr: 'ratingSell',
  label: 'Sell'
}];

var date = function date(d) {
  return d.consensusStartDate || d.consensusEndDate;
};

var genDataSetAndAttributes = function genDataSetAndAttributes(attribute, data) {
  return _objectSpread({
    fill: false,
    lineTension: 0,
    borderWidth: 2,
    pointRadius: 2,
    pointHoverRadius: 5,
    data: data.map(function (d) {
      return _lodash["default"].get(d, attribute.attr);
    }),
    all: data
  }, attribute);
};

var AnalystTrends =
/*#__PURE__*/
function (_React$Component) {
  _inherits(AnalystTrends, _React$Component);

  function AnalystTrends(props) {
    var _this;

    _classCallCheck(this, AnalystTrends);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AnalystTrends).call(this, props));
    _this.state = {};
    return _this;
  }

  _createClass(AnalystTrends, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var profile = this.props.profile;
      if (!profile) return true;
      if (nextState.copied) return true;
      if (profile.ticker !== nextProps.profile.ticker) return true;
      return false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var profile = this.props.profile; // eslint-disable-next-line

      var initialData = _lodash["default"].sortBy(_lodash["default"].uniqBy(profile && profile.recommendation && profile.recommendation.data || [], function (d) {
        return (0, _dayjs["default"])(date(d)).format('YYYYMM');
      }).filter(function (d) {
        return date(d);
      }), function (d) {
        return date(d);
      }).slice(-12);

      var copied = this.state.copied;

      if (!profile) {
        return _react["default"].createElement("div", {
          style: {
            fontSize: 14
          }
        }, "Not available at this time... ");
      }

      if (profile.recommendation_trend_img && profile.recommendation_trend_img.url) {
        var btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-10' : 'react-components-show-url btn btn-sm btn-warning font-10';
        var btnText = copied ? 'Copied' : 'Copy Img';
        return _react["default"].createElement("div", {
          className: "react-components-show-button"
        }, _react["default"].createElement("img", {
          alt: "".concat(profile.ticker, " - ").concat(profile.name, " analyst ratings trends"),
          src: profile.recommendation_trend_img.url,
          style: {
            width: '100%'
          }
        }), _react["default"].createElement(_reactCopyToClipboard.CopyToClipboard, {
          text: profile.recommendation_trend_img.url || '',
          onCopy: function onCopy() {
            return _this2.setState({
              copied: true
            });
          }
        }, _react["default"].createElement("button", {
          className: btnClass,
          value: btnText
        }, btnText)));
      }

      var data = {
        labels: initialData.map(function (d) {
          return (0, _dayjs["default"])(date(d)).format('YYYYMM');
        }),
        datasets: attributes.map(function (attr) {
          return genDataSetAndAttributes(attr, initialData);
        })
      };
      return _react["default"].createElement("div", null, _react["default"].createElement("div", {
        style: {
          width: '100%',
          padding: 5,
          fontSize: 14
        }
      }, _react["default"].createElement("div", {
        style: {
          color: 'darkred',
          fontWeight: 'bold'
        }
      }, profile.ticker, " - ", profile.name, " ", _react["default"].createElement("span", {
        className: "green"
      }, "Analyst Ratings"))), _react["default"].createElement("div", {
        style: {
          width: '100%'
        }
      }, _react["default"].createElement(_reactChartjs.Bar, {
        data: data,
        height: 180,
        options: options
      })), _react["default"].createElement("div", {
        style: {
          fontSize: 12,
          color: 'gray',
          padding: 5
        }
      }, "Generated by ", _react["default"].createElement("span", {
        style: {
          color: 'darkred'
        }
      }, "@earningsfly"), " with ", _react["default"].createElement("span", {
        style: {
          fontSize: 16,
          color: 'red'
        }
      }, "\u2764\uFE0F")));
    }
  }]);

  return AnalystTrends;
}(_react["default"].Component);

exports.AnalystTrends = AnalystTrends;
var _default = AnalystTrends;
exports["default"] = _default;