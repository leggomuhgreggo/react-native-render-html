"use strict";

exports.__esModule = true;
exports.getParentsTagsRecursively = getParentsTagsRecursively;
exports.getClosestNodeParentByTag = getClosestNodeParentByTag;
exports.stylePropTypes = exports.STYLESETS = exports.PERC_SUPPORTED_STYLES = exports.IGNORED_TAGS = exports.ABSOLUTE_FONT_SIZE = exports.TEXT_TAGS_IGNORING_ASSOCIATION = exports.MIXED_TAGS = exports.PREFORMATTED_TAGS = exports.TEXT_TAGS = exports.BLOCK_TAGS = exports.TextOnlyPropTypes = void 0;

var _stylePropTypes;

// PropTypes have been deprecated since 0.58. This is why these array are now hardcoded. This lets us preserve
// a style checking at runtime while keeping the module compatible with all react-native versions.
var ImageStylePropTypes = ['display', 'width', 'height', 'start', 'end', 'top', 'left', 'right', 'bottom', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'margin', 'marginVertical', 'marginHorizontal', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginStart', 'marginEnd', 'padding', 'paddingVertical', 'paddingHorizontal', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingStart', 'paddingEnd', 'borderWidth', 'borderTopWidth', 'borderStartWidth', 'borderEndWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'position', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignSelf', 'alignContent', 'overflow', 'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'aspectRatio', 'zIndex', 'direction', 'shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'transform', 'transformMatrix', 'decomposedMatrix', 'scaleX', 'scaleY', 'rotation', 'translateX', 'translateY', 'resizeMode', 'backfaceVisibility', 'backgroundColor', 'borderColor', 'borderRadius', 'tintColor', 'opacity', 'overlayColor', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'];
var ViewStylePropTypes = ['display', 'width', 'height', 'start', 'end', 'top', 'left', 'right', 'bottom', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'margin', 'marginVertical', 'marginHorizontal', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginStart', 'marginEnd', 'padding', 'paddingVertical', 'paddingHorizontal', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingStart', 'paddingEnd', 'borderWidth', 'borderTopWidth', 'borderStartWidth', 'borderEndWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'position', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignSelf', 'alignContent', 'overflow', 'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'aspectRatio', 'zIndex', 'direction', 'shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'transform', 'transformMatrix', 'decomposedMatrix', 'scaleX', 'scaleY', 'rotation', 'translateX', 'translateY', 'backfaceVisibility', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderStartColor', 'borderEndColor', 'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderTopStartRadius', 'borderTopEndRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderBottomStartRadius', 'borderBottomEndRadius', 'borderStyle', 'opacity', 'elevation'];
var TextStylePropTypes = ['display', 'width', 'height', 'start', 'end', 'top', 'left', 'right', 'bottom', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'margin', 'marginVertical', 'marginHorizontal', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginStart', 'marginEnd', 'padding', 'paddingVertical', 'paddingHorizontal', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingStart', 'paddingEnd', 'borderWidth', 'borderTopWidth', 'borderStartWidth', 'borderEndWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'position', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignSelf', 'alignContent', 'overflow', 'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'aspectRatio', 'zIndex', 'direction', 'shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'transform', 'transformMatrix', 'decomposedMatrix', 'scaleX', 'scaleY', 'rotation', 'translateX', 'translateY', 'backfaceVisibility', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderStartColor', 'borderEndColor', 'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderTopStartRadius', 'borderTopEndRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'borderBottomStartRadius', 'borderBottomEndRadius', 'borderStyle', 'opacity', 'elevation', 'color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'fontVariant', 'textShadowOffset', 'textShadowRadius', 'textShadowColor', 'letterSpacing', 'lineHeight', 'textAlign', 'textAlignVertical', 'includeFontPadding', 'textDecorationLine', 'textDecorationStyle', 'textDecorationColor', 'textTransform', 'writingDirection']; // Filter prop-types that are only applicable to <Text> and not <View>

var TextOnlyPropTypes = TextStylePropTypes.filter(function (prop) {
  return ViewStylePropTypes.indexOf(prop) === -1;
}); // These tags should ALWAYS be mapped to View wrappers

exports.TextOnlyPropTypes = TextOnlyPropTypes;
var BLOCK_TAGS = ['address', 'article', 'aside', 'footer', 'hgroup', 'nav', 'section', 'blockquote', 'dd', 'dl', 'dt', 'figure', 'hr', 'li', 'main', 'ol', 'ul', 'cite', 'data', 'rp', 'rtc', 'ruby', 'area', 'img', 'map', 'center']; // These tags should ALWAYS be mapped to Text wrappers

exports.BLOCK_TAGS = BLOCK_TAGS;
var TEXT_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'figcaption', 'p', 'pre', 'abbr', 'b', 'bdi', 'bdo', 'code', 'dfn', 'i', 'kbd', 'mark', 'q', 'rt', 's', 'samp', 'small', 'big', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'del', 'ins', 'blink', 'font', 'em', 'bold', 'br']; // Text in these tags should not be stripped from line breaks

exports.TEXT_TAGS = TEXT_TAGS;
var PREFORMATTED_TAGS = ['pre']; // These tags can either be mapped to View or Text wrappers, depending solely on their children

exports.PREFORMATTED_TAGS = PREFORMATTED_TAGS;
var MIXED_TAGS = ['a']; // These text tags shouldn't be associated with their siblings in the associateRawTags method

exports.MIXED_TAGS = MIXED_TAGS;
var TEXT_TAGS_IGNORING_ASSOCIATION = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
exports.TEXT_TAGS_IGNORING_ASSOCIATION = TEXT_TAGS_IGNORING_ASSOCIATION;
var ABSOLUTE_FONT_SIZE = {
  'medium': 14,
  'xx-small': 8.5,
  'x-small': 10,
  'small': 12,
  'large': 17,
  'x-large': 20,
  'xx-large': 24,
  'smaller': 13.3,
  'larger': 16,
  'length': null,
  'initial': null,
  'inherit': null,
  'unset': null
};
exports.ABSOLUTE_FONT_SIZE = ABSOLUTE_FONT_SIZE;
var IGNORED_TAGS = ['head', 'scripts', 'audio', 'video', 'track', 'embed', 'object', 'param', 'source', 'canvas', 'noscript', 'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup', 'option', 'output', 'progress', 'select', 'textarea', 'details', 'diaglog', 'menu', 'menuitem', 'summary']; // As of react-native 0.48, this might change in the future

exports.IGNORED_TAGS = IGNORED_TAGS;
var PERC_SUPPORTED_STYLES = ['width', 'height', 'top', 'bottom', 'left', 'right', 'margin', 'marginBottom', 'marginTop', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical', 'padding', 'paddingBottom', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingHorizontal', 'paddingVertical'];
exports.PERC_SUPPORTED_STYLES = PERC_SUPPORTED_STYLES;
var STYLESETS = Object.freeze({
  VIEW: 'view',
  TEXT: 'text',
  IMAGE: 'image'
});
exports.STYLESETS = STYLESETS;
var stylePropTypes = (_stylePropTypes = {}, _stylePropTypes[STYLESETS.VIEW] = ViewStylePropTypes, _stylePropTypes[STYLESETS.TEXT] = TextStylePropTypes, _stylePropTypes[STYLESETS.IMAGE] = ImageStylePropTypes, _stylePropTypes);
/**
 * Returns an array with the tagname of every parent of a node.
 * Returns an empty array if nothing is found.
 * @export
 * @param {any} parent a parsed HTML node, from alterChildren for example
 * @param {any} tags you don't need to supply this yourself
 * @returns {array}
 */

exports.stylePropTypes = stylePropTypes;

function getParentsTagsRecursively(parent, tags) {
  if (tags === void 0) {
    tags = [];
  }

  if (!parent) {
    return tags;
  }

  parent.name && tags.push(parent.name);

  if (parent.parent) {
    return getParentsTagsRecursively(parent.parent, tags);
  } else {
    return tags;
  }
}
/**
 * Returns the closest parent of a node with a specific tag.
 * @export
 * @param {any} node
 * @param {string} tag
 * @returns {HTMLNode?}
 */


function getClosestNodeParentByTag(node, tag) {
  if (!node || !node.parent) {
    return undefined;
  }

  if (node.parent.name === tag) {
    return node.parent;
  }

  return getClosestNodeParentByTag(node.parent, tag);
}