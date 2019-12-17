"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cssStringToObject = cssStringToObject;
exports.cssObjectToString = cssObjectToString;
exports._constructStyles = _constructStyles;
exports.computeTextStyles = computeTextStyles;
exports._getElementClassStyles = _getElementClassStyles;
exports._getElementCSSClasses = _getElementCSSClasses;
exports.cssStringToRNStyle = cssStringToRNStyle;

var _HTMLUtils = require("./HTMLUtils");

var _HTMLDefaultStyles = require("./HTMLDefaultStyles");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
* Converts a html style string to an object
* @param str: the style string
* @return the style as an obect
*/
function cssStringToObject(str) {
  return str.split(';').map(prop => prop.split(':')).reduce((acc, prop) => {
    if (prop.length === 2) {
      acc[prop[0].trim()] = prop[1].trim();
    }

    return acc;
  }, {});
}

function cssObjectToString(obj) {
  let string = '';
  Object.keys(obj).forEach(style => {
    string += `${style}:${obj[style]};`;
  });
  return string;
}
/**
 * Helper that composes styles with the default style for a tag, the "style" attribute and
 * any given addiitional style. Checks everything against the style sets of views, images,
 * or texts with prop-types.
 * @export
 * @param {any} { tagName, htmlAttribs, passProps, additionalStyles, styleSet = 'VIEW' }
 * @returns {object}
 */


function _constructStyles({
  tagName,
  htmlAttribs,
  passProps,
  additionalStyles,
  styleSet = 'VIEW',
  baseFontSize
}) {
  let defaultTextStyles = (0, _HTMLDefaultStyles.generateDefaultTextStyles)(baseFontSize);
  let defaultBlockStyles = (0, _HTMLDefaultStyles.generateDefaultBlockStyles)(baseFontSize);
  passProps.ignoredStyles.forEach(ignoredStyle => {
    htmlAttribs[ignoredStyle] && delete htmlAttribs[ignoredStyle];
  });
  let style = [(styleSet === 'VIEW' ? defaultBlockStyles : defaultTextStyles)[tagName], passProps.tagsStyles ? passProps.tagsStyles[tagName] : undefined, _getElementClassStyles(htmlAttribs, passProps.classesStyles), htmlAttribs.style ? cssStringToRNStyle(htmlAttribs.style, _HTMLUtils.STYLESETS[styleSet], _objectSpread({}, passProps, {
    parentTag: tagName
  })) : undefined];

  if (additionalStyles) {
    style = style.concat(!additionalStyles.length ? [additionalStyles] : additionalStyles);
  }

  return style.filter(style => style !== undefined);
}
/**
 * Computes the styles of a text node
 * @export
 * @param {any} element parsed DOM node of text
 * @param {any} passProps set of props from the HTML component
 * @returns {object} react-native styles
 */


function computeTextStyles(element, passProps) {
  let finalStyle = {}; // Construct an array with the styles of each level of the text node, ie :
  // [element, parent1, parent2, parent3...]

  const parentStyles = _recursivelyComputeParentTextStyles(element, passProps); // Only merge the keys that aren't yet applied to the final object. ie:
  // if fontSize is already set in the first iteration, ignore the fontSize that
  // we got from the 3rd iteration because of a class for instance, hence
  // respecting the proper style inheritance


  parentStyles.forEach(styles => {
    Object.keys(styles).forEach(styleKey => {
      const styleValue = styles[styleKey];

      if (!finalStyle[styleKey]) {
        finalStyle[styleKey] = styleValue;
      }
    });
  }); // Finally, try to add the baseFontStyle values to add pontentially missing
  // styles to each text node

  return _objectSpread({}, passProps.baseFontStyle, {}, finalStyle);
}

