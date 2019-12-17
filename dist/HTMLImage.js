"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var HTMLImage =
/*#__PURE__*/
function (_PureComponent) {
  _inheritsLoose(HTMLImage, _PureComponent);

  function HTMLImage(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.state = {
      width: props.imagesInitialDimensions.width,
      height: props.imagesInitialDimensions.height
    };
    return _this;
  }

  var _proto = HTMLImage.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.getImageSize();
    this.mounted = true;
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.getImageSize(nextProps);
  };

  _proto.getDimensionsFromStyle = function getDimensionsFromStyle(style, height, width) {
    var styleWidth;
    var styleHeight;

    if (height) {
      styleHeight = height;
    }

    if (width) {
      styleWidth = width;
    }

    if (Array.isArray(style)) {
      style.forEach(function (styles) {
        if (!width && styles['width']) {
          styleWidth = styles['width'];
        }

        if (!height && styles['height']) {
          styleHeight = styles['height'];
        }
      });
    } else {
      if (!width && style['width']) {
        styleWidth = style['width'];
      }

      if (!height && style['height']) {
        styleHeight = style['height'];
      }
    }

    return {
      styleWidth: styleWidth,
      styleHeight: styleHeight
    };
  };

  _proto.getImageSize = function getImageSize(props) {
    var _this2 = this;

    if (props === void 0) {
      props = this.props;
    }

    var _props = props,
        source = _props.source,
        imagesMaxWidth = _props.imagesMaxWidth,
        style = _props.style,
        height = _props.height,
        width = _props.width;

    var _this$getDimensionsFr = this.getDimensionsFromStyle(style, height, width),
        styleWidth = _this$getDimensionsFr.styleWidth,
        styleHeight = _this$getDimensionsFr.styleHeight;

    if (styleWidth && styleHeight) {
      return this.mounted && this.setState({
        width: typeof styleWidth === 'string' && styleWidth.search('%') !== -1 ? styleWidth : parseInt(styleWidth, 10),
        height: typeof styleHeight === 'string' && styleHeight.search('%') !== -1 ? styleHeight : parseInt(styleHeight, 10)
      });
    } // Fetch image dimensions only if they aren't supplied or if with or height is missing


    _reactNative.Image.getSize(source.uri, function (originalWidth, originalHeight) {
      if (!imagesMaxWidth) {
        return _this2.mounted && _this2.setState({
          width: originalWidth,
          height: originalHeight
        });
      }

      var optimalWidth = imagesMaxWidth <= originalWidth ? imagesMaxWidth : originalWidth;
      var optimalHeight = optimalWidth * originalHeight / originalWidth;
      _this2.mounted && _this2.setState({
        width: optimalWidth,
        height: optimalHeight,
        error: false
      });
    }, function () {
      _this2.mounted && _this2.setState({
        error: true
      });
    });
  };

  _proto.validImage = function validImage(source, style, props) {
    if (props === void 0) {
      props = {};
    }

    return _react.default.createElement(_reactNative.Image, _extends({
      source: source,
      style: [style, {
        width: this.state.width,
        height: this.state.height,
        resizeMode: 'cover'
      }]
    }, props));
  };

  _proto.render = function render() {
    var _this$props = this.props,
        source = _this$props.source,
        style = _this$props.style,
        passProps = _this$props.passProps;
    return !this.state.error ? this.validImage(source, style, passProps) : this.errorImage;
  };

  _createClass(HTMLImage, [{
    key: "errorImage",
    get: function get() {
      return _react.default.createElement(_reactNative.View, {
        style: {
          width: 50,
          height: 50,
          borderWidth: 1,
          borderColor: 'lightgray',
          overflow: 'hidden',
          justifyContent: 'center'
        }
      }, this.props.alt ? _react.default.createElement(_reactNative.Text, {
        style: {
          textAlign: 'center',
          fontStyle: 'italic'
        }
      }, this.props.alt) : false);
    }
  }]);

  return HTMLImage;
}(_react.PureComponent);

exports.default = HTMLImage;
HTMLImage.defaultProps = {
  imagesInitialDimensions: {
    width: 100,
    height: 100
  }
};
HTMLImage.propTypes = process.env.NODE_ENV !== "production" ? {
  source: _propTypes.default.object.isRequired,
  alt: _propTypes.default.string,
  height: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  width: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  style: _reactNative.Image.propTypes.style,
  imagesMaxWidth: _propTypes.default.number,
  imagesInitialDimensions: _propTypes.default.shape({
    width: _propTypes.default.number,
    height: _propTypes.default.number
  })
} : {};
module.exports = exports["default"];