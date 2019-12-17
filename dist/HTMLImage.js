"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class HTMLImage extends _react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: props.imagesInitialDimensions.width,
      height: props.imagesInitialDimensions.height
    };
  }

  componentDidMount() {
    this.getImageSize();
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    this.getImageSize(nextProps);
  }

  getDimensionsFromStyle(style, height, width) {
    let styleWidth;
    let styleHeight;

    if (height) {
      styleHeight = height;
    }

    if (width) {
      styleWidth = width;
    }

    if (Array.isArray(style)) {
      style.forEach(styles => {
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
      styleWidth,
      styleHeight
    };
  }

  getImageSize(props = this.props) {
    const {
      source,
      imagesMaxWidth,
      style,
      height,
      width
    } = props;
    const {
      styleWidth,
      styleHeight
    } = this.getDimensionsFromStyle(style, height, width);

    if (styleWidth && styleHeight) {
      return this.mounted && this.setState({
        width: typeof styleWidth === 'string' && styleWidth.search('%') !== -1 ? styleWidth : parseInt(styleWidth, 10),
        height: typeof styleHeight === 'string' && styleHeight.search('%') !== -1 ? styleHeight : parseInt(styleHeight, 10)
      });
    } // Fetch image dimensions only if they aren't supplied or if with or height is missing


    _reactNative.Image.getSize(source.uri, (originalWidth, originalHeight) => {
      if (!imagesMaxWidth) {
        return this.mounted && this.setState({
          width: originalWidth,
          height: originalHeight
        });
      }

      const optimalWidth = imagesMaxWidth <= originalWidth ? imagesMaxWidth : originalWidth;
      const optimalHeight = optimalWidth * originalHeight / originalWidth;
      this.mounted && this.setState({
        width: optimalWidth,
        height: optimalHeight,
        error: false
      });
    }, () => {
      this.mounted && this.setState({
        error: true
      });
    });
  }

  validImage(source, style, props = {}) {
    return _react.default.createElement(_reactNative.Image, _extends({
      source: source,
      style: [style, {
        width: this.state.width,
        height: this.state.height,
        resizeMode: 'cover'
      }]
    }, props));
  }

  get errorImage() {
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

  render() {
    const {
      source,
      style,
      passProps
    } = this.props;
    return !this.state.error ? this.validImage(source, style, passProps) : this.errorImage;
  }

}

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