function _recursivelyComputeParentTextStyles(element, passProps, styles = []) {
  const {
    attribs,
    name
  } = element;
  const {
    classesStyles,
    tagsStyles,
    defaultTextStyles
  } = passProps; // Construct every style for this node

  const HTMLAttribsStyles = attribs && attribs.style ? cssStringToRNStyle(attribs.style, _HTMLUtils.STYLESETS.TEXT, passProps) : {};

  const classStyles = _getElementClassStyles(attribs, classesStyles);

  const userTagStyles = tagsStyles[name];
  const defaultTagStyles = defaultTextStyles[name]; // Merge those according to their priority level

  const mergedStyles = _objectSpread({}, defaultTagStyles, {}, userTagStyles, {}, classStyles, {}, HTMLAttribsStyles);

  styles.push(mergedStyles);

  if (element.parent) {
    // Keep looping recursively if this node has parents
    return _recursivelyComputeParentTextStyles(element.parent, passProps, styles);
  } else {
    return styles;
  }
}
/**
 * Creates a set of style from an array of classes asosciated to a node.
 * @export
 * @param {any} htmlAttribs
 * @param {any} [classesStyles={}]
 * @returns {object}
 */


function _getElementClassStyles(htmlAttribs, classesStyles = {}) {
  const elementClasses = _getElementCSSClasses(htmlAttribs);

  let styles = {};
  elementClasses.forEach(className => {
    if (classesStyles[className]) {
      styles = _objectSpread({}, styles, {}, classesStyles[className]);
    }
  });
  return styles;
}
/**
 * Simple helper that returns an array of classes of a node.
 * @export
 * @param {any} htmlAttribs
 * @returns {array}
 */


function _getElementCSSClasses(htmlAttribs) {
  if (!htmlAttribs || !htmlAttribs.class) {
    return [];
  }

  return htmlAttribs.class.split(' ');
}
/**
 * Converts a html style to its equavalent react native style
 * @param {object} css: object of key value css strings
 * @param {string} styleset: the styleset to convert the styles against
 * @param {object} { parentTag, emSize, ignoredStyles }
 * @returns {object}
 */


function cssToRNStyle(css, styleset, {
  emSize,
  ptSize,
  ignoredStyles,
  allowedStyles
}) {
  const styleProps = _HTMLUtils.stylePropTypes[styleset];
  return Object.keys(css).filter(key => allowedStyles ? allowedStyles.indexOf(key) !== -1 : true).filter(key => (ignoredStyles || []).indexOf(key) === -1).map(key => [key, css[key]]).map(([key, value]) => {
    // Key convert
    return [key.split('-').map((item, index) => index === 0 ? item : item[0].toUpperCase() + item.substr(1)).join(''), value];
  }).map(([key, value]) => {
    if (styleProps.indexOf(key) === -1) {
      return undefined;
    }

    if (typeof value === 'string') {
      if (value.search('inherit') !== -1 || value.search('calc') !== -1 || value.search('normal') !== -1) {
        return undefined;
      }

      value = value.replace('!important', ''); // See if we can use the percentage directly

      if (value.search('%') !== -1 && _HTMLUtils.PERC_SUPPORTED_STYLES.indexOf(key) !== -1) {
        return [key, value];
      }

      if (value.search('em') !== -1) {
        const pxSize = parseFloat(value.replace('em', '')) * emSize;
        return [key, pxSize];
      }

      if (value.search('pt') !== -1) {
        const pxSize = parseFloat(value.replace('pt', '')) * ptSize;
        return [key, pxSize];
      } // See if we can convert a 20px to a 20 automagically


      const numericValue = parseFloat(value.replace('px', ''));

      if (key !== 'fontWeight' && !isNaN(numericValue)) {
        if (styleProps.indexOf(key) !== -1) {
          return [key, numericValue];
        }
      }

      if (key === 'fontSize') {
        return mapAbsoluteFontSize(key, value);
      }
    }

    return [key, value];
  }).filter(prop => prop !== undefined).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
}
/**
* @param {string} key: the key of style
* @param {string} value: the value of style
* @return {array}
*/


function mapAbsoluteFontSize(key, value) {
  let fontSize = value;

  if (_HTMLUtils.ABSOLUTE_FONT_SIZE.hasOwnProperty(value)) {
    fontSize = _HTMLUtils.ABSOLUTE_FONT_SIZE[value];
  }

  return [key, fontSize];
}
/**
* @param str: the css style string
* @param styleset=STYLESETS.TEXT: the styleset to convert the styles against
* @return a react native style object
*/


function cssStringToRNStyle(str, styleset = _HTMLUtils.STYLESETS.TEXT, options) {
  return cssToRNStyle(cssStringToObject(str), styleset, options);
}