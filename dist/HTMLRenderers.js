"use strict";

exports.__esModule = true;
exports.a = a;
exports.img = img;
exports.ul = ul;
exports.iframe = iframe;
exports.pre = pre;
exports.br = br;
exports.textwrapper = textwrapper;
exports.ol = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeWebview = require("react-native-webview");

var _HTMLStyles = require("./HTMLStyles");

var _HTMLImage = _interopRequireDefault(require("./HTMLImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function a(htmlAttribs, children, convertedCSSStyles, passProps) {
  var style = (0, _HTMLStyles._constructStyles)({
    tagName: 'a',
    htmlAttribs: htmlAttribs,
    passProps: passProps,
    styleSet: passProps.parentWrapper === 'Text' ? 'TEXT' : 'VIEW'
  }); // !! This deconstruction needs to happen after the styles construction since
  // the passed props might be altered by it !!

  var parentWrapper = passProps.parentWrapper,
      onLinkPress = passProps.onLinkPress,
      key = passProps.key,
      data = passProps.data;

  var onPress = function onPress(evt) {
    return onLinkPress && htmlAttribs && htmlAttribs.href ? onLinkPress(evt, htmlAttribs.href, htmlAttribs) : undefined;
  };

  if (parentWrapper === 'Text') {
    return _react.default.createElement(_reactNative.Text, _extends({}, passProps, {
      style: style,
      onPress: onPress,
      key: key
    }), children || data);
  } else {
    return _react.default.createElement(_reactNative.TouchableOpacity, {
      onPress: onPress,
      key: key
    }, children || data);
  }
}

function img(htmlAttribs, children, convertedCSSStyles, passProps) {
  if (passProps === void 0) {
    passProps = {};
  }

  if (!htmlAttribs.src) {
    return false;
  }

  var style = (0, _HTMLStyles._constructStyles)({
    tagName: 'img',
    htmlAttribs: htmlAttribs,
    passProps: passProps,
    styleSet: 'IMAGE'
  });
  var src = htmlAttribs.src,
      alt = htmlAttribs.alt,
      width = htmlAttribs.width,
      height = htmlAttribs.height;
  return _react.default.createElement(_HTMLImage.default, _extends({
    source: {
      uri: src
    },
    alt: alt,
    width: width,
    height: height,
    style: style
  }, passProps));
}

function ul(htmlAttribs, children, convertedCSSStyles, passProps) {
  if (passProps === void 0) {
    passProps = {};
  }

  var style = (0, _HTMLStyles._constructStyles)({
    tagName: 'ul',
    htmlAttribs: htmlAttribs,
    passProps: passProps,
    styleSet: 'VIEW'
  });
  var _passProps = passProps,
      allowFontScaling = _passProps.allowFontScaling,
      rawChildren = _passProps.rawChildren,
      nodeIndex = _passProps.nodeIndex,
      key = _passProps.key,
      baseFontStyle = _passProps.baseFontStyle,
      listsPrefixesRenderers = _passProps.listsPrefixesRenderers;
  var baseFontSize = baseFontStyle.fontSize || 14;
  children = children && children.map(function (child, index) {
    var rawChild = rawChildren[index];
    var prefix = false;
    var rendererArgs = [htmlAttribs, children, convertedCSSStyles, _objectSpread({}, passProps, {
      index: index
    })];

    if (rawChild) {
      if (rawChild.parentTag === 'ul' && rawChild.tagName === 'li') {
        prefix = listsPrefixesRenderers && listsPrefixesRenderers.ul ? listsPrefixesRenderers.ul.apply(listsPrefixesRenderers, rendererArgs) : _react.default.createElement(_reactNative.View, {
          style: {
            marginRight: 10,
            width: baseFontSize / 2.8,
            height: baseFontSize / 2.8,
            marginTop: baseFontSize / 2,
            borderRadius: baseFontSize / 2.8,
            backgroundColor: 'black'
          }
        });
      } else if (rawChild.parentTag === 'ol' && rawChild.tagName === 'li') {
        prefix = listsPrefixesRenderers && listsPrefixesRenderers.ol ? listsPrefixesRenderers.ol.apply(listsPrefixesRenderers, rendererArgs) : _react.default.createElement(_reactNative.Text, {
          allowFontScaling: allowFontScaling,
          style: {
            marginRight: 5,
            fontSize: baseFontSize
          }
        }, index + 1, ")");
      }
    }

    return _react.default.createElement(_reactNative.View, {
      key: "list-" + nodeIndex + "-" + index + "-" + key,
      style: {
        flexDirection: 'row',
        marginBottom: 10
      }
    }, prefix, _react.default.createElement(_reactNative.View, {
      style: {
        flex: 1
      }
    }, child));
  });
  return _react.default.createElement(_reactNative.View, {
    style: style,
    key: key
  }, children);
}

var ol = ul;
exports.ol = ol;

function iframe(htmlAttribs, children, convertedCSSStyles, passProps) {
  var staticContentMaxWidth = passProps.staticContentMaxWidth,
      tagsStyles = passProps.tagsStyles,
      classesStyles = passProps.classesStyles;
  var tagStyleHeight = tagsStyles.iframe && tagsStyles.iframe.height;
  var tagStyleWidth = tagsStyles.iframe && tagsStyles.iframe.width;
  var classStyles = (0, _HTMLStyles._getElementClassStyles)(htmlAttribs, classesStyles);
  var classStyleWidth = classStyles.width;
  var classStyleHeight = classStyles.height;
  var attrHeight = htmlAttribs.height ? parseInt(htmlAttribs.height) : false;
  var attrWidth = htmlAttribs.width ? parseInt(htmlAttribs.width) : false;
  var height = attrHeight || classStyleHeight || tagStyleHeight || 200;
  var width = attrWidth || classStyleWidth || tagStyleWidth || staticContentMaxWidth;
  var style = (0, _HTMLStyles._constructStyles)({
    tagName: 'iframe',
    htmlAttribs: htmlAttribs,
    passProps: passProps,
    styleSet: 'VIEW',
    additionalStyles: [{
      height: height,
      width: width
    }]
  });
  var source = htmlAttribs.srcdoc ? {
    html: htmlAttribs.srcdoc
  } : {
    uri: htmlAttribs.src
  };
  return _react.default.createElement(_reactNativeWebview.WebView, {
    key: passProps.key,
    source: source,
    style: style
  });
}

function pre(htlmAttribs, children, convertedCSSStyles, passProps) {
  return _react.default.createElement(_reactNative.Text, {
    key: passProps.key,
    style: {
      fontFamily: _reactNative.Platform.OS === 'android' ? 'monospace' : 'Menlo'
    }
  }, children);
}

function br(htlmAttribs, children, convertedCSSStyles, passProps) {
  return _react.default.createElement(_reactNative.Text, {
    allowFontScaling: passProps.allowFontScaling,
    style: {
      height: 1.2 * passProps.emSize,
      flex: 1
    },
    key: passProps.key
  }, "\n");
}

function textwrapper(htmlAttribs, children, convertedCSSStyles, _ref) {
  var allowFontScaling = _ref.allowFontScaling,
      key = _ref.key;
  return _react.default.createElement(_reactNative.Text, {
    allowFontScaling: allowFontScaling,
    key: key,
    style: convertedCSSStyles
  }, children);
}