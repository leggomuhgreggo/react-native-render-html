"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HTML extends _react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderers = _objectSpread({}, HTMLRenderers, {}, this.props.renderers || {});
  }

  componentWillMount() {
    this.generateDefaultStyles();
  }

  componentDidMount() {
    this.registerDOM();
  }

  componentWillReceiveProps(nextProps) {
    const {
      html,
      uri,
      renderers
    } = this.props;
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
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.dom !== prevState.dom) {
      this.parseDOM(this.state.dom);
    }
  }

  registerDOM(props = this.props, cb) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const {
        html,
        uri
      } = props;

      if (html) {
        _this.setState({
          dom: html,
          loadingRemoteURL: false,
          errorLoadingRemoteURL: false
        });
      } else if (props.uri) {
        try {
          // WIP : This should render a loader and html prop should not be set in state
          // Error handling would be nice, too.
          try {
            _this.setState({
              loadingRemoteURL: true,
              errorLoadingRemoteURL: false
            });

            let response = yield fetch(uri);

            _this.setState({
              dom: response._bodyText,
              loadingRemoteURL: false
            });
          } catch (err) {
            console.warn(err);

            _this.setState({
              errorLoadingRemoteURL: true,
              loadingRemoteURL: false
            });
          }
        } catch (err) {
          console.warn('react-native-render-html', `Couldn't fetch remote HTML from uri : ${uri}`);
          return false;
        }
      } else {
        console.warn('react-native-render-html', 'Please provide the html or uri prop.');
      }
    })();
  }

  parseDOM(dom, props = this.props) {
    const {
      decodeEntities,
      debug,
      onParsed
    } = this.props;
    const parser = new _htmlparser.default.Parser(new _htmlparser.default.DomHandler((_err, dom) => {
      let RNElements = this.mapDOMNodesTORNElements(dom, false, props);

      if (onParsed) {
        const alteredRNElements = onParsed(dom, RNElements);

        if (alteredRNElements) {
          RNElements = alteredRNElements;
        }
      }

      this.setState({
        RNNodes: this.renderRNElements(RNElements, 'root', 0, props)
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
  }

  generateDefaultStyles(baseFontStyle = this.props.baseFontStyle) {
    this.defaultBlockStyles = (0, _HTMLDefaultStyles.generateDefaultBlockStyles)(baseFontStyle.fontSize || 14);
    this.defaultTextStyles = (0, _HTMLDefaultStyles.generateDefaultTextStyles)(baseFontStyle.fontSize || 14);
  }
  /**
   * Loop on children and return whether if their parent needs to be a <View>
   * @param {any} children
   * @returns {boolean}
   * @memberof HTML
   */


  childrenNeedAView(children) {
    for (let i = 0; i < children.length; i++) {
      if (children[i].wrapper === 'View') {
        // If we find at least one View, it has to be nested in one
        return true;
      }
    } // We didn't find a single view, it can be wrapped in a Text


    return false;
  }

  wrapperHasTextChild(children) {
    for (let i = 0; i < children.length; i++) {
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


  associateRawTexts(children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child.wrapper === 'Text' && _HTMLUtils.TEXT_TAGS_IGNORING_ASSOCIATION.indexOf(child.tagName) === -1 && children.length > 1 && (!child.parent || _HTMLUtils.TEXT_TAGS_IGNORING_ASSOCIATION.indexOf(child.parent.name) === -1)) {
        // Texts outside <p> or not <p> themselves (with siblings)
        let wrappedTexts = [];

        for (let j = i; j < children.length; j++) {
          // Loop on its next siblings and store them in an array
          // until we encounter a block or a <p>
          let nextSibling = children[j];

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

    return children.filter(parsedNode => parsedNode !== false && parsedNode !== undefined);
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


  mapDOMNodesTORNElements(DOMNodes, parentTag = false, props = this.props) {
    const {
      ignoreNodesFunction,
      ignoredTags,
      alterNode,
      alterData,
      alterChildren,
      tagsStyles,
      classesStyles
    } = props;
    let RNElements = DOMNodes.map((node, nodeIndex) => {
      let {
        children,
        data
      } = node;

      if (ignoreNodesFunction && ignoreNodesFunction(node, parentTag) === true) {
        return false;
      }

      if (ignoredTags.map(tag => tag.toLowerCase()).indexOf(node.name && node.name.toLowerCase()) !== -1) {
        return false;
      }

      if (alterNode) {
        const alteredNode = alterNode(node);
        node = alteredNode || node;
      }

      const {
        type,
        attribs,
        name,
        parent
      } = node;

      if (alterData && data) {
        const alteredData = alterData(node);
        data = alteredData || data;
      }

      if (alterChildren && children) {
        const alteredChildren = alterChildren(node);
        children = alteredChildren || children;
      } // Remove whitespaces to check if it's just a blank text


      const strippedData = data && data.replace(/\s/g, '');

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
          parent,
          parentTag: parent && parent.name,
          tagName: name || 'rawtext'
        };
      }

      if (type === 'tag') {
        if (children) {
          // Recursively map all children with this method
          children = this.associateRawTexts(this.mapDOMNodesTORNElements(children, name));
        }

        if (this.childrenNeedAView(children) || _HTMLUtils.BLOCK_TAGS.indexOf(name.toLowerCase()) !== -1) {
          // If children cannot be nested in a Text, or if the tag
          // maps to a block element, use a view
          return {
            wrapper: 'View',
            children,
            attribs,
            parent,
            tagName: name,
            parentTag
          };
        } else if (_HTMLUtils.TEXT_TAGS.indexOf(name.toLowerCase()) !== -1 || _HTMLUtils.MIXED_TAGS.indexOf(name.toLowerCase()) !== -1) {
          // We are able to nest its children inside a Text
          return {
            wrapper: 'Text',
            children,
            attribs,
            parent,
            tagName: name,
            parentTag
          };
        } else if (this.renderers[name] && this.renderers[name].wrapper) {
          return {
            wrapper: this.renderers[name].wrapper,
            children,
            attribs,
            parent,
            tagName: name,
            parentTag
          };
        }

        return {
          wrapper: 'View',
          children,
          attribs,
          parent,
          tagName: name,
          parentTag
        };
      }
    }).filter(parsedNode => parsedNode !== false && parsedNode !== undefined) // remove useless nodes
    .map((parsedNode, nodeIndex) => {
      const {
        wrapper,
        children,
        attribs,
        tagName
      } = parsedNode;
      const firstChild = children && children[0];

      if (firstChild && children.length === 1) {
        // Specific tweaks for wrappers with a single child
        if ((attribs === firstChild.attribs || !firstChild.attribs) && firstChild.wrapper === wrapper && (tagName === firstChild.tagName || firstChild.tagName === 'rawtext')) {
          // If the only child of a node is using the same wrapper, merge them into one
          return _objectSpread({}, parsedNode, {
            attribs: _objectSpread({}, attribs, {}, firstChild.attribs),
            data: firstChild.data,
            children: [],
            tagName,
            nodeIndex
          });
        }
      }

      return _objectSpread({}, parsedNode, {
        nodeIndex
      });
    }).map((parsedNode, nodeIndex) => {
      const {
        wrapper,
        attribs,
        tagName,
        children
      } = parsedNode;

      if (wrapper === 'View' && attribs && this.wrapperHasTextChild(children)) {
        // When encountering a View wrapper that has some styles and also Text children,
        // let's filter out text-only styles and apply those to *all* Text children and
        // remove them from the wrapper, mimicking browsers' behaviour better.
        const wrapperStyles = _objectSpread({}, tagsStyles[tagName] || {}, {}, (0, _HTMLStyles._getElementClassStyles)(attribs, classesStyles), {}, (0, _HTMLStyles.cssStringToObject)(attribs.style || ''));

        let textChildrenInheritedStyles = {};
        Object.keys(wrapperStyles).forEach(styleKey => {
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

        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const {
            wrapper,
            attribs
          } = child;

          if (wrapper === 'Text') {
            // Set (or merge) the inherited text styles extracted from the wrapper for
            // each Text child
            if (!attribs.style) {
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


  renderRNElements(RNElements, parentWrapper = 'root', parentIndex = 0, props = this.props) {
    const {
      allowFontScaling,
      allowedStyles,
      baseFontStyle,
      classesStyles,
      emSize,
      ignoredStyles,
      ptSize,
      tagsStyles,
      textSelectable
    } = props;
    return RNElements && RNElements.length ? RNElements.map((element, index) => {
      const {
        attribs,
        data,
        tagName,
        parentTag,
        children,
        nodeIndex,
        wrapper
      } = element;
      const Wrapper = wrapper === 'Text' ? _reactNative.Text : _reactNative.View;
      const key = `${wrapper}-${parentIndex}-${nodeIndex}-${tagName}-${index}-${parentTag}`;
      const convertedCSSStyles = attribs && attribs.style ? (0, _HTMLStyles.cssStringToRNStyle)(attribs.style, Wrapper === _reactNative.Text ? _HTMLUtils.STYLESETS.TEXT : _HTMLUtils.STYLESETS.VIEW, // proper prop-types validation
      {
        parentTag: tagName,
        emSize,
        ptSize,
        ignoredStyles,
        allowedStyles
      }) : {};
      const childElements = children && children.length ? children.map((child, childIndex) => this.renderRNElements([child], wrapper, index, props)) : false;

      if (this.renderers[tagName]) {
        const customRenderer = typeof this.renderers[tagName] === 'function' ? this.renderers[tagName] : this.renderers[tagName].renderer;

        if (!customRenderer || typeof customRenderer !== 'function') {
          console.warn(`Custom renderer for ${tagName} supplied incorrectly. Please check out the docs.`);
          return undefined;
        } // If a custom renderer is available for this tag


        return customRenderer(attribs, childElements, convertedCSSStyles, _objectSpread({}, props, {
          parentWrapper: wrapper,
          parentTag,
          nodeIndex,
          parentIndex,
          key,
          data,
          rawChildren: children
        }));
      }

      const classStyles = (0, _HTMLStyles._getElementClassStyles)(attribs, classesStyles);
      const textElement = data ? _react.default.createElement(_reactNative.Text, {
        allowFontScaling: allowFontScaling,
        style: (0, _HTMLStyles.computeTextStyles)(element, {
          defaultTextStyles: this.defaultTextStyles,
          tagsStyles,
          classesStyles,
          baseFontStyle,
          emSize,
          ptSize,
          ignoredStyles,
          allowedStyles
        })
      }, data) : false;
      const style = [!tagsStyles || !tagsStyles[tagName] ? (Wrapper === _reactNative.Text ? this.defaultTextStyles : this.defaultBlockStyles)[tagName] : undefined, tagsStyles ? tagsStyles[tagName] : undefined, classStyles, convertedCSSStyles].filter(s => s !== undefined);
      const renderersProps = {};

      if (Wrapper === _reactNative.Text) {
        renderersProps.allowFontScaling = allowFontScaling;
        renderersProps.selectable = textSelectable;
      }

      return _react.default.createElement(Wrapper, _extends({
        key: key,
        style: style
      }, renderersProps), textElement, childElements);
    }) : false;
  }

  render() {
    const {
      allowFontScaling,
      customWrapper,
      remoteLoadingView,
      remoteErrorView
    } = this.props;
    const {
      RNNodes,
      loadingRemoteURL,
      errorLoadingRemoteURL
    } = this.state;

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
  }

}

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