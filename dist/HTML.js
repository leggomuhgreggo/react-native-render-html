"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactNative = require("react-native");

var _HTMLStyles = require("./HTMLStyles");

var _HTMLUtils = require("./HTMLUtils");

var _HTMLDefaultStyles = require("./HTMLDefaultStyles");

var _htmlparser = _interopRequireDefault(require("htmlparser2"));

var HTMLRenderers = _interopRequireWildcard(require("./HTMLRenderers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var HTML =
/*#__PURE__*/
function (_PureComponent) {
  _inheritsLoose(HTML, _PureComponent);

  function HTML(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.state = {};
    _this.renderers = _objectSpread({}, HTMLRenderers, {}, _this.props.renderers || {});
    return _this;
  }

  var _proto = HTML.prototype;

  _proto.componentWillMount = function componentWillMount() {
    this.generateDefaultStyles();
  };

  _proto.componentDidMount = function componentDidMount() {
    this.registerDOM();
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this$props = this.props,
        html = _this$props.html,
        uri = _this$props.uri,
        renderers = _this$props.renderers;
    this.generateDefaultStyles(nextProps.baseFontStyle);

    if (renderers !== nextProps.renderers) {
      this.renderers = _objectSpread({}, HTMLRenderers, {}, nextProps.renderers || {});
    }

    if (html !== nextProps.html || uri !== nextProps.uri) {
      // If the source changed, register the new HTML and parse it
      this.registerDOM(nextProps);
    } else {
      // If it didn't, let's just parse the current DOM and re-render the nodes
      // to compute potential style changes
      this.parseDOM(this.state.dom, nextProps);
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (this.state.dom !== prevState.dom) {
      this.parseDOM(this.state.dom);
    }
  };

  _proto.registerDOM = function registerDOM(props, cb) {
    var _props, html, uri, response;

    return regeneratorRuntime.async(function registerDOM$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (props === void 0) {
              props = this.props;
            }

            _props = props, html = _props.html, uri = _props.uri;

            if (!html) {
              _context.next = 6;
              break;
            }

            this.setState({
              dom: html,
              loadingRemoteURL: false,
              errorLoadingRemoteURL: false
            });
            _context.next = 29;
            break;

          case 6:
            if (!props.uri) {
              _context.next = 28;
              break;
            }

            _context.prev = 7;
            _context.prev = 8;
            this.setState({
              loadingRemoteURL: true,
              errorLoadingRemoteURL: false
            });
            _context.next = 12;
            return regeneratorRuntime.awrap(fetch(uri));

          case 12:
            response = _context.sent;
            this.setState({
              dom: response._bodyText,
              loadingRemoteURL: false
            });
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](8);
            console.warn(_context.t0);
            this.setState({
              errorLoadingRemoteURL: true,
              loadingRemoteURL: false
            });

          case 20:
            _context.next = 26;
            break;

          case 22:
            _context.prev = 22;
            _context.t1 = _context["catch"](7);
            console.warn('react-native-render-html', "Couldn't fetch remote HTML from uri : " + uri);
            return _context.abrupt("return", false);

          case 26:
            _context.next = 29;
            break;

          case 28:
            console.warn('react-native-render-html', 'Please provide the html or uri prop.');

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, null, this, [[7, 22], [8, 16]]);
  };

  _proto.parseDOM = function parseDOM(dom, props) {
    var _this2 = this;

    if (props === void 0) {
      props = this.props;
    }

    var _this$props2 = this.props,
        decodeEntities = _this$props2.decodeEntities,
        debug = _this$props2.debug,
        onParsed = _this$props2.onParsed;
    var parser = new _htmlparser.default.Parser(new _htmlparser.default.DomHandler(function (_err, dom) {
      var RNElements = _this2.mapDOMNodesTORNElements(dom, false, props);

      if (onParsed) {
        var alteredRNElements = onParsed(dom, RNElements);

        if (alteredRNElements) {
          RNElements = alteredRNElements;
        }
      }

      _this2.setState({
        RNNodes: _this2.renderRNElements(RNElements, 'root', 0, props)
      });

      if (debug) {
        console.log('DOMNodes from htmlparser2', dom);
        console.log('RNElements from render-html', RNElements);
      }
    }), {
      decodeEntities: decodeEntities
    });
    parser.write(dom);
    parser.done();
  };

  _proto.generateDefaultStyles = function generateDefaultStyles(baseFontStyle) {
    if (baseFontStyle === void 0) {
      baseFontStyle = this.props.baseFontStyle;
    }

    this.defaultBlockStyles = (0, _HTMLDefaultStyles.generateDefaultBlockStyles)(baseFontStyle.fontSize || 14);
    this.defaultTextStyles = (0, _HTMLDefaultStyles.generateDefaultTextStyles)(baseFontStyle.fontSize || 14);
  }
  /**
   * Loop on children and return whether if their parent needs to be a <View>
   * @param {any} children
   * @returns {boolean}
   * @memberof HTML
   */
  ;

  _proto.childrenNeedAView = function childrenNeedAView(children) {
    for (var i = 0; i < children.length; i++) {
      if (children[i].wrapper === 'View') {
        // If we find at least one View, it has to be nested in one
        return true;
      }
    } // We didn't find a single view, it can be wrapped in a Text


    return false;
  };

  _proto.wrapperHasTextChild = function wrapperHasTextChild(children) {
    for (var i = 0; i < children.length; i++) {
      if (children[i].wrapper === 'Text') {
        return true;
      }
    }

    return false;
  }
  /**
   * Loops on children an find texts that need to be wrapped so we don't render line breaks
   * The wrapper can either be a <p> when it should be a paragraph, or a custom tag named
   * "textwrapper", which renders a plain <Text> component.
   * @param {any} children
   * @returns {array}
   * @memberof HTML
   */
  ;

  _proto.associateRawTexts = function associateRawTexts(children) {
    for (var i = 0; i < children.length; i++) {
      var child = children[i];

      if (child.wrapper === 'Text' && _HTMLUtils.TEXT_TAGS_IGNORING_ASSOCIATION.indexOf(child.tagName) === -1 && children.length > 1 && (!child.parent || _HTMLUtils.TEXT_TAGS_IGNORING_ASSOCIATION.indexOf(child.parent.name) === -1)) {
        // Texts outside <p> or not <p> themselves (with siblings)
        var wrappedTexts = [];

        for (var j = i; j < children.length; j++) {
          // Loop on its next siblings and store them in an array
          // until we encounter a block or a <p>
          var nextSibling = children[j];

          if (nextSibling.wrapper !== 'Text' || _HTMLUtils.TEXT_TAGS_IGNORING_ASSOCIATION.indexOf(nextSibling.tagName) !== -1) {
            break;
          }

          wrappedTexts.push(nextSibling); // Remove the child that has been nested

          children[j] = false;
        } // Replace the raw text with a <p> that has wrappedTexts as its children


        if (wrappedTexts.length) {
          children[i] = {
            attribs: {},
            children: wrappedTexts,
            nodeIndex: i,
            parent: child.parent,
            parentTag: child.parentTag,
            tagName: 'textwrapper',
            wrapper: 'Text'
          };
        }
      }
    }

    return children.filter(function (parsedNode) {
      return parsedNode !== false && parsedNode !== undefined;
    });
  }
  /**
   * Maps the DOM nodes parsed by htmlparser2 into a simple structure that will be easy to render with
   * native components. It removes ignored tags, chooses the right wrapper for each set of children
   * to ensure we're not wrapping views inside texts and improves the structure recursively
   * to prevent erratic rendering.
   * @param {array} DOMNodes
   * @param {boolean} [parentTag=false]
   * @returns
   * @memberof HTML
   */
  ;

  _proto.mapDOMNodesTORNElements = function mapDOMNodesTORNElements(DOMNodes, parentTag, props) {
    var _this3 = this;

    if (parentTag === void 0) {
      parentTag = false;
    }

    if (props === void 0) {
      props = this.props;
    }

    var _props2 = props,
        ignoreNodesFunction = _props2.ignoreNodesFunction,
        ignoredTags = _props2.ignoredTags,
        alterNode = _props2.alterNode,
        alterData = _props2.alterData,
        alterChildren = _props2.alterChildren,
        tagsStyles = _props2.tagsStyles,
        classesStyles = _props2.classesStyles;
    var RNElements = DOMNodes.map(function (node, nodeIndex) {
      var _node = node,
          children = _node.children,
          data = _node.data;

      if (ignoreNodesFunction && ignoreNodesFunction(node, parentTag) === true) {
        return false;
      }

      if (ignoredTags.map(function (tag) {
        return tag.toLowerCase();
      }).indexOf(node.name && node.name.toLowerCase()) !== -1) {
        return false;
      }

      if (alterNode) {
        var alteredNode = alterNode(node);
        node = alteredNode || node;
      }

      var _node2 = node,
          type = _node2.type,
          attribs = _node2.attribs,
          name = _node2.name,
          parent = _node2.parent;

      if (alterData && data) {
        var alteredData = alterData(node);
        data = alteredData || data;
      }

      if (alterChildren && children) {
        var alteredChildren = alterChildren(node);
        children = alteredChildren || children;
      } // Remove whitespaces to check if it's just a blank text


      var strippedData = data && data.replace(/\s/g, '');

      if (type === 'text') {
        if (!strippedData || !strippedData.length) {
          // This is blank, don't render an useless additional component
          return false;
        }

        if (node.parent && node.parent.name && _HTMLUtils.PREFORMATTED_TAGS.indexOf(node.parent.name) === -1) {
          // Remove line breaks in non-pre-formatted tags
          data = data.replace(/(\r\n|\n|\r)/gm, '');
        } // Text without tags, these can be mapped to the Text wrapper


        return {
          wrapper: 'Text',
          data: data,
          attribs: attribs || {},
          parent: parent,
          parentTag: parent && parent.name,
          tagName: name || 'rawtext'
        };
      }

      if (type === 'tag') {
        if (children) {
          // Recursively map all children with this method
          children = _this3.associateRawTexts(_this3.mapDOMNodesTORNElements(children, name));
        }

        if (_this3.childrenNeedAView(children) || _HTMLUtils.BLOCK_TAGS.indexOf(name.toLowerCase()) !== -1) {
          // If children cannot be nested in a Text, or if the tag
          // maps to a block element, use a view
          return {
            wrapper: 'View',
            children: children,
            attribs: attribs,
            parent: parent,
            tagName: name,
            parentTag: parentTag
          };
        } else if (_HTMLUtils.TEXT_TAGS.indexOf(name.toLowerCase()) !== -1 || _HTMLUtils.MIXED_TAGS.indexOf(name.toLowerCase()) !== -1) {
          // We are able to nest its children inside a Text
          return {
            wrapper: 'Text',
            children: children,
            attribs: attribs,
            parent: parent,
            tagName: name,
            parentTag: parentTag
          };
        } else if (_this3.renderers[name] && _this3.renderers[name].wrapper) {
          return {
            wrapper: _this3.renderers[name].wrapper,
            children: children,
            attribs: attribs,
            parent: parent,
            tagName: name,
            parentTag: parentTag
          };
        }

        return {
          wrapper: 'View',
          children: children,
          attribs: attribs,
          parent: parent,
          tagName: name,
          parentTag: parentTag
        };
      }
    }).filter(function (parsedNode) {
      return parsedNode !== false && parsedNode !== undefined;
    }) // remove useless nodes
    .map(function (parsedNode, nodeIndex) {
      var wrapper = parsedNode.wrapper,
          children = parsedNode.children,
          attribs = parsedNode.attribs,
          tagName = parsedNode.tagName;
      var firstChild = children && children[0];

      if (firstChild && children.length === 1) {
        // Specific tweaks for wrappers with a single child
        if ((attribs === firstChild.attribs || !firstChild.attribs) && firstChild.wrapper === wrapper && (tagName === firstChild.tagName || firstChild.tagName === 'rawtext')) {
          // If the only child of a node is using the same wrapper, merge them into one
          return _objectSpread({}, parsedNode, {
            attribs: _objectSpread({}, attribs, {}, firstChild.attribs),
            data: firstChild.data,
            children: [],
            tagName: tagName,
            nodeIndex: nodeIndex
          });
        }
      }

      return _objectSpread({}, parsedNode, {
        nodeIndex: nodeIndex
      });
    }).map(function (parsedNode, nodeIndex) {
      var wrapper = parsedNode.wrapper,
          attribs = parsedNode.attribs,
          tagName = parsedNode.tagName,
          children = parsedNode.children;

      if (wrapper === 'View' && attribs && _this3.wrapperHasTextChild(children)) {
        // When encountering a View wrapper that has some styles and also Text children,
        // let's filter out text-only styles and apply those to *all* Text children and
        // remove them from the wrapper, mimicking browsers' behaviour better.
        var wrapperStyles = _objectSpread({}, tagsStyles[tagName] || {}, {}, (0, _HTMLStyles._getElementClassStyles)(attribs, classesStyles), {}, (0, _HTMLStyles.cssStringToObject)(attribs.style || ''));

        var textChildrenInheritedStyles = {};
        Object.keys(wrapperStyles).forEach(function (styleKey) {
          // Extract text-only styles
          if (_HTMLUtils.TextOnlyPropTypes.indexOf(styleKey) !== -1) {
            textChildrenInheritedStyles[styleKey] = wrapperStyles[styleKey];
            delete wrapperStyles[styleKey];
          }
        });

        if (Object.keys(textChildrenInheritedStyles).length === 0) {
          // No style to apply to text children, avoid unecessary loops
          return parsedNode;
        } // Re-write wrapper's styles as a string


        parsedNode.attribs.style = (0, _HTMLStyles.cssObjectToString)(wrapperStyles);

        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          var _wrapper = child.wrapper,
              _attribs = child.attribs;

          if (_wrapper === 'Text') {
            // Set (or merge) the inherited text styles extracted from the wrapper for
            // each Text child
            if (!_attribs.style) {
              child.attribs.style = (0, _HTMLStyles.cssObjectToString)(textChildrenInheritedStyles);
            } else {
              child.attribs.style = (0, _HTMLStyles.cssObjectToString)(_objectSpread({}, textChildrenInheritedStyles, {}, (0, _HTMLStyles.cssStringToObject)(child.attribs.style)));
            }
          }
        }
      }

      return parsedNode;
    });
    return this.associateRawTexts(RNElements);
  }
  /**
   * Takes the parsed nodes from mapDOMNodesTORNElements and actually renders native components.
   * Calls the utils that convert the CSS into react-native compatible styles and renders custom
   * components when needed.
   * @param {boolean} RNElements
   * @param {string} [parentWrapper='root']
   * @param {number} [parentIndex=0]
   * @returns {array}
   * @memberof HTML
   */
  ;

  _proto.renderRNElements = function renderRNElements(RNElements, parentWrapper, parentIndex, props) {
    var _this4 = this;

    if (parentWrapper === void 0) {
      parentWrapper = 'root';
    }

    if (parentIndex === void 0) {
      parentIndex = 0;
    }

    if (props === void 0) {
      props = this.props;
    }

    var _props3 = props,
        allowFontScaling = _props3.allowFontScaling,
        allowedStyles = _props3.allowedStyles,
        baseFontStyle = _props3.baseFontStyle,
        classesStyles = _props3.classesStyles,
        emSize = _props3.emSize,
        ignoredStyles = _props3.ignoredStyles,
        ptSize = _props3.ptSize,
        tagsStyles = _props3.tagsStyles,
        textSelectable = _props3.textSelectable;
    return RNElements && RNElements.length ? RNElements.map(function (element, index) {
      var attribs = element.attribs,
          data = element.data,
          tagName = element.tagName,
          parentTag = element.parentTag,
          children = element.children,
          nodeIndex = element.nodeIndex,
          wrapper = element.wrapper;
      var Wrapper = wrapper === 'Text' ? _reactNative.Text : _reactNative.View;
      var key = wrapper + "-" + parentIndex + "-" + nodeIndex + "-" + tagName + "-" + index + "-" + parentTag;
      var convertedCSSStyles = attribs && attribs.style ? (0, _HTMLStyles.cssStringToRNStyle)(attribs.style, Wrapper === _reactNative.Text ? _HTMLUtils.STYLESETS.TEXT : _HTMLUtils.STYLESETS.VIEW, // proper prop-types validation
      {
        parentTag: tagName,
        emSize: emSize,
        ptSize: ptSize,
        ignoredStyles: ignoredStyles,
        allowedStyles: allowedStyles
      }) : {};
      var childElements = children && children.length ? children.map(function (child, childIndex) {
        return _this4.renderRNElements([child], wrapper, index, props);
      }) : false;

      if (_this4.renderers[tagName]) {
        var customRenderer = typeof _this4.renderers[tagName] === 'function' ? _this4.renderers[tagName] : _this4.renderers[tagName].renderer;

        if (!customRenderer || typeof customRenderer !== 'function') {
          console.warn("Custom renderer for " + tagName + " supplied incorrectly. Please check out the docs.");
          return undefined;
        } // If a custom renderer is available for this tag


        return customRenderer(attribs, childElements, convertedCSSStyles, _objectSpread({}, props, {
          parentWrapper: wrapper,
          parentTag: parentTag,
          nodeIndex: nodeIndex,
          parentIndex: parentIndex,
          key: key,
          data: data,
          rawChildren: children
        }));
      }

      var classStyles = (0, _HTMLStyles._getElementClassStyles)(attribs, classesStyles);
      var textElement = data ? _react.default.createElement(_reactNative.Text, {
        allowFontScaling: allowFontScaling,
        style: (0, _HTMLStyles.computeTextStyles)(element, {
          defaultTextStyles: _this4.defaultTextStyles,
          tagsStyles: tagsStyles,
          classesStyles: classesStyles,
          baseFontStyle: baseFontStyle,
          emSize: emSize,
          ptSize: ptSize,
          ignoredStyles: ignoredStyles,
          allowedStyles: allowedStyles
        })
      }, data) : false;
      var style = [!tagsStyles || !tagsStyles[tagName] ? (Wrapper === _reactNative.Text ? _this4.defaultTextStyles : _this4.defaultBlockStyles)[tagName] : undefined, tagsStyles ? tagsStyles[tagName] : undefined, classStyles, convertedCSSStyles].filter(function (s) {
        return s !== undefined;
      });
      var renderersProps = {};

      if (Wrapper === _reactNative.Text) {
        renderersProps.allowFontScaling = allowFontScaling;
        renderersProps.selectable = textSelectable;
      }

      return _react.default.createElement(Wrapper, _extends({
        key: key,
        style: style
      }, renderersProps), textElement, childElements);
    }) : false;
  };

  _proto.render = function render() {
    var _this$props3 = this.props,
        allowFontScaling = _this$props3.allowFontScaling,
        customWrapper = _this$props3.customWrapper,
        remoteLoadingView = _this$props3.remoteLoadingView,
        remoteErrorView = _this$props3.remoteErrorView;
    var _this$state = this.state,
        RNNodes = _this$state.RNNodes,
        loadingRemoteURL = _this$state.loadingRemoteURL,
        errorLoadingRemoteURL = _this$state.errorLoadingRemoteURL;

    if (!RNNodes && !loadingRemoteURL && !errorLoadingRemoteURL) {
      return null;
    } else if (loadingRemoteURL) {
      return remoteLoadingView ? remoteLoadingView(this.props, this.state) : _react.default.createElement(_reactNative.View, {
        style: {
          flex: 1,
          alignItems: 'center'
        }
      }, _react.default.createElement(_reactNative.ActivityIndicator, null));
    } else if (errorLoadingRemoteURL) {
      return remoteErrorView ? remoteErrorView(this.props, this.state) : _react.default.createElement(_reactNative.View, {
        style: {
          flex: 1,
          alignItems: 'center'
        }
      }, _react.default.createElement(_reactNative.Text, {
        allowFontScaling: allowFontScaling,
        style: {
          fontStyle: 'italic',
          fontSize: 16
        }
      }, "Could not load ", this.props.uri));
    }

    return customWrapper ? customWrapper(RNNodes) : _react.default.createElement(_reactNative.View, {
      style: this.props.containerStyle || {}
    }, RNNodes);
  };

  return HTML;
}(_react.PureComponent);

exports.default = HTML;
HTML.defaultProps = {
  renderers: HTMLRenderers,
  debug: false,
  decodeEntities: true,
  emSize: 14,
  ptSize: 1.3,
  staticContentMaxWidth: _reactNative.Dimensions.get('window').width,
  imagesMaxWidth: _reactNative.Dimensions.get('window').width,
  ignoredTags: _HTMLUtils.IGNORED_TAGS,
  ignoredStyles: [],
  baseFontStyle: {
    fontSize: 14
  },
  tagsStyles: {},
  classesStyles: {},
  textSelectable: false,
  allowFontScaling: true
};
HTML.propTypes = process.env.NODE_ENV !== "production" ? {
  renderers: _propTypes.default.object.isRequired,
  ignoredTags: _propTypes.default.array.isRequired,
  ignoredStyles: _propTypes.default.array.isRequired,
  allowedStyles: _propTypes.default.array,
  decodeEntities: _propTypes.default.bool.isRequired,
  debug: _propTypes.default.bool.isRequired,
  listsPrefixesRenderers: _propTypes.default.object,
  ignoreNodesFunction: _propTypes.default.func,
  alterData: _propTypes.default.func,
  alterChildren: _propTypes.default.func,
  alterNode: _propTypes.default.func,
  html: _propTypes.default.string,
  uri: _propTypes.default.string,
  tagsStyles: _propTypes.default.object,
  classesStyles: _propTypes.default.object,
  containerStyle: _reactNative.ViewPropTypes ? _reactNative.ViewPropTypes.style : _reactNative.View.propTypes.style,
  customWrapper: _propTypes.default.func,
  onLinkPress: _propTypes.default.func,
  onParsed: _propTypes.default.func,
  imagesMaxWidth: _propTypes.default.number,
  staticContentMaxWidth: _propTypes.default.number,
  imagesInitialDimensions: _propTypes.default.shape({
    width: _propTypes.default.number,
    height: _propTypes.default.number
  }),
  emSize: _propTypes.default.number.isRequired,
  ptSize: _propTypes.default.number.isRequired,
  baseFontStyle: _propTypes.default.object.isRequired,
  textSelectable: _propTypes.default.bool,
  renderersProps: _propTypes.default.object,
  allowFontScaling: _propTypes.default.bool
} : {};
module.exports = exports["default"];