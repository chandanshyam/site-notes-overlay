(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/dompurify/dist/purify.js
  var require_purify = __commonJS({
    "node_modules/dompurify/dist/purify.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.DOMPurify = factory());
      })(exports, function() {
        "use strict";
        const {
          entries,
          setPrototypeOf,
          isFrozen,
          getPrototypeOf,
          getOwnPropertyDescriptor
        } = Object;
        let {
          freeze,
          seal,
          create
        } = Object;
        let {
          apply,
          construct
        } = typeof Reflect !== "undefined" && Reflect;
        if (!freeze) {
          freeze = function freeze2(x) {
            return x;
          };
        }
        if (!seal) {
          seal = function seal2(x) {
            return x;
          };
        }
        if (!apply) {
          apply = function apply2(fun, thisValue, args) {
            return fun.apply(thisValue, args);
          };
        }
        if (!construct) {
          construct = function construct2(Func, args) {
            return new Func(...args);
          };
        }
        const arrayForEach = unapply(Array.prototype.forEach);
        const arrayPop = unapply(Array.prototype.pop);
        const arrayPush = unapply(Array.prototype.push);
        const stringToLowerCase = unapply(String.prototype.toLowerCase);
        const stringToString = unapply(String.prototype.toString);
        const stringMatch = unapply(String.prototype.match);
        const stringReplace = unapply(String.prototype.replace);
        const stringIndexOf = unapply(String.prototype.indexOf);
        const stringTrim = unapply(String.prototype.trim);
        const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
        const regExpTest = unapply(RegExp.prototype.test);
        const typeErrorCreate = unconstruct(TypeError);
        function unapply(func) {
          return function(thisArg) {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            return apply(func, thisArg, args);
          };
        }
        function unconstruct(func) {
          return function() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            return construct(func, args);
          };
        }
        function addToSet(set, array) {
          let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
          if (setPrototypeOf) {
            setPrototypeOf(set, null);
          }
          let l = array.length;
          while (l--) {
            let element = array[l];
            if (typeof element === "string") {
              const lcElement = transformCaseFunc(element);
              if (lcElement !== element) {
                if (!isFrozen(array)) {
                  array[l] = lcElement;
                }
                element = lcElement;
              }
            }
            set[element] = true;
          }
          return set;
        }
        function cleanArray(array) {
          for (let index = 0; index < array.length; index++) {
            const isPropertyExist = objectHasOwnProperty(array, index);
            if (!isPropertyExist) {
              array[index] = null;
            }
          }
          return array;
        }
        function clone(object) {
          const newObject = create(null);
          for (const [property, value] of entries(object)) {
            const isPropertyExist = objectHasOwnProperty(object, property);
            if (isPropertyExist) {
              if (Array.isArray(value)) {
                newObject[property] = cleanArray(value);
              } else if (value && typeof value === "object" && value.constructor === Object) {
                newObject[property] = clone(value);
              } else {
                newObject[property] = value;
              }
            }
          }
          return newObject;
        }
        function lookupGetter(object, prop) {
          while (object !== null) {
            const desc = getOwnPropertyDescriptor(object, prop);
            if (desc) {
              if (desc.get) {
                return unapply(desc.get);
              }
              if (typeof desc.value === "function") {
                return unapply(desc.value);
              }
            }
            object = getPrototypeOf(object);
          }
          function fallbackValue() {
            return null;
          }
          return fallbackValue;
        }
        const html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
        const svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
        const svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
        const svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
        const mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
        const mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
        const text = freeze(["#text"]);
        const html2 = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
        const svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
        const mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
        const xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
        const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
        const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
        const TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
        const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/);
        const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
        const IS_ALLOWED_URI = seal(
          /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
          // eslint-disable-line no-useless-escape
        );
        const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
        const ATTR_WHITESPACE = seal(
          /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
          // eslint-disable-line no-control-regex
        );
        const DOCTYPE_NAME = seal(/^html$/i);
        const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
        var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          MUSTACHE_EXPR,
          ERB_EXPR,
          TMPLIT_EXPR,
          DATA_ATTR,
          ARIA_ATTR,
          IS_ALLOWED_URI,
          IS_SCRIPT_OR_DATA,
          ATTR_WHITESPACE,
          DOCTYPE_NAME,
          CUSTOM_ELEMENT
        });
        const NODE_TYPE = {
          element: 1,
          attribute: 2,
          text: 3,
          cdataSection: 4,
          entityReference: 5,
          // Deprecated
          entityNode: 6,
          // Deprecated
          progressingInstruction: 7,
          comment: 8,
          document: 9,
          documentType: 10,
          documentFragment: 11,
          notation: 12
          // Deprecated
        };
        const getGlobal = function getGlobal2() {
          return typeof window === "undefined" ? null : window;
        };
        const _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
          if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
            return null;
          }
          let suffix = null;
          const ATTR_NAME = "data-tt-policy-suffix";
          if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
            suffix = purifyHostElement.getAttribute(ATTR_NAME);
          }
          const policyName = "dompurify" + (suffix ? "#" + suffix : "");
          try {
            return trustedTypes.createPolicy(policyName, {
              createHTML(html3) {
                return html3;
              },
              createScriptURL(scriptUrl) {
                return scriptUrl;
              }
            });
          } catch (_) {
            console.warn("TrustedTypes policy " + policyName + " could not be created.");
            return null;
          }
        };
        function createDOMPurify() {
          let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
          const DOMPurify2 = (root) => createDOMPurify(root);
          DOMPurify2.version = "3.1.6";
          DOMPurify2.removed = [];
          if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document) {
            DOMPurify2.isSupported = false;
            return DOMPurify2;
          }
          let {
            document: document2
          } = window2;
          const originalDocument = document2;
          const currentScript = originalDocument.currentScript;
          const {
            DocumentFragment,
            HTMLTemplateElement,
            Node: Node2,
            Element: Element2,
            NodeFilter: NodeFilter2,
            NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
            HTMLFormElement,
            DOMParser,
            trustedTypes
          } = window2;
          const ElementPrototype = Element2.prototype;
          const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
          const remove = lookupGetter(ElementPrototype, "remove");
          const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
          const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
          const getParentNode = lookupGetter(ElementPrototype, "parentNode");
          if (typeof HTMLTemplateElement === "function") {
            const template = document2.createElement("template");
            if (template.content && template.content.ownerDocument) {
              document2 = template.content.ownerDocument;
            }
          }
          let trustedTypesPolicy;
          let emptyHTML = "";
          const {
            implementation,
            createNodeIterator,
            createDocumentFragment,
            getElementsByTagName
          } = document2;
          const {
            importNode
          } = originalDocument;
          let hooks = {};
          DOMPurify2.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
          const {
            MUSTACHE_EXPR: MUSTACHE_EXPR2,
            ERB_EXPR: ERB_EXPR2,
            TMPLIT_EXPR: TMPLIT_EXPR2,
            DATA_ATTR: DATA_ATTR2,
            ARIA_ATTR: ARIA_ATTR2,
            IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
            ATTR_WHITESPACE: ATTR_WHITESPACE2,
            CUSTOM_ELEMENT: CUSTOM_ELEMENT2
          } = EXPRESSIONS;
          let {
            IS_ALLOWED_URI: IS_ALLOWED_URI$1
          } = EXPRESSIONS;
          let ALLOWED_TAGS = null;
          const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
          let ALLOWED_ATTR = null;
          const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html2, ...svg, ...mathMl, ...xml]);
          let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
            tagNameCheck: {
              writable: true,
              configurable: false,
              enumerable: true,
              value: null
            },
            attributeNameCheck: {
              writable: true,
              configurable: false,
              enumerable: true,
              value: null
            },
            allowCustomizedBuiltInElements: {
              writable: true,
              configurable: false,
              enumerable: true,
              value: false
            }
          }));
          let FORBID_TAGS = null;
          let FORBID_ATTR = null;
          let ALLOW_ARIA_ATTR = true;
          let ALLOW_DATA_ATTR = true;
          let ALLOW_UNKNOWN_PROTOCOLS = false;
          let ALLOW_SELF_CLOSE_IN_ATTR = true;
          let SAFE_FOR_TEMPLATES = false;
          let SAFE_FOR_XML = true;
          let WHOLE_DOCUMENT = false;
          let SET_CONFIG = false;
          let FORCE_BODY = false;
          let RETURN_DOM = false;
          let RETURN_DOM_FRAGMENT = false;
          let RETURN_TRUSTED_TYPE = false;
          let SANITIZE_DOM = true;
          let SANITIZE_NAMED_PROPS = false;
          const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
          let KEEP_CONTENT = true;
          let IN_PLACE = false;
          let USE_PROFILES = {};
          let FORBID_CONTENTS = null;
          const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
          let DATA_URI_TAGS = null;
          const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
          let URI_SAFE_ATTRIBUTES = null;
          const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
          const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
          const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
          const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
          let NAMESPACE = HTML_NAMESPACE;
          let IS_EMPTY_INPUT = false;
          let ALLOWED_NAMESPACES = null;
          const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
          let PARSER_MEDIA_TYPE = null;
          const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
          const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
          let transformCaseFunc = null;
          let CONFIG2 = null;
          const formElement = document2.createElement("form");
          const isRegexOrFunction = function isRegexOrFunction2(testValue) {
            return testValue instanceof RegExp || testValue instanceof Function;
          };
          const _parseConfig = function _parseConfig2() {
            let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            if (CONFIG2 && CONFIG2 === cfg) {
              return;
            }
            if (!cfg || typeof cfg !== "object") {
              cfg = {};
            }
            cfg = clone(cfg);
            PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
            SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
            transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
            ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
            ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
            ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
            URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(
              clone(DEFAULT_URI_SAFE_ATTRIBUTES),
              // eslint-disable-line indent
              cfg.ADD_URI_SAFE_ATTR,
              // eslint-disable-line indent
              transformCaseFunc
              // eslint-disable-line indent
            ) : DEFAULT_URI_SAFE_ATTRIBUTES;
            DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(
              clone(DEFAULT_DATA_URI_TAGS),
              // eslint-disable-line indent
              cfg.ADD_DATA_URI_TAGS,
              // eslint-disable-line indent
              transformCaseFunc
              // eslint-disable-line indent
            ) : DEFAULT_DATA_URI_TAGS;
            FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
            FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
            FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
            USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
            ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
            ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
            ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
            ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
            SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
            SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
            WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
            RETURN_DOM = cfg.RETURN_DOM || false;
            RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
            RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
            FORCE_BODY = cfg.FORCE_BODY || false;
            SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
            SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
            KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
            IN_PLACE = cfg.IN_PLACE || false;
            IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
            NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
            CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
            if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
              CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
            }
            if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
              CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
            }
            if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
              CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
            }
            if (SAFE_FOR_TEMPLATES) {
              ALLOW_DATA_ATTR = false;
            }
            if (RETURN_DOM_FRAGMENT) {
              RETURN_DOM = true;
            }
            if (USE_PROFILES) {
              ALLOWED_TAGS = addToSet({}, text);
              ALLOWED_ATTR = [];
              if (USE_PROFILES.html === true) {
                addToSet(ALLOWED_TAGS, html$1);
                addToSet(ALLOWED_ATTR, html2);
              }
              if (USE_PROFILES.svg === true) {
                addToSet(ALLOWED_TAGS, svg$1);
                addToSet(ALLOWED_ATTR, svg);
                addToSet(ALLOWED_ATTR, xml);
              }
              if (USE_PROFILES.svgFilters === true) {
                addToSet(ALLOWED_TAGS, svgFilters);
                addToSet(ALLOWED_ATTR, svg);
                addToSet(ALLOWED_ATTR, xml);
              }
              if (USE_PROFILES.mathMl === true) {
                addToSet(ALLOWED_TAGS, mathMl$1);
                addToSet(ALLOWED_ATTR, mathMl);
                addToSet(ALLOWED_ATTR, xml);
              }
            }
            if (cfg.ADD_TAGS) {
              if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
                ALLOWED_TAGS = clone(ALLOWED_TAGS);
              }
              addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
            }
            if (cfg.ADD_ATTR) {
              if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
                ALLOWED_ATTR = clone(ALLOWED_ATTR);
              }
              addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
            }
            if (cfg.ADD_URI_SAFE_ATTR) {
              addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
            }
            if (cfg.FORBID_CONTENTS) {
              if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
                FORBID_CONTENTS = clone(FORBID_CONTENTS);
              }
              addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
            }
            if (KEEP_CONTENT) {
              ALLOWED_TAGS["#text"] = true;
            }
            if (WHOLE_DOCUMENT) {
              addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
            }
            if (ALLOWED_TAGS.table) {
              addToSet(ALLOWED_TAGS, ["tbody"]);
              delete FORBID_TAGS.tbody;
            }
            if (cfg.TRUSTED_TYPES_POLICY) {
              if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
                throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
              }
              if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
                throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
              }
              trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
              emptyHTML = trustedTypesPolicy.createHTML("");
            } else {
              if (trustedTypesPolicy === void 0) {
                trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
              }
              if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
                emptyHTML = trustedTypesPolicy.createHTML("");
              }
            }
            if (freeze) {
              freeze(cfg);
            }
            CONFIG2 = cfg;
          };
          const MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
          const HTML_INTEGRATION_POINTS = addToSet({}, ["foreignobject", "annotation-xml"]);
          const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
          const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
          const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
          const _checkValidNamespace = function _checkValidNamespace2(element) {
            let parent = getParentNode(element);
            if (!parent || !parent.tagName) {
              parent = {
                namespaceURI: NAMESPACE,
                tagName: "template"
              };
            }
            const tagName = stringToLowerCase(element.tagName);
            const parentTagName = stringToLowerCase(parent.tagName);
            if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
              return false;
            }
            if (element.namespaceURI === SVG_NAMESPACE) {
              if (parent.namespaceURI === HTML_NAMESPACE) {
                return tagName === "svg";
              }
              if (parent.namespaceURI === MATHML_NAMESPACE) {
                return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
              }
              return Boolean(ALL_SVG_TAGS[tagName]);
            }
            if (element.namespaceURI === MATHML_NAMESPACE) {
              if (parent.namespaceURI === HTML_NAMESPACE) {
                return tagName === "math";
              }
              if (parent.namespaceURI === SVG_NAMESPACE) {
                return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
              }
              return Boolean(ALL_MATHML_TAGS[tagName]);
            }
            if (element.namespaceURI === HTML_NAMESPACE) {
              if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
                return false;
              }
              if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
                return false;
              }
              return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
            }
            if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
              return true;
            }
            return false;
          };
          const _forceRemove = function _forceRemove2(node) {
            arrayPush(DOMPurify2.removed, {
              element: node
            });
            try {
              getParentNode(node).removeChild(node);
            } catch (_) {
              remove(node);
            }
          };
          const _removeAttribute = function _removeAttribute2(name, node) {
            try {
              arrayPush(DOMPurify2.removed, {
                attribute: node.getAttributeNode(name),
                from: node
              });
            } catch (_) {
              arrayPush(DOMPurify2.removed, {
                attribute: null,
                from: node
              });
            }
            node.removeAttribute(name);
            if (name === "is" && !ALLOWED_ATTR[name]) {
              if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
                try {
                  _forceRemove(node);
                } catch (_) {
                }
              } else {
                try {
                  node.setAttribute(name, "");
                } catch (_) {
                }
              }
            }
          };
          const _initDocument = function _initDocument2(dirty) {
            let doc = null;
            let leadingWhitespace = null;
            if (FORCE_BODY) {
              dirty = "<remove></remove>" + dirty;
            } else {
              const matches = stringMatch(dirty, /^[\r\n\t ]+/);
              leadingWhitespace = matches && matches[0];
            }
            if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
              dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
            }
            const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
            if (NAMESPACE === HTML_NAMESPACE) {
              try {
                doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
              } catch (_) {
              }
            }
            if (!doc || !doc.documentElement) {
              doc = implementation.createDocument(NAMESPACE, "template", null);
              try {
                doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
              } catch (_) {
              }
            }
            const body = doc.body || doc.documentElement;
            if (dirty && leadingWhitespace) {
              body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
            }
            if (NAMESPACE === HTML_NAMESPACE) {
              return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
            }
            return WHOLE_DOCUMENT ? doc.documentElement : body;
          };
          const _createNodeIterator = function _createNodeIterator2(root) {
            return createNodeIterator.call(
              root.ownerDocument || root,
              root,
              // eslint-disable-next-line no-bitwise
              NodeFilter2.SHOW_ELEMENT | NodeFilter2.SHOW_COMMENT | NodeFilter2.SHOW_TEXT | NodeFilter2.SHOW_PROCESSING_INSTRUCTION | NodeFilter2.SHOW_CDATA_SECTION,
              null
            );
          };
          const _isClobbered = function _isClobbered2(elm) {
            return elm instanceof HTMLFormElement && (typeof elm.nodeName !== "string" || typeof elm.textContent !== "string" || typeof elm.removeChild !== "function" || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== "function" || typeof elm.setAttribute !== "function" || typeof elm.namespaceURI !== "string" || typeof elm.insertBefore !== "function" || typeof elm.hasChildNodes !== "function");
          };
          const _isNode = function _isNode2(object) {
            return typeof Node2 === "function" && object instanceof Node2;
          };
          const _executeHook = function _executeHook2(entryPoint, currentNode, data) {
            if (!hooks[entryPoint]) {
              return;
            }
            arrayForEach(hooks[entryPoint], (hook) => {
              hook.call(DOMPurify2, currentNode, data, CONFIG2);
            });
          };
          const _sanitizeElements = function _sanitizeElements2(currentNode) {
            let content = null;
            _executeHook("beforeSanitizeElements", currentNode, null);
            if (_isClobbered(currentNode)) {
              _forceRemove(currentNode);
              return true;
            }
            const tagName = transformCaseFunc(currentNode.nodeName);
            _executeHook("uponSanitizeElement", currentNode, {
              tagName,
              allowedTags: ALLOWED_TAGS
            });
            if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
              _forceRemove(currentNode);
              return true;
            }
            if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
              _forceRemove(currentNode);
              return true;
            }
            if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
              _forceRemove(currentNode);
              return true;
            }
            if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
              if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
                if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
                  return false;
                }
                if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
                  return false;
                }
              }
              if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
                const parentNode = getParentNode(currentNode) || currentNode.parentNode;
                const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
                if (childNodes && parentNode) {
                  const childCount = childNodes.length;
                  for (let i = childCount - 1; i >= 0; --i) {
                    const childClone = cloneNode(childNodes[i], true);
                    childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
                    parentNode.insertBefore(childClone, getNextSibling(currentNode));
                  }
                }
              }
              _forceRemove(currentNode);
              return true;
            }
            if (currentNode instanceof Element2 && !_checkValidNamespace(currentNode)) {
              _forceRemove(currentNode);
              return true;
            }
            if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
              _forceRemove(currentNode);
              return true;
            }
            if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
              content = currentNode.textContent;
              arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
                content = stringReplace(content, expr, " ");
              });
              if (currentNode.textContent !== content) {
                arrayPush(DOMPurify2.removed, {
                  element: currentNode.cloneNode()
                });
                currentNode.textContent = content;
              }
            }
            _executeHook("afterSanitizeElements", currentNode, null);
            return false;
          };
          const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
            if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
              return false;
            }
            if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
            else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
            else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
              if (
                // First condition does a very basic check if a) it's basically a valid custom element tagname AND
                // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
                // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
                _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
                // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
                lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
              ) ;
              else {
                return false;
              }
            } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
            else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
            else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
            else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
            else if (value) {
              return false;
            } else ;
            return true;
          };
          const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
            return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
          };
          const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
            _executeHook("beforeSanitizeAttributes", currentNode, null);
            const {
              attributes
            } = currentNode;
            if (!attributes) {
              return;
            }
            const hookEvent = {
              attrName: "",
              attrValue: "",
              keepAttr: true,
              allowedAttributes: ALLOWED_ATTR
            };
            let l = attributes.length;
            while (l--) {
              const attr = attributes[l];
              const {
                name,
                namespaceURI,
                value: attrValue
              } = attr;
              const lcName = transformCaseFunc(name);
              let value = name === "value" ? attrValue : stringTrim(attrValue);
              hookEvent.attrName = lcName;
              hookEvent.attrValue = value;
              hookEvent.keepAttr = true;
              hookEvent.forceKeepAttr = void 0;
              _executeHook("uponSanitizeAttribute", currentNode, hookEvent);
              value = hookEvent.attrValue;
              if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title)/i, value)) {
                _removeAttribute(name, currentNode);
                continue;
              }
              if (hookEvent.forceKeepAttr) {
                continue;
              }
              _removeAttribute(name, currentNode);
              if (!hookEvent.keepAttr) {
                continue;
              }
              if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
                _removeAttribute(name, currentNode);
                continue;
              }
              if (SAFE_FOR_TEMPLATES) {
                arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
                  value = stringReplace(value, expr, " ");
                });
              }
              const lcTag = transformCaseFunc(currentNode.nodeName);
              if (!_isValidAttribute(lcTag, lcName, value)) {
                continue;
              }
              if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
                _removeAttribute(name, currentNode);
                value = SANITIZE_NAMED_PROPS_PREFIX + value;
              }
              if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
                if (namespaceURI) ;
                else {
                  switch (trustedTypes.getAttributeType(lcTag, lcName)) {
                    case "TrustedHTML": {
                      value = trustedTypesPolicy.createHTML(value);
                      break;
                    }
                    case "TrustedScriptURL": {
                      value = trustedTypesPolicy.createScriptURL(value);
                      break;
                    }
                  }
                }
              }
              try {
                if (namespaceURI) {
                  currentNode.setAttributeNS(namespaceURI, name, value);
                } else {
                  currentNode.setAttribute(name, value);
                }
                if (_isClobbered(currentNode)) {
                  _forceRemove(currentNode);
                } else {
                  arrayPop(DOMPurify2.removed);
                }
              } catch (_) {
              }
            }
            _executeHook("afterSanitizeAttributes", currentNode, null);
          };
          const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
            let shadowNode = null;
            const shadowIterator = _createNodeIterator(fragment);
            _executeHook("beforeSanitizeShadowDOM", fragment, null);
            while (shadowNode = shadowIterator.nextNode()) {
              _executeHook("uponSanitizeShadowNode", shadowNode, null);
              if (_sanitizeElements(shadowNode)) {
                continue;
              }
              if (shadowNode.content instanceof DocumentFragment) {
                _sanitizeShadowDOM2(shadowNode.content);
              }
              _sanitizeAttributes(shadowNode);
            }
            _executeHook("afterSanitizeShadowDOM", fragment, null);
          };
          DOMPurify2.sanitize = function(dirty) {
            let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            let body = null;
            let importedNode = null;
            let currentNode = null;
            let returnNode = null;
            IS_EMPTY_INPUT = !dirty;
            if (IS_EMPTY_INPUT) {
              dirty = "<!-->";
            }
            if (typeof dirty !== "string" && !_isNode(dirty)) {
              if (typeof dirty.toString === "function") {
                dirty = dirty.toString();
                if (typeof dirty !== "string") {
                  throw typeErrorCreate("dirty is not a string, aborting");
                }
              } else {
                throw typeErrorCreate("toString is not a function");
              }
            }
            if (!DOMPurify2.isSupported) {
              return dirty;
            }
            if (!SET_CONFIG) {
              _parseConfig(cfg);
            }
            DOMPurify2.removed = [];
            if (typeof dirty === "string") {
              IN_PLACE = false;
            }
            if (IN_PLACE) {
              if (dirty.nodeName) {
                const tagName = transformCaseFunc(dirty.nodeName);
                if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
                  throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
                }
              }
            } else if (dirty instanceof Node2) {
              body = _initDocument("<!---->");
              importedNode = body.ownerDocument.importNode(dirty, true);
              if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
                body = importedNode;
              } else if (importedNode.nodeName === "HTML") {
                body = importedNode;
              } else {
                body.appendChild(importedNode);
              }
            } else {
              if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
              dirty.indexOf("<") === -1) {
                return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
              }
              body = _initDocument(dirty);
              if (!body) {
                return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
              }
            }
            if (body && FORCE_BODY) {
              _forceRemove(body.firstChild);
            }
            const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
            while (currentNode = nodeIterator.nextNode()) {
              if (_sanitizeElements(currentNode)) {
                continue;
              }
              if (currentNode.content instanceof DocumentFragment) {
                _sanitizeShadowDOM(currentNode.content);
              }
              _sanitizeAttributes(currentNode);
            }
            if (IN_PLACE) {
              return dirty;
            }
            if (RETURN_DOM) {
              if (RETURN_DOM_FRAGMENT) {
                returnNode = createDocumentFragment.call(body.ownerDocument);
                while (body.firstChild) {
                  returnNode.appendChild(body.firstChild);
                }
              } else {
                returnNode = body;
              }
              if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
                returnNode = importNode.call(originalDocument, returnNode, true);
              }
              return returnNode;
            }
            let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
            if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
              serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
            }
            if (SAFE_FOR_TEMPLATES) {
              arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
                serializedHTML = stringReplace(serializedHTML, expr, " ");
              });
            }
            return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
          };
          DOMPurify2.setConfig = function() {
            let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            _parseConfig(cfg);
            SET_CONFIG = true;
          };
          DOMPurify2.clearConfig = function() {
            CONFIG2 = null;
            SET_CONFIG = false;
          };
          DOMPurify2.isValidAttribute = function(tag2, attr, value) {
            if (!CONFIG2) {
              _parseConfig({});
            }
            const lcTag = transformCaseFunc(tag2);
            const lcName = transformCaseFunc(attr);
            return _isValidAttribute(lcTag, lcName, value);
          };
          DOMPurify2.addHook = function(entryPoint, hookFunction) {
            if (typeof hookFunction !== "function") {
              return;
            }
            hooks[entryPoint] = hooks[entryPoint] || [];
            arrayPush(hooks[entryPoint], hookFunction);
          };
          DOMPurify2.removeHook = function(entryPoint) {
            if (hooks[entryPoint]) {
              return arrayPop(hooks[entryPoint]);
            }
          };
          DOMPurify2.removeHooks = function(entryPoint) {
            if (hooks[entryPoint]) {
              hooks[entryPoint] = [];
            }
          };
          DOMPurify2.removeAllHooks = function() {
            hooks = {};
          };
          return DOMPurify2;
        }
        var purify = createDOMPurify();
        return purify;
      });
    }
  });

  // src/content/storage.js
  var META_PREFIX = "siteNotes:meta:";
  var NOTE_PREFIX = "siteNotes:note:";
  var UI_PREFIX = "siteNotes:ui:";
  var LEGACY_PREFIX = "siteNotes:";
  var DEFAULT_UI = { x: null, y: null, w: 300, h: 220, opacity: 0.85, collapsed: false, open: false };
  function getLocal(keys) {
    return chrome.storage.local.get(keys);
  }
  function setLocal(obj) {
    return chrome.storage.local.set(obj);
  }
  function removeLocal(keys) {
    return chrome.storage.local.remove(keys);
  }
  var SYNC_MAX_BYTES = 7168;
  var SYNC_DEBOUNCE = 1500;
  var encoder = new TextEncoder();
  var pendingSync = /* @__PURE__ */ new Map();
  var syncTimer = null;
  function byteLength(str) {
    return encoder.encode(str).length;
  }
  function syncStore() {
    return typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync || null;
  }
  function queueSync(note) {
    if (!syncStore()) return;
    pendingSync.set(note.id, note);
    if (!syncTimer) syncTimer = setTimeout(flushSync, SYNC_DEBOUNCE);
  }
  async function flushSync() {
    syncTimer = null;
    const sync = syncStore();
    const batch = pendingSync;
    pendingSync = /* @__PURE__ */ new Map();
    if (!sync) return;
    const setBatch = {};
    const removeKeys = [];
    for (const [id, note] of batch) {
      if (note.synced) setBatch[NOTE_PREFIX + id] = note;
      else removeKeys.push(NOTE_PREFIX + id);
    }
    try {
      if (Object.keys(setBatch).length) await sync.set(setBatch);
    } catch {
    }
    try {
      if (removeKeys.length) await sync.remove(removeKeys);
    } catch {
    }
  }
  async function flushPendingSync() {
    if (syncTimer) {
      clearTimeout(syncTimer);
      syncTimer = null;
    }
    await flushSync();
  }
  function generateId() {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  function now() {
    return Date.now();
  }
  function isLegacyKey(key) {
    return key.startsWith(LEGACY_PREFIX) && !key.startsWith(META_PREFIX) && !key.startsWith(NOTE_PREFIX) && !key.startsWith(UI_PREFIX);
  }
  async function loadMeta(host) {
    const key = META_PREFIX + host;
    const res = await getLocal(key);
    return res[key] || { defaultColor: null, noteIds: [] };
  }
  async function saveMeta(host, meta) {
    await setLocal({ [META_PREFIX + host]: meta });
    return meta;
  }
  async function loadUI(host) {
    const key = UI_PREFIX + host;
    const res = await getLocal(key);
    return { ...DEFAULT_UI, ...res[key] || {} };
  }
  async function saveUI(host, ui) {
    await setLocal({ [UI_PREFIX + host]: { ...DEFAULT_UI, ...ui } });
    return ui;
  }
  async function migrateHost(host) {
    const legacyKey = LEGACY_PREFIX + host;
    if (!isLegacyKey(legacyKey)) return;
    const res = await getLocal(legacyKey);
    const legacy = res[legacyKey];
    if (!legacy) return;
    const ui = {
      x: legacy.x ?? null,
      y: legacy.y ?? null,
      w: legacy.w ?? DEFAULT_UI.w,
      h: legacy.h ?? DEFAULT_UI.h,
      opacity: legacy.opacity ?? DEFAULT_UI.opacity,
      collapsed: legacy.collapsed ?? false,
      open: legacy.open ?? false
    };
    const noteIds = [];
    const writes = { [UI_PREFIX + host]: ui };
    const text = (legacy.text || "").trim();
    if (text) {
      const id = generateId();
      const ts = now();
      const note = {
        id,
        host,
        scope: "site",
        url: null,
        title: "",
        text: legacy.text,
        color: null,
        createdAt: ts,
        updatedAt: ts,
        synced: true
      };
      noteIds.push(id);
      writes[NOTE_PREFIX + id] = note;
    }
    writes[META_PREFIX + host] = { defaultColor: null, noteIds };
    await setLocal(writes);
    await removeLocal(legacyKey);
  }
  async function mergedNotesMap() {
    const sources = [await getLocal(null)];
    const sync = syncStore();
    if (sync) {
      try {
        sources.push(await sync.get(null));
      } catch {
      }
    }
    const map = /* @__PURE__ */ new Map();
    for (const src of sources) {
      for (const key of Object.keys(src)) {
        if (!key.startsWith(NOTE_PREFIX)) continue;
        const note = src[key];
        if (!note || !note.id) continue;
        const existing = map.get(note.id);
        if (!existing || (note.updatedAt || 0) >= (existing.updatedAt || 0)) {
          map.set(note.id, note);
        }
      }
    }
    return map;
  }
  async function loadNotesForHost(host, href) {
    await migrateHost(host);
    const map = await mergedNotesMap();
    return [...map.values()].filter((n) => n.host === host).filter((n) => n.scope === "site" || n.scope === "url" && n.url === href).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  async function loadAllNotes() {
    const map = await mergedNotesMap();
    return [...map.values()];
  }
  async function saveNote(note) {
    note.updatedAt = now();
    if (!note.createdAt) note.createdAt = note.updatedAt;
    note.synced = byteLength(JSON.stringify(note)) < SYNC_MAX_BYTES;
    await setLocal({ [NOTE_PREFIX + note.id]: note });
    const meta = await loadMeta(note.host);
    if (!meta.noteIds.includes(note.id)) {
      meta.noteIds.push(note.id);
      await saveMeta(note.host, meta);
    }
    queueSync(note);
    return note;
  }
  async function deleteNote(id) {
    const key = NOTE_PREFIX + id;
    pendingSync.delete(id);
    const res = await getLocal(key);
    const note = res[key];
    await removeLocal(key);
    const sync = syncStore();
    if (sync) {
      try {
        await sync.remove(key);
      } catch {
      }
    }
    if (note) {
      const meta = await loadMeta(note.host);
      meta.noteIds = meta.noteIds.filter((x) => x !== id);
      await saveMeta(note.host, meta);
    }
  }
  async function deleteNotesForHost(host) {
    const meta = await loadMeta(host);
    const all = await loadAllNotes();
    const ids = new Set(meta.noteIds);
    for (const n of all) if (n.host === host) ids.add(n.id);
    for (const id of ids) await deleteNote(id);
    return ids.size;
  }
  function metaMapFromKeys(all, hostFilter) {
    const meta = {};
    for (const key of Object.keys(all)) {
      if (!key.startsWith(META_PREFIX)) continue;
      const host = key.slice(META_PREFIX.length);
      if (hostFilter && host !== hostFilter) continue;
      meta[host] = all[key];
    }
    return meta;
  }
  async function exportAllJSON() {
    const all = await getLocal(null);
    const notes = Object.keys(all).filter((k) => k.startsWith(NOTE_PREFIX)).map((k) => all[k]);
    return {
      version: 2,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      notes,
      meta: metaMapFromKeys(all)
    };
  }
  async function exportSiteJSON(host) {
    const all = await getLocal(null);
    const notes = Object.keys(all).filter((k) => k.startsWith(NOTE_PREFIX)).map((k) => all[k]).filter((n) => n.host === host);
    return {
      version: 2,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      notes,
      meta: metaMapFromKeys(all, host)
    };
  }
  async function importFromJSON(data) {
    if (!data || data.version !== 2) {
      throw new Error("Unsupported file format (expected Site Notes export version 2).");
    }
    const all = await getLocal(null);
    const preExistingMetaHosts = new Set(
      Object.keys(all).filter((k) => k.startsWith(META_PREFIX)).map((k) => k.slice(META_PREFIX.length))
    );
    let added = 0;
    let skipped = 0;
    for (const note of data.notes || []) {
      if (!note || !note.id || !note.host) {
        skipped++;
        continue;
      }
      const key = NOTE_PREFIX + note.id;
      const existing = (await getLocal(key))[key];
      if (existing) {
        skipped++;
        continue;
      }
      await setLocal({ [key]: note });
      const meta = await loadMeta(note.host);
      if (!meta.noteIds.includes(note.id)) meta.noteIds.push(note.id);
      await saveMeta(note.host, meta);
      added++;
    }
    for (const [host, m] of Object.entries(data.meta || {})) {
      if (preExistingMetaHosts.has(host)) continue;
      const cur = await loadMeta(host);
      if (cur.defaultColor == null && m && m.defaultColor != null) {
        cur.defaultColor = m.defaultColor;
        await saveMeta(host, cur);
      }
    }
    return { added, skipped };
  }

  // src/content/theme.js
  var COLORS = [
    { id: "neutral", label: "Neutral", light: "transparent", dark: "transparent" },
    { id: "yellow", label: "Yellow", light: "#fff7cc", dark: "#3d3400" },
    { id: "blue", label: "Blue", light: "#e2ecff", dark: "#0d2a4a" },
    { id: "green", label: "Green", light: "#dcf3e3", dark: "#0d2e1a" },
    { id: "pink", label: "Pink", light: "#fbe0ec", dark: "#3d0a22" },
    { id: "purple", label: "Purple", light: "#ece2fb", dark: "#1e0d3d" }
  ];
  var BY_ID = Object.fromEntries(COLORS.map((c) => [c.id, c]));
  function prefersDark() {
    return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function colorValue(colorId) {
    const c = BY_ID[colorId] || BY_ID.neutral;
    return prefersDark() ? c.dark : c.light;
  }
  function applyNoteColor(cardEl, colorId) {
    cardEl.style.setProperty("--sn-note-color", colorValue(colorId || "neutral"));
  }
  var subscribers = /* @__PURE__ */ new Set();
  var wired = false;
  function initTheme() {
    if (wired || typeof matchMedia !== "function") return;
    wired = true;
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      for (const fn of [...subscribers]) fn();
    });
  }
  function onSchemeChange(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  // node_modules/marked/lib/marked.esm.js
  function _getDefaults() {
    return {
      async: false,
      breaks: false,
      extensions: null,
      gfm: true,
      hooks: null,
      pedantic: false,
      renderer: null,
      silent: false,
      tokenizer: null,
      walkTokens: null
    };
  }
  var _defaults = _getDefaults();
  function changeDefaults(newDefaults) {
    _defaults = newDefaults;
  }
  var escapeTest = /[&<>"']/;
  var escapeReplace = new RegExp(escapeTest.source, "g");
  var escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
  var escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
  var escapeReplacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  var getEscapeReplacement = (ch) => escapeReplacements[ch];
  function escape$1(html2, encode) {
    if (encode) {
      if (escapeTest.test(html2)) {
        return html2.replace(escapeReplace, getEscapeReplacement);
      }
    } else {
      if (escapeTestNoEncode.test(html2)) {
        return html2.replace(escapeReplaceNoEncode, getEscapeReplacement);
      }
    }
    return html2;
  }
  var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
  function unescape(html2) {
    return html2.replace(unescapeTest, (_, n) => {
      n = n.toLowerCase();
      if (n === "colon")
        return ":";
      if (n.charAt(0) === "#") {
        return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
      }
      return "";
    });
  }
  var caret = /(^|[^\[])\^/g;
  function edit(regex, opt) {
    let source = typeof regex === "string" ? regex : regex.source;
    opt = opt || "";
    const obj = {
      replace: (name, val) => {
        let valSource = typeof val === "string" ? val : val.source;
        valSource = valSource.replace(caret, "$1");
        source = source.replace(name, valSource);
        return obj;
      },
      getRegex: () => {
        return new RegExp(source, opt);
      }
    };
    return obj;
  }
  function cleanUrl(href) {
    try {
      href = encodeURI(href).replace(/%25/g, "%");
    } catch (e) {
      return null;
    }
    return href;
  }
  var noopTest = { exec: () => null };
  function splitCells(tableRow, count) {
    const row = tableRow.replace(/\|/g, (match, offset, str) => {
      let escaped = false;
      let curr = offset;
      while (--curr >= 0 && str[curr] === "\\")
        escaped = !escaped;
      if (escaped) {
        return "|";
      } else {
        return " |";
      }
    }), cells = row.split(/ \|/);
    let i = 0;
    if (!cells[0].trim()) {
      cells.shift();
    }
    if (cells.length > 0 && !cells[cells.length - 1].trim()) {
      cells.pop();
    }
    if (count) {
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count)
          cells.push("");
      }
    }
    for (; i < cells.length; i++) {
      cells[i] = cells[i].trim().replace(/\\\|/g, "|");
    }
    return cells;
  }
  function rtrim(str, c, invert) {
    const l = str.length;
    if (l === 0) {
      return "";
    }
    let suffLen = 0;
    while (suffLen < l) {
      const currChar = str.charAt(l - suffLen - 1);
      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }
    return str.slice(0, l - suffLen);
  }
  function findClosingBracket(str, b) {
    if (str.indexOf(b[1]) === -1) {
      return -1;
    }
    let level = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "\\") {
        i++;
      } else if (str[i] === b[0]) {
        level++;
      } else if (str[i] === b[1]) {
        level--;
        if (level < 0) {
          return i;
        }
      }
    }
    return -1;
  }
  function outputLink(cap, link2, raw, lexer2) {
    const href = link2.href;
    const title = link2.title ? escape$1(link2.title) : null;
    const text = cap[1].replace(/\\([\[\]])/g, "$1");
    if (cap[0].charAt(0) !== "!") {
      lexer2.state.inLink = true;
      const token = {
        type: "link",
        raw,
        href,
        title,
        text,
        tokens: lexer2.inlineTokens(text)
      };
      lexer2.state.inLink = false;
      return token;
    }
    return {
      type: "image",
      raw,
      href,
      title,
      text: escape$1(text)
    };
  }
  function indentCodeCompensation(raw, text) {
    const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
    if (matchIndentToCode === null) {
      return text;
    }
    const indentToCode = matchIndentToCode[1];
    return text.split("\n").map((node) => {
      const matchIndentInNode = node.match(/^\s+/);
      if (matchIndentInNode === null) {
        return node;
      }
      const [indentInNode] = matchIndentInNode;
      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }
      return node;
    }).join("\n");
  }
  var _Tokenizer = class {
    options;
    rules;
    // set by the lexer
    lexer;
    // set by the lexer
    constructor(options2) {
      this.options = options2 || _defaults;
    }
    space(src) {
      const cap = this.rules.block.newline.exec(src);
      if (cap && cap[0].length > 0) {
        return {
          type: "space",
          raw: cap[0]
        };
      }
    }
    code(src) {
      const cap = this.rules.block.code.exec(src);
      if (cap) {
        const text = cap[0].replace(/^ {1,4}/gm, "");
        return {
          type: "code",
          raw: cap[0],
          codeBlockStyle: "indented",
          text: !this.options.pedantic ? rtrim(text, "\n") : text
        };
      }
    }
    fences(src) {
      const cap = this.rules.block.fences.exec(src);
      if (cap) {
        const raw = cap[0];
        const text = indentCodeCompensation(raw, cap[3] || "");
        return {
          type: "code",
          raw,
          lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
          text
        };
      }
    }
    heading(src) {
      const cap = this.rules.block.heading.exec(src);
      if (cap) {
        let text = cap[2].trim();
        if (/#$/.test(text)) {
          const trimmed = rtrim(text, "#");
          if (this.options.pedantic) {
            text = trimmed.trim();
          } else if (!trimmed || / $/.test(trimmed)) {
            text = trimmed.trim();
          }
        }
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[1].length,
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    hr(src) {
      const cap = this.rules.block.hr.exec(src);
      if (cap) {
        return {
          type: "hr",
          raw: cap[0]
        };
      }
    }
    blockquote(src) {
      const cap = this.rules.block.blockquote.exec(src);
      if (cap) {
        let text = cap[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, "\n    $1");
        text = rtrim(text.replace(/^ *>[ \t]?/gm, ""), "\n");
        const top = this.lexer.state.top;
        this.lexer.state.top = true;
        const tokens = this.lexer.blockTokens(text);
        this.lexer.state.top = top;
        return {
          type: "blockquote",
          raw: cap[0],
          tokens,
          text
        };
      }
    }
    list(src) {
      let cap = this.rules.block.list.exec(src);
      if (cap) {
        let bull = cap[1].trim();
        const isordered = bull.length > 1;
        const list2 = {
          type: "list",
          raw: "",
          ordered: isordered,
          start: isordered ? +bull.slice(0, -1) : "",
          loose: false,
          items: []
        };
        bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
        if (this.options.pedantic) {
          bull = isordered ? bull : "[*+-]";
        }
        const itemRegex = new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`);
        let raw = "";
        let itemContents = "";
        let endsWithBlankLine = false;
        while (src) {
          let endEarly = false;
          if (!(cap = itemRegex.exec(src))) {
            break;
          }
          if (this.rules.block.hr.test(src)) {
            break;
          }
          raw = cap[0];
          src = src.substring(raw.length);
          let line = cap[2].split("\n", 1)[0].replace(/^\t+/, (t) => " ".repeat(3 * t.length));
          let nextLine = src.split("\n", 1)[0];
          let indent = 0;
          if (this.options.pedantic) {
            indent = 2;
            itemContents = line.trimStart();
          } else {
            indent = cap[2].search(/[^ ]/);
            indent = indent > 4 ? 1 : indent;
            itemContents = line.slice(indent);
            indent += cap[1].length;
          }
          let blankLine = false;
          if (!line && /^ *$/.test(nextLine)) {
            raw += nextLine + "\n";
            src = src.substring(nextLine.length + 1);
            endEarly = true;
          }
          if (!endEarly) {
            const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`);
            const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
            const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
            const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
            while (src) {
              const rawLine = src.split("\n", 1)[0];
              nextLine = rawLine;
              if (this.options.pedantic) {
                nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
              }
              if (fencesBeginRegex.test(nextLine)) {
                break;
              }
              if (headingBeginRegex.test(nextLine)) {
                break;
              }
              if (nextBulletRegex.test(nextLine)) {
                break;
              }
              if (hrRegex.test(src)) {
                break;
              }
              if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) {
                itemContents += "\n" + nextLine.slice(indent);
              } else {
                if (blankLine) {
                  break;
                }
                if (line.search(/[^ ]/) >= 4) {
                  break;
                }
                if (fencesBeginRegex.test(line)) {
                  break;
                }
                if (headingBeginRegex.test(line)) {
                  break;
                }
                if (hrRegex.test(line)) {
                  break;
                }
                itemContents += "\n" + nextLine;
              }
              if (!blankLine && !nextLine.trim()) {
                blankLine = true;
              }
              raw += rawLine + "\n";
              src = src.substring(rawLine.length + 1);
              line = nextLine.slice(indent);
            }
          }
          if (!list2.loose) {
            if (endsWithBlankLine) {
              list2.loose = true;
            } else if (/\n *\n *$/.test(raw)) {
              endsWithBlankLine = true;
            }
          }
          let istask = null;
          let ischecked;
          if (this.options.gfm) {
            istask = /^\[[ xX]\] /.exec(itemContents);
            if (istask) {
              ischecked = istask[0] !== "[ ] ";
              itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
            }
          }
          list2.items.push({
            type: "list_item",
            raw,
            task: !!istask,
            checked: ischecked,
            loose: false,
            text: itemContents,
            tokens: []
          });
          list2.raw += raw;
        }
        list2.items[list2.items.length - 1].raw = raw.trimEnd();
        list2.items[list2.items.length - 1].text = itemContents.trimEnd();
        list2.raw = list2.raw.trimEnd();
        for (let i = 0; i < list2.items.length; i++) {
          this.lexer.state.top = false;
          list2.items[i].tokens = this.lexer.blockTokens(list2.items[i].text, []);
          if (!list2.loose) {
            const spacers = list2.items[i].tokens.filter((t) => t.type === "space");
            const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t) => /\n.*\n/.test(t.raw));
            list2.loose = hasMultipleLineBreaks;
          }
        }
        if (list2.loose) {
          for (let i = 0; i < list2.items.length; i++) {
            list2.items[i].loose = true;
          }
        }
        return list2;
      }
    }
    html(src) {
      const cap = this.rules.block.html.exec(src);
      if (cap) {
        const token = {
          type: "html",
          block: true,
          raw: cap[0],
          pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
          text: cap[0]
        };
        return token;
      }
    }
    def(src) {
      const cap = this.rules.block.def.exec(src);
      if (cap) {
        const tag2 = cap[1].toLowerCase().replace(/\s+/g, " ");
        const href = cap[2] ? cap[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
        const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
        return {
          type: "def",
          tag: tag2,
          raw: cap[0],
          href,
          title
        };
      }
    }
    table(src) {
      const cap = this.rules.block.table.exec(src);
      if (!cap) {
        return;
      }
      if (!/[:|]/.test(cap[2])) {
        return;
      }
      const headers = splitCells(cap[1]);
      const aligns = cap[2].replace(/^\||\| *$/g, "").split("|");
      const rows = cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : [];
      const item = {
        type: "table",
        raw: cap[0],
        header: [],
        align: [],
        rows: []
      };
      if (headers.length !== aligns.length) {
        return;
      }
      for (const align of aligns) {
        if (/^ *-+: *$/.test(align)) {
          item.align.push("right");
        } else if (/^ *:-+: *$/.test(align)) {
          item.align.push("center");
        } else if (/^ *:-+ *$/.test(align)) {
          item.align.push("left");
        } else {
          item.align.push(null);
        }
      }
      for (const header of headers) {
        item.header.push({
          text: header,
          tokens: this.lexer.inline(header)
        });
      }
      for (const row of rows) {
        item.rows.push(splitCells(row, item.header.length).map((cell) => {
          return {
            text: cell,
            tokens: this.lexer.inline(cell)
          };
        }));
      }
      return item;
    }
    lheading(src) {
      const cap = this.rules.block.lheading.exec(src);
      if (cap) {
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[2].charAt(0) === "=" ? 1 : 2,
          text: cap[1],
          tokens: this.lexer.inline(cap[1])
        };
      }
    }
    paragraph(src) {
      const cap = this.rules.block.paragraph.exec(src);
      if (cap) {
        const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
        return {
          type: "paragraph",
          raw: cap[0],
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    text(src) {
      const cap = this.rules.block.text.exec(src);
      if (cap) {
        return {
          type: "text",
          raw: cap[0],
          text: cap[0],
          tokens: this.lexer.inline(cap[0])
        };
      }
    }
    escape(src) {
      const cap = this.rules.inline.escape.exec(src);
      if (cap) {
        return {
          type: "escape",
          raw: cap[0],
          text: escape$1(cap[1])
        };
      }
    }
    tag(src) {
      const cap = this.rules.inline.tag.exec(src);
      if (cap) {
        if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
          this.lexer.state.inLink = true;
        } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
          this.lexer.state.inLink = false;
        }
        if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = true;
        } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = false;
        }
        return {
          type: "html",
          raw: cap[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          block: false,
          text: cap[0]
        };
      }
    }
    link(src) {
      const cap = this.rules.inline.link.exec(src);
      if (cap) {
        const trimmedUrl = cap[2].trim();
        if (!this.options.pedantic && /^</.test(trimmedUrl)) {
          if (!/>$/.test(trimmedUrl)) {
            return;
          }
          const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
          if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
            return;
          }
        } else {
          const lastParenIndex = findClosingBracket(cap[2], "()");
          if (lastParenIndex > -1) {
            const start = cap[0].indexOf("!") === 0 ? 5 : 4;
            const linkLen = start + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = "";
          }
        }
        let href = cap[2];
        let title = "";
        if (this.options.pedantic) {
          const link2 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
          if (link2) {
            href = link2[1];
            title = link2[3];
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : "";
        }
        href = href.trim();
        if (/^</.test(href)) {
          if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
            href = href.slice(1);
          } else {
            href = href.slice(1, -1);
          }
        }
        return outputLink(cap, {
          href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
          title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
        }, cap[0], this.lexer);
      }
    }
    reflink(src, links) {
      let cap;
      if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
        const linkString = (cap[2] || cap[1]).replace(/\s+/g, " ");
        const link2 = links[linkString.toLowerCase()];
        if (!link2) {
          const text = cap[0].charAt(0);
          return {
            type: "text",
            raw: text,
            text
          };
        }
        return outputLink(cap, link2, cap[0], this.lexer);
      }
    }
    emStrong(src, maskedSrc, prevChar = "") {
      let match = this.rules.inline.emStrongLDelim.exec(src);
      if (!match)
        return;
      if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
        return;
      const nextChar = match[1] || match[2] || "";
      if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
        const lLength = [...match[0]].length - 1;
        let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
        const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        endReg.lastIndex = 0;
        maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
        while ((match = endReg.exec(maskedSrc)) != null) {
          rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
          if (!rDelim)
            continue;
          rLength = [...rDelim].length;
          if (match[3] || match[4]) {
            delimTotal += rLength;
            continue;
          } else if (match[5] || match[6]) {
            if (lLength % 3 && !((lLength + rLength) % 3)) {
              midDelimTotal += rLength;
              continue;
            }
          }
          delimTotal -= rLength;
          if (delimTotal > 0)
            continue;
          rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
          const lastCharLength = [...match[0]][0].length;
          const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
          if (Math.min(lLength, rLength) % 2) {
            const text2 = raw.slice(1, -1);
            return {
              type: "em",
              raw,
              text: text2,
              tokens: this.lexer.inlineTokens(text2)
            };
          }
          const text = raw.slice(2, -2);
          return {
            type: "strong",
            raw,
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }
      }
    }
    codespan(src) {
      const cap = this.rules.inline.code.exec(src);
      if (cap) {
        let text = cap[2].replace(/\n/g, " ");
        const hasNonSpaceChars = /[^ ]/.test(text);
        const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
        if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
          text = text.substring(1, text.length - 1);
        }
        text = escape$1(text, true);
        return {
          type: "codespan",
          raw: cap[0],
          text
        };
      }
    }
    br(src) {
      const cap = this.rules.inline.br.exec(src);
      if (cap) {
        return {
          type: "br",
          raw: cap[0]
        };
      }
    }
    del(src) {
      const cap = this.rules.inline.del.exec(src);
      if (cap) {
        return {
          type: "del",
          raw: cap[0],
          text: cap[2],
          tokens: this.lexer.inlineTokens(cap[2])
        };
      }
    }
    autolink(src) {
      const cap = this.rules.inline.autolink.exec(src);
      if (cap) {
        let text, href;
        if (cap[2] === "@") {
          text = escape$1(cap[1]);
          href = "mailto:" + text;
        } else {
          text = escape$1(cap[1]);
          href = text;
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    url(src) {
      let cap;
      if (cap = this.rules.inline.url.exec(src)) {
        let text, href;
        if (cap[2] === "@") {
          text = escape$1(cap[0]);
          href = "mailto:" + text;
        } else {
          let prevCapZero;
          do {
            prevCapZero = cap[0];
            cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
          } while (prevCapZero !== cap[0]);
          text = escape$1(cap[0]);
          if (cap[1] === "www.") {
            href = "http://" + cap[0];
          } else {
            href = cap[0];
          }
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    inlineText(src) {
      const cap = this.rules.inline.text.exec(src);
      if (cap) {
        let text;
        if (this.lexer.state.inRawBlock) {
          text = cap[0];
        } else {
          text = escape$1(cap[0]);
        }
        return {
          type: "text",
          raw: cap[0],
          text
        };
      }
    }
  };
  var newline = /^(?: *(?:\n|$))+/;
  var blockCode = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/;
  var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var bullet = /(?:[*+-]|\d{1,9}[.)])/;
  var lheading = edit(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, bullet).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex();
  var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  var blockText = /^[^\n]+/;
  var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
  var def = edit(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
  var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var html = edit("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  var blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
  var blockNormal = {
    blockquote,
    code: blockCode,
    def,
    fences,
    heading,
    hr,
    html,
    lheading,
    list,
    newline,
    paragraph,
    table: noopTest,
    text: blockText
  };
  var gfmTable = edit("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  var blockGfm = {
    ...blockNormal,
    table: gfmTable,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
  };
  var blockPedantic = {
    ...blockNormal,
    html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    // fences not supported
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
  };
  var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var br = /^( {2,}|\\)\n(?!\s*$)/;
  var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var _punctuation = "\\p{P}\\p{S}";
  var punctuation = edit(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, _punctuation).getRegex();
  var blockSkip = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g;
  var emStrongLDelim = edit(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, _punctuation).getRegex();
  var emStrongRDelimAst = edit("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, _punctuation).getRegex();
  var emStrongRDelimUnd = edit("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, _punctuation).getRegex();
  var anyPunctuation = edit(/\\([punct])/, "gu").replace(/punct/g, _punctuation).getRegex();
  var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
  var tag = edit("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  var link = edit(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
  var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
  var reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
  var inlineNormal = {
    _backpedal: noopTest,
    // only used for GFM url
    anyPunctuation,
    autolink,
    blockSkip,
    br,
    code: inlineCode,
    del: noopTest,
    emStrongLDelim,
    emStrongRDelimAst,
    emStrongRDelimUnd,
    escape,
    link,
    nolink,
    punctuation,
    reflink,
    reflinkSearch,
    tag,
    text: inlineText,
    url: noopTest
  };
  var inlinePedantic = {
    ...inlineNormal,
    link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
  };
  var inlineGfm = {
    ...inlineNormal,
    escape: edit(escape).replace("])", "~|])").getRegex(),
    url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  };
  var inlineBreaks = {
    ...inlineGfm,
    br: edit(br).replace("{2,}", "*").getRegex(),
    text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  };
  var block = {
    normal: blockNormal,
    gfm: blockGfm,
    pedantic: blockPedantic
  };
  var inline = {
    normal: inlineNormal,
    gfm: inlineGfm,
    breaks: inlineBreaks,
    pedantic: inlinePedantic
  };
  var _Lexer = class __Lexer {
    tokens;
    options;
    state;
    tokenizer;
    inlineQueue;
    constructor(options2) {
      this.tokens = [];
      this.tokens.links = /* @__PURE__ */ Object.create(null);
      this.options = options2 || _defaults;
      this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      this.tokenizer.lexer = this;
      this.inlineQueue = [];
      this.state = {
        inLink: false,
        inRawBlock: false,
        top: true
      };
      const rules = {
        block: block.normal,
        inline: inline.normal
      };
      if (this.options.pedantic) {
        rules.block = block.pedantic;
        rules.inline = inline.pedantic;
      } else if (this.options.gfm) {
        rules.block = block.gfm;
        if (this.options.breaks) {
          rules.inline = inline.breaks;
        } else {
          rules.inline = inline.gfm;
        }
      }
      this.tokenizer.rules = rules;
    }
    /**
     * Expose Rules
     */
    static get rules() {
      return {
        block,
        inline
      };
    }
    /**
     * Static Lex Method
     */
    static lex(src, options2) {
      const lexer2 = new __Lexer(options2);
      return lexer2.lex(src);
    }
    /**
     * Static Lex Inline Method
     */
    static lexInline(src, options2) {
      const lexer2 = new __Lexer(options2);
      return lexer2.inlineTokens(src);
    }
    /**
     * Preprocessing
     */
    lex(src) {
      src = src.replace(/\r\n|\r/g, "\n");
      this.blockTokens(src, this.tokens);
      for (let i = 0; i < this.inlineQueue.length; i++) {
        const next = this.inlineQueue[i];
        this.inlineTokens(next.src, next.tokens);
      }
      this.inlineQueue = [];
      return this.tokens;
    }
    blockTokens(src, tokens = []) {
      if (this.options.pedantic) {
        src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
      } else {
        src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
          return leading + "    ".repeat(tabs.length);
        });
      }
      let token;
      let lastToken;
      let cutSrc;
      let lastParagraphClipped;
      while (src) {
        if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.space(src)) {
          src = src.substring(token.raw.length);
          if (token.raw.length === 1 && tokens.length > 0) {
            tokens[tokens.length - 1].raw += "\n";
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.code(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.fences(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.heading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.hr(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.blockquote(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.list(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.html(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.def(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.raw;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else if (!this.tokens.links[token.tag]) {
            this.tokens.links[token.tag] = {
              href: token.href,
              title: token.title
            };
          }
          continue;
        }
        if (token = this.tokenizer.table(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.lheading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        cutSrc = src;
        if (this.options.extensions && this.options.extensions.startBlock) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startBlock.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
          lastToken = tokens[tokens.length - 1];
          if (lastParagraphClipped && lastToken.type === "paragraph") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          lastParagraphClipped = cutSrc.length !== src.length;
          src = src.substring(token.raw.length);
          continue;
        }
        if (token = this.tokenizer.text(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      this.state.top = true;
      return tokens;
    }
    inline(src, tokens = []) {
      this.inlineQueue.push({ src, tokens });
      return tokens;
    }
    /**
     * Lexing/Compiling
     */
    inlineTokens(src, tokens = []) {
      let token, lastToken, cutSrc;
      let maskedSrc = src;
      let match;
      let keepPrevChar, prevChar;
      if (this.tokens.links) {
        const links = Object.keys(this.tokens.links);
        if (links.length > 0) {
          while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
            if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
              maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
            }
          }
        }
      }
      while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      }
      while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      }
      while (src) {
        if (!keepPrevChar) {
          prevChar = "";
        }
        keepPrevChar = false;
        if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.escape(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.tag(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && token.type === "text" && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.link(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.reflink(src, this.tokens.links)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && token.type === "text" && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.codespan(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.br(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.del(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.autolink(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (!this.state.inLink && (token = this.tokenizer.url(src))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        cutSrc = src;
        if (this.options.extensions && this.options.extensions.startInline) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startInline.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (token = this.tokenizer.inlineText(cutSrc)) {
          src = src.substring(token.raw.length);
          if (token.raw.slice(-1) !== "_") {
            prevChar = token.raw.slice(-1);
          }
          keepPrevChar = true;
          lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      return tokens;
    }
  };
  var _Renderer = class {
    options;
    constructor(options2) {
      this.options = options2 || _defaults;
    }
    code(code, infostring, escaped) {
      const lang = (infostring || "").match(/^\S*/)?.[0];
      code = code.replace(/\n$/, "") + "\n";
      if (!lang) {
        return "<pre><code>" + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
      }
      return '<pre><code class="language-' + escape$1(lang) + '">' + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
    }
    blockquote(quote) {
      return `<blockquote>
${quote}</blockquote>
`;
    }
    html(html2, block2) {
      return html2;
    }
    heading(text, level, raw) {
      return `<h${level}>${text}</h${level}>
`;
    }
    hr() {
      return "<hr>\n";
    }
    list(body, ordered, start) {
      const type = ordered ? "ol" : "ul";
      const startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
      return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
    }
    listitem(text, task, checked) {
      return `<li>${text}</li>
`;
    }
    checkbox(checked) {
      return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
    }
    paragraph(text) {
      return `<p>${text}</p>
`;
    }
    table(header, body) {
      if (body)
        body = `<tbody>${body}</tbody>`;
      return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
    }
    tablerow(content) {
      return `<tr>
${content}</tr>
`;
    }
    tablecell(content, flags) {
      const type = flags.header ? "th" : "td";
      const tag2 = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
      return tag2 + content + `</${type}>
`;
    }
    /**
     * span level renderer
     */
    strong(text) {
      return `<strong>${text}</strong>`;
    }
    em(text) {
      return `<em>${text}</em>`;
    }
    codespan(text) {
      return `<code>${text}</code>`;
    }
    br() {
      return "<br>";
    }
    del(text) {
      return `<del>${text}</del>`;
    }
    link(href, title, text) {
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += ">" + text + "</a>";
      return out;
    }
    image(href, title, text) {
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = `<img src="${href}" alt="${text}"`;
      if (title) {
        out += ` title="${title}"`;
      }
      out += ">";
      return out;
    }
    text(text) {
      return text;
    }
  };
  var _TextRenderer = class {
    // no need for block level renderers
    strong(text) {
      return text;
    }
    em(text) {
      return text;
    }
    codespan(text) {
      return text;
    }
    del(text) {
      return text;
    }
    html(text) {
      return text;
    }
    text(text) {
      return text;
    }
    link(href, title, text) {
      return "" + text;
    }
    image(href, title, text) {
      return "" + text;
    }
    br() {
      return "";
    }
  };
  var _Parser = class __Parser {
    options;
    renderer;
    textRenderer;
    constructor(options2) {
      this.options = options2 || _defaults;
      this.options.renderer = this.options.renderer || new _Renderer();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.textRenderer = new _TextRenderer();
    }
    /**
     * Static Parse Method
     */
    static parse(tokens, options2) {
      const parser2 = new __Parser(options2);
      return parser2.parse(tokens);
    }
    /**
     * Static Parse Inline Method
     */
    static parseInline(tokens, options2) {
      const parser2 = new __Parser(options2);
      return parser2.parseInline(tokens);
    }
    /**
     * Parse Loop
     */
    parse(tokens, top = true) {
      let out = "";
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
          const genericToken = token;
          const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
          if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
            out += ret || "";
            continue;
          }
        }
        switch (token.type) {
          case "space": {
            continue;
          }
          case "hr": {
            out += this.renderer.hr();
            continue;
          }
          case "heading": {
            const headingToken = token;
            out += this.renderer.heading(this.parseInline(headingToken.tokens), headingToken.depth, unescape(this.parseInline(headingToken.tokens, this.textRenderer)));
            continue;
          }
          case "code": {
            const codeToken = token;
            out += this.renderer.code(codeToken.text, codeToken.lang, !!codeToken.escaped);
            continue;
          }
          case "table": {
            const tableToken = token;
            let header = "";
            let cell = "";
            for (let j = 0; j < tableToken.header.length; j++) {
              cell += this.renderer.tablecell(this.parseInline(tableToken.header[j].tokens), { header: true, align: tableToken.align[j] });
            }
            header += this.renderer.tablerow(cell);
            let body = "";
            for (let j = 0; j < tableToken.rows.length; j++) {
              const row = tableToken.rows[j];
              cell = "";
              for (let k = 0; k < row.length; k++) {
                cell += this.renderer.tablecell(this.parseInline(row[k].tokens), { header: false, align: tableToken.align[k] });
              }
              body += this.renderer.tablerow(cell);
            }
            out += this.renderer.table(header, body);
            continue;
          }
          case "blockquote": {
            const blockquoteToken = token;
            const body = this.parse(blockquoteToken.tokens);
            out += this.renderer.blockquote(body);
            continue;
          }
          case "list": {
            const listToken = token;
            const ordered = listToken.ordered;
            const start = listToken.start;
            const loose = listToken.loose;
            let body = "";
            for (let j = 0; j < listToken.items.length; j++) {
              const item = listToken.items[j];
              const checked = item.checked;
              const task = item.task;
              let itemBody = "";
              if (item.task) {
                const checkbox = this.renderer.checkbox(!!checked);
                if (loose) {
                  if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                    item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                    if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                      item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                    }
                  } else {
                    item.tokens.unshift({
                      type: "text",
                      text: checkbox + " "
                    });
                  }
                } else {
                  itemBody += checkbox + " ";
                }
              }
              itemBody += this.parse(item.tokens, loose);
              body += this.renderer.listitem(itemBody, task, !!checked);
            }
            out += this.renderer.list(body, ordered, start);
            continue;
          }
          case "html": {
            const htmlToken = token;
            out += this.renderer.html(htmlToken.text, htmlToken.block);
            continue;
          }
          case "paragraph": {
            const paragraphToken = token;
            out += this.renderer.paragraph(this.parseInline(paragraphToken.tokens));
            continue;
          }
          case "text": {
            let textToken = token;
            let body = textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text;
            while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
              textToken = tokens[++i];
              body += "\n" + (textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text);
            }
            out += top ? this.renderer.paragraph(body) : body;
            continue;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
    /**
     * Parse Inline Tokens
     */
    parseInline(tokens, renderer) {
      renderer = renderer || this.renderer;
      let out = "";
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
          const ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
          if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
            out += ret || "";
            continue;
          }
        }
        switch (token.type) {
          case "escape": {
            const escapeToken = token;
            out += renderer.text(escapeToken.text);
            break;
          }
          case "html": {
            const tagToken = token;
            out += renderer.html(tagToken.text);
            break;
          }
          case "link": {
            const linkToken = token;
            out += renderer.link(linkToken.href, linkToken.title, this.parseInline(linkToken.tokens, renderer));
            break;
          }
          case "image": {
            const imageToken = token;
            out += renderer.image(imageToken.href, imageToken.title, imageToken.text);
            break;
          }
          case "strong": {
            const strongToken = token;
            out += renderer.strong(this.parseInline(strongToken.tokens, renderer));
            break;
          }
          case "em": {
            const emToken = token;
            out += renderer.em(this.parseInline(emToken.tokens, renderer));
            break;
          }
          case "codespan": {
            const codespanToken = token;
            out += renderer.codespan(codespanToken.text);
            break;
          }
          case "br": {
            out += renderer.br();
            break;
          }
          case "del": {
            const delToken = token;
            out += renderer.del(this.parseInline(delToken.tokens, renderer));
            break;
          }
          case "text": {
            const textToken = token;
            out += renderer.text(textToken.text);
            break;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
  };
  var _Hooks = class {
    options;
    constructor(options2) {
      this.options = options2 || _defaults;
    }
    static passThroughHooks = /* @__PURE__ */ new Set([
      "preprocess",
      "postprocess",
      "processAllTokens"
    ]);
    /**
     * Process markdown before marked
     */
    preprocess(markdown) {
      return markdown;
    }
    /**
     * Process HTML after marked is finished
     */
    postprocess(html2) {
      return html2;
    }
    /**
     * Process all tokens before walk tokens
     */
    processAllTokens(tokens) {
      return tokens;
    }
  };
  var Marked = class {
    defaults = _getDefaults();
    options = this.setOptions;
    parse = this.#parseMarkdown(_Lexer.lex, _Parser.parse);
    parseInline = this.#parseMarkdown(_Lexer.lexInline, _Parser.parseInline);
    Parser = _Parser;
    Renderer = _Renderer;
    TextRenderer = _TextRenderer;
    Lexer = _Lexer;
    Tokenizer = _Tokenizer;
    Hooks = _Hooks;
    constructor(...args) {
      this.use(...args);
    }
    /**
     * Run callback for every token
     */
    walkTokens(tokens, callback) {
      let values = [];
      for (const token of tokens) {
        values = values.concat(callback.call(this, token));
        switch (token.type) {
          case "table": {
            const tableToken = token;
            for (const cell of tableToken.header) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
            for (const row of tableToken.rows) {
              for (const cell of row) {
                values = values.concat(this.walkTokens(cell.tokens, callback));
              }
            }
            break;
          }
          case "list": {
            const listToken = token;
            values = values.concat(this.walkTokens(listToken.items, callback));
            break;
          }
          default: {
            const genericToken = token;
            if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
              this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
                const tokens2 = genericToken[childTokens].flat(Infinity);
                values = values.concat(this.walkTokens(tokens2, callback));
              });
            } else if (genericToken.tokens) {
              values = values.concat(this.walkTokens(genericToken.tokens, callback));
            }
          }
        }
      }
      return values;
    }
    use(...args) {
      const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
      args.forEach((pack) => {
        const opts = { ...pack };
        opts.async = this.defaults.async || opts.async || false;
        if (pack.extensions) {
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error("extension name required");
            }
            if ("renderer" in ext) {
              const prevRenderer = extensions.renderers[ext.name];
              if (prevRenderer) {
                extensions.renderers[ext.name] = function(...args2) {
                  let ret = ext.renderer.apply(this, args2);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args2);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if ("tokenizer" in ext) {
              if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              const extLevel = extensions[ext.level];
              if (extLevel) {
                extLevel.unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) {
                if (ext.level === "block") {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === "inline") {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if ("childTokens" in ext && ext.childTokens) {
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
          opts.extensions = extensions;
        }
        if (pack.renderer) {
          const renderer = this.defaults.renderer || new _Renderer(this.defaults);
          for (const prop in pack.renderer) {
            if (!(prop in renderer)) {
              throw new Error(`renderer '${prop}' does not exist`);
            }
            if (prop === "options") {
              continue;
            }
            const rendererProp = prop;
            const rendererFunc = pack.renderer[rendererProp];
            const prevRenderer = renderer[rendererProp];
            renderer[rendererProp] = (...args2) => {
              let ret = rendererFunc.apply(renderer, args2);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args2);
              }
              return ret || "";
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
          for (const prop in pack.tokenizer) {
            if (!(prop in tokenizer)) {
              throw new Error(`tokenizer '${prop}' does not exist`);
            }
            if (["options", "rules", "lexer"].includes(prop)) {
              continue;
            }
            const tokenizerProp = prop;
            const tokenizerFunc = pack.tokenizer[tokenizerProp];
            const prevTokenizer = tokenizer[tokenizerProp];
            tokenizer[tokenizerProp] = (...args2) => {
              let ret = tokenizerFunc.apply(tokenizer, args2);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args2);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }
        if (pack.hooks) {
          const hooks = this.defaults.hooks || new _Hooks();
          for (const prop in pack.hooks) {
            if (!(prop in hooks)) {
              throw new Error(`hook '${prop}' does not exist`);
            }
            if (prop === "options") {
              continue;
            }
            const hooksProp = prop;
            const hooksFunc = pack.hooks[hooksProp];
            const prevHook = hooks[hooksProp];
            if (_Hooks.passThroughHooks.has(prop)) {
              hooks[hooksProp] = (arg) => {
                if (this.defaults.async) {
                  return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                    return prevHook.call(hooks, ret2);
                  });
                }
                const ret = hooksFunc.call(hooks, arg);
                return prevHook.call(hooks, ret);
              };
            } else {
              hooks[hooksProp] = (...args2) => {
                let ret = hooksFunc.apply(hooks, args2);
                if (ret === false) {
                  ret = prevHook.apply(hooks, args2);
                }
                return ret;
              };
            }
          }
          opts.hooks = hooks;
        }
        if (pack.walkTokens) {
          const walkTokens2 = this.defaults.walkTokens;
          const packWalktokens = pack.walkTokens;
          opts.walkTokens = function(token) {
            let values = [];
            values.push(packWalktokens.call(this, token));
            if (walkTokens2) {
              values = values.concat(walkTokens2.call(this, token));
            }
            return values;
          };
        }
        this.defaults = { ...this.defaults, ...opts };
      });
      return this;
    }
    setOptions(opt) {
      this.defaults = { ...this.defaults, ...opt };
      return this;
    }
    lexer(src, options2) {
      return _Lexer.lex(src, options2 ?? this.defaults);
    }
    parser(tokens, options2) {
      return _Parser.parse(tokens, options2 ?? this.defaults);
    }
    #parseMarkdown(lexer2, parser2) {
      return (src, options2) => {
        const origOpt = { ...options2 };
        const opt = { ...this.defaults, ...origOpt };
        if (this.defaults.async === true && origOpt.async === false) {
          if (!opt.silent) {
            console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored.");
          }
          opt.async = true;
        }
        const throwError = this.#onError(!!opt.silent, !!opt.async);
        if (typeof src === "undefined" || src === null) {
          return throwError(new Error("marked(): input parameter is undefined or null"));
        }
        if (typeof src !== "string") {
          return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
        }
        if (opt.hooks) {
          opt.hooks.options = opt;
        }
        if (opt.async) {
          return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
        }
        try {
          if (opt.hooks) {
            src = opt.hooks.preprocess(src);
          }
          let tokens = lexer2(src, opt);
          if (opt.hooks) {
            tokens = opt.hooks.processAllTokens(tokens);
          }
          if (opt.walkTokens) {
            this.walkTokens(tokens, opt.walkTokens);
          }
          let html2 = parser2(tokens, opt);
          if (opt.hooks) {
            html2 = opt.hooks.postprocess(html2);
          }
          return html2;
        } catch (e) {
          return throwError(e);
        }
      };
    }
    #onError(silent, async) {
      return (e) => {
        e.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if (silent) {
          const msg = "<p>An error occurred:</p><pre>" + escape$1(e.message + "", true) + "</pre>";
          if (async) {
            return Promise.resolve(msg);
          }
          return msg;
        }
        if (async) {
          return Promise.reject(e);
        }
        throw e;
      };
    }
  };
  var markedInstance = new Marked();
  function marked(src, opt) {
    return markedInstance.parse(src, opt);
  }
  marked.options = marked.setOptions = function(options2) {
    markedInstance.setOptions(options2);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.getDefaults = _getDefaults;
  marked.defaults = _defaults;
  marked.use = function(...args) {
    markedInstance.use(...args);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.walkTokens = function(tokens, callback) {
    return markedInstance.walkTokens(tokens, callback);
  };
  marked.parseInline = markedInstance.parseInline;
  marked.Parser = _Parser;
  marked.parser = _Parser.parse;
  marked.Renderer = _Renderer;
  marked.TextRenderer = _TextRenderer;
  marked.Lexer = _Lexer;
  marked.lexer = _Lexer.lex;
  marked.Tokenizer = _Tokenizer;
  marked.Hooks = _Hooks;
  marked.parse = marked;
  var options = marked.options;
  var setOptions = marked.setOptions;
  var use = marked.use;
  var walkTokens = marked.walkTokens;
  var parseInline = marked.parseInline;
  var parser = _Parser.parse;
  var lexer = _Lexer.lex;

  // src/content/sanitize.js
  var import_dompurify = __toESM(require_purify(), 1);
  var CONFIG = {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "del",
      "s",
      "code",
      "pre",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "input",
      "span"
    ],
    ALLOWED_ATTR: ["href", "title", "type", "checked", "disabled", "class", "data-line"],
    // No javascript: / data: URLs; force safe link targets.
    ALLOW_DATA_ATTR: false
  };
  function sanitizeHTML(html2) {
    return import_dompurify.default.sanitize(html2, CONFIG);
  }

  // src/content/editor.js
  marked.setOptions({ gfm: true, breaks: true });
  var TASK_RE = /^(\s*[-*+]\s+\[)([ xX])(\])/;
  function renderMarkdown(text) {
    return sanitizeHTML(marked.parse(text || ""));
  }
  function toggleTask(text, index) {
    const lines = (text || "").split("\n");
    let seen = -1;
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(TASK_RE);
      if (!m) continue;
      seen++;
      if (seen === index) {
        const checked = m[2].toLowerCase() === "x";
        lines[i] = lines[i].replace(TASK_RE, `$1${checked ? " " : "x"}$3`);
        break;
      }
    }
    return lines.join("\n");
  }

  // src/content/cards.js
  var SAVE_DELAY = 300;
  var CONFIRM_MS = 2e3;
  function debounced(fn, delay) {
    let t = null;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn, delay);
    };
  }
  function labelScope(el, note) {
    const isUrl = note.scope === "url";
    el.textContent = isUrl ? "\u{1F517} page" : "\u{1F310} site";
    el.title = isUrl ? "Shows only on this page \u2014 click for whole site" : "Shows on the whole site \u2014 click to pin to this page";
  }
  function buildCard(note, href) {
    const card = document.createElement("div");
    card.className = "sn-card";
    card.dataset.noteId = note.id;
    card.innerHTML = `
    <div class="sn-card-header">
      <input class="sn-card-title" placeholder="Untitled" spellcheck="false">
      <span class="sn-local-badge" title="Too large to sync \u2014 saved on this device only" hidden>\u26A0 local</span>
      <div class="sn-card-actions">
        <button class="sn-preview-toggle" title="Preview">\u{1F441}</button>
        <button class="sn-scope-toggle"></button>
        <a class="sn-card-open" target="_blank" rel="noopener noreferrer"></a>
        <span class="sn-color-dot"></span>
        <button class="sn-card-delete" title="Delete note">\u{1F5D1}</button>
      </div>
    </div>
    <textarea class="sn-card-body" placeholder="Notes\u2026 (markdown supported)" spellcheck="false"></textarea>
    <div class="sn-card-preview" hidden></div>
  `;
    const titleEl = card.querySelector(".sn-card-title");
    const bodyEl = card.querySelector(".sn-card-body");
    const previewEl = card.querySelector(".sn-card-preview");
    const previewBtn = card.querySelector(".sn-preview-toggle");
    const scopeEl = card.querySelector(".sn-scope-toggle");
    const openEl = card.querySelector(".sn-card-open");
    const badgeEl = card.querySelector(".sn-local-badge");
    titleEl.value = note.title || "";
    bodyEl.value = note.text || "";
    labelScope(scopeEl, note);
    function updateOpenLink() {
      let target;
      try {
        target = note.scope === "url" && note.url ? note.url : new URL(href).origin + "/";
      } catch {
        target = href;
      }
      openEl.href = target;
      openEl.textContent = "\u2197";
      openEl.title = note.scope === "url" ? "Open this page" : "Open site home";
    }
    updateOpenLink();
    function updateBadge() {
      badgeEl.hidden = note.synced !== false;
    }
    updateBadge();
    const save = debounced(async () => {
      await saveNote(note);
      updateBadge();
    }, SAVE_DELAY);
    titleEl.addEventListener("input", () => {
      note.title = titleEl.value;
      save();
    });
    bodyEl.addEventListener("input", () => {
      note.text = bodyEl.value;
      save();
    });
    let previewMode = false;
    function renderPreview() {
      previewEl.innerHTML = renderMarkdown(note.text);
      previewEl.querySelectorAll('input[type="checkbox"]').forEach((box, i) => {
        box.disabled = false;
        box.addEventListener("click", (e) => {
          e.preventDefault();
          note.text = toggleTask(note.text, i);
          bodyEl.value = note.text;
          renderPreview();
          saveNote(note).then(updateBadge);
        });
      });
    }
    function hasContent() {
      return (note.text || "").trim().length > 0;
    }
    function setPreview(on) {
      previewMode = on;
      previewBtn.textContent = on ? "\u270F\uFE0F" : "\u{1F441}";
      previewBtn.title = on ? "Edit" : "Preview";
      bodyEl.hidden = on;
      previewEl.hidden = !on;
      if (on) renderPreview();
      else bodyEl.focus();
    }
    previewBtn.addEventListener("click", () => setPreview(!previewMode));
    if (hasContent()) setPreview(true);
    let togglingView = false;
    previewBtn.addEventListener("mousedown", () => {
      togglingView = true;
    });
    bodyEl.addEventListener("blur", () => {
      if (togglingView) {
        togglingView = false;
        return;
      }
      if (hasContent()) setPreview(true);
    });
    previewEl.addEventListener("click", (e) => {
      if (e.target.closest('input[type="checkbox"]') || e.target.closest("a")) return;
      setPreview(false);
    });
    scopeEl.addEventListener("click", () => {
      if (note.scope === "url") {
        note.scope = "site";
        note.url = null;
      } else {
        note.scope = "url";
        note.url = href;
      }
      labelScope(scopeEl, note);
      updateOpenLink();
      saveNote(note);
    });
    const dotEl = card.querySelector(".sn-color-dot");
    applyNoteColor(card, note.color);
    const picker = document.createElement("div");
    picker.className = "sn-color-picker";
    picker.hidden = true;
    picker.innerHTML = `
    <div class="sn-color-row">
      ${COLORS.map(
      (c) => `<button class="sn-color-option" data-color="${c.id}" title="${c.label}"></button>`
    ).join("")}
    </div>
    <button class="sn-set-default">Set as site default</button>
  `;
    card.appendChild(picker);
    function paintSwatches() {
      picker.querySelectorAll(".sn-color-option").forEach((btn) => {
        btn.style.background = colorValue(btn.dataset.color);
        btn.classList.toggle("sn-selected", (note.color || "neutral") === btn.dataset.color);
      });
    }
    paintSwatches();
    dotEl.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = card.parentElement;
      if (container) {
        container.querySelectorAll(".sn-color-picker").forEach((p) => {
          if (p !== picker) p.hidden = true;
        });
      }
      picker.hidden = !picker.hidden;
    });
    picker.querySelectorAll(".sn-color-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        note.color = btn.dataset.color;
        applyNoteColor(card, note.color);
        paintSwatches();
        picker.hidden = true;
        saveNote(note);
      });
    });
    picker.querySelector(".sn-set-default").addEventListener("click", async () => {
      picker.hidden = true;
      const meta = await loadMeta(note.host);
      meta.defaultColor = note.color || "neutral";
      await saveMeta(note.host, meta);
    });
    const unsubTheme = onSchemeChange(() => {
      applyNoteColor(card, note.color);
      paintSwatches();
    });
    card.__snCleanup = unsubTheme;
    const delBtn = card.querySelector(".sn-card-delete");
    let confirmTimer = null;
    function resetDelete() {
      delBtn.dataset.confirm = "";
      delBtn.textContent = "\u{1F5D1}";
      delBtn.classList.remove("sn-confirm");
    }
    delBtn.addEventListener("click", () => {
      if (delBtn.dataset.confirm === "1") {
        clearTimeout(confirmTimer);
        if (card.__snCleanup) card.__snCleanup();
        deleteNote(note.id).then(() => card.remove());
        return;
      }
      delBtn.dataset.confirm = "1";
      delBtn.textContent = "Delete?";
      delBtn.classList.add("sn-confirm");
      confirmTimer = setTimeout(resetDelete, CONFIRM_MS);
    });
    return card;
  }
  async function renderCards(host, href, containerEl) {
    const notes = await loadNotesForHost(host, href);
    containerEl.querySelectorAll(".sn-card").forEach((c) => {
      if (c.__snCleanup) c.__snCleanup();
    });
    containerEl.textContent = "";
    for (const note of notes) containerEl.appendChild(buildCard(note, href));
  }
  async function addCard(host, href, containerEl) {
    const meta = await loadMeta(host);
    const ts = Date.now();
    const note = {
      id: generateId(),
      host,
      scope: "site",
      url: null,
      title: "",
      text: "",
      color: meta.defaultColor || null,
      createdAt: ts,
      updatedAt: ts,
      synced: true
    };
    await saveNote(note);
    const card = buildCard(note, href);
    containerEl.prepend(card);
    card.querySelector(".sn-card-body").focus();
  }

  // src/content/io.js
  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.documentElement.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  async function exportSite(host) {
    const safe = (host || "site").replace(/[^a-z0-9.-]/gi, "_");
    downloadJSON(`site-notes-${safe}.json`, await exportSiteJSON(host));
  }
  async function exportAll() {
    downloadJSON("site-notes-all.json", await exportAllJSON());
  }
  function pickAndImport() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";
      input.style.display = "none";
      input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        input.remove();
        if (!file) {
          resolve(null);
          return;
        }
        try {
          const data = JSON.parse(await file.text());
          resolve(await importFromJSON(data));
        } catch (err) {
          resolve({ error: err && err.message ? err.message : "Could not read file" });
        }
      });
      document.documentElement.appendChild(input);
      input.click();
    });
  }
  function importResultMessage(result) {
    if (!result) return null;
    if (result.error) return "Import failed: " + result.error;
    const n = result.added;
    const base = `Imported ${n} note${n === 1 ? "" : "s"}`;
    return result.skipped ? `${base} (${result.skipped} skipped)` : base;
  }
  function showToast(anchorEl, message) {
    if (!message) return;
    const toast = document.createElement("div");
    toast.className = "sn-toast";
    toast.textContent = message;
    anchorEl.appendChild(toast);
    setTimeout(() => toast.classList.add("sn-toast-out"), 2200);
    setTimeout(() => toast.remove(), 2600);
  }

  // src/content/dashboard.js
  function previewText(text) {
    return (text || "").replace(/\s+/g, " ").trim().slice(0, 60);
  }
  function armConfirm(btn, armedLabel, onConfirm) {
    const idle = btn.textContent;
    let timer = null;
    const reset = () => {
      btn.textContent = idle;
      btn.classList.remove("sn-confirm");
      btn.dataset.armed = "";
    };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (btn.dataset.armed === "1") {
        clearTimeout(timer);
        onConfirm();
        return;
      }
      btn.dataset.armed = "1";
      btn.textContent = armedLabel;
      btn.classList.add("sn-confirm");
      timer = setTimeout(reset, 2e3);
    });
  }
  function mountDashboard(panelEl, onClose, onOpenNote) {
    const dash = document.createElement("div");
    dash.className = "sn-dashboard";
    dash.innerHTML = `
    <div class="sn-dash-header">
      <input class="sn-dash-search" placeholder="Search notes\u2026" spellcheck="false">
      <button class="sn-dash-export">Export all</button>
      <button class="sn-dash-import">Import</button>
      <button class="sn-btn sn-dash-close" title="Close">\xD7</button>
    </div>
    <div class="sn-dash-list"></div>
  `;
    panelEl.appendChild(dash);
    requestAnimationFrame(() => dash.classList.add("sn-dash-open"));
    const listEl = dash.querySelector(".sn-dash-list");
    const searchEl = dash.querySelector(".sn-dash-search");
    let allNotes = [];
    function render(filter) {
      const q = (filter || "").trim().toLowerCase();
      const groups = /* @__PURE__ */ new Map();
      for (const n of allNotes) {
        const hay = `${n.title || ""} ${n.text || ""} ${n.host}`.toLowerCase();
        if (q && !hay.includes(q)) continue;
        if (!groups.has(n.host)) groups.set(n.host, []);
        groups.get(n.host).push(n);
      }
      listEl.textContent = "";
      if (!groups.size) {
        const empty = document.createElement("div");
        empty.className = "sn-dash-empty";
        empty.textContent = allNotes.length ? "No matching notes" : "No notes yet";
        listEl.appendChild(empty);
        return;
      }
      for (const [host, notes] of groups) {
        const section = document.createElement("div");
        section.className = "sn-dash-site";
        const header = document.createElement("div");
        header.className = "sn-dash-site-header";
        const name = document.createElement("span");
        name.className = "sn-dash-hostname";
        name.textContent = host;
        const visit = document.createElement("a");
        visit.className = "sn-dash-visit";
        visit.href = /^https?:\/\//.test(host) ? host : "https://" + host;
        visit.target = "_blank";
        visit.rel = "noopener noreferrer";
        visit.textContent = "\u2197";
        visit.title = "Open " + host;
        const delSite = document.createElement("button");
        delSite.className = "sn-dash-delete sn-dash-delete-site";
        delSite.textContent = "\u{1F5D1}";
        delSite.title = "Delete all notes for this site";
        const siteCount = notes.length;
        armConfirm(delSite, `Delete all ${siteCount}?`, async () => {
          await deleteNotesForHost(host);
          showToast(panelEl, `Deleted ${siteCount} note${siteCount === 1 ? "" : "s"} for ${host}`);
          reload();
        });
        header.append(name, visit, delSite);
        section.appendChild(header);
        for (const n of notes) {
          const row = document.createElement("div");
          row.className = "sn-dash-note";
          row.dataset.noteId = n.id;
          row.title = "Double-click to open";
          row.addEventListener("dblclick", (e) => {
            if (e.target.closest("button") || e.target.closest("a")) return;
            close();
            if (onOpenNote) onOpenNote(n);
          });
          const title = document.createElement("span");
          title.className = "sn-dash-title";
          title.textContent = n.title || "Untitled";
          const preview = document.createElement("span");
          preview.className = "sn-dash-preview";
          preview.textContent = previewText(n.text);
          const badge = document.createElement("span");
          badge.className = "sn-dash-scope-badge";
          badge.textContent = n.scope === "url" ? "page" : "site";
          const del = document.createElement("button");
          del.className = "sn-dash-delete";
          del.textContent = "\u{1F5D1}";
          del.title = "Delete note";
          armConfirm(del, "Delete?", async () => {
            await deleteNote(n.id);
            reload();
          });
          row.append(title, preview, badge, del);
          section.appendChild(row);
        }
        listEl.appendChild(section);
      }
    }
    async function reload() {
      allNotes = await loadAllNotes();
      render(searchEl.value);
    }
    function close() {
      dash.classList.remove("sn-dash-open");
      setTimeout(() => {
        dash.remove();
        if (onClose) onClose();
      }, 200);
    }
    searchEl.addEventListener("input", () => render(searchEl.value));
    dash.querySelector(".sn-dash-export").addEventListener("click", () => {
      exportAll();
      showToast(panelEl, "Exported all notes");
    });
    dash.querySelector(".sn-dash-import").addEventListener("click", async () => {
      const result = await pickAndImport();
      const message = importResultMessage(result);
      if (!message) return;
      if (!result.error) reload();
      showToast(panelEl, message);
    });
    dash.querySelector(".sn-dash-close").addEventListener("click", close);
    reload();
    searchEl.focus();
    return { reload, close };
  }

  // src/content/highlight.js
  function captureAnchor(selectionText) {
    const anchor = { selector: null, textOffset: -1, text: selectionText || "" };
    const sel = window.getSelection && window.getSelection();
    if (!sel || sel.rangeCount === 0) return anchor;
    const node = sel.getRangeAt(0).startContainer;
    const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    if (!(el instanceof Element)) return anchor;
    anchor.selector = cssPath(el);
    anchor.textOffset = (el.textContent || "").indexOf(anchor.text);
    return anchor;
  }
  function cssPath(el) {
    if (el.id) return "#" + CSS.escape(el.id);
    const parts = [];
    let node = el;
    while (node && node.nodeType === Node.ELEMENT_NODE && node !== document.body && parts.length < 6) {
      if (node.id) {
        parts.unshift("#" + CSS.escape(node.id));
        break;
      }
      let part = node.nodeName.toLowerCase();
      const parent = node.parentElement;
      if (parent) {
        const twins = [...parent.children].filter((c) => c.nodeName === node.nodeName);
        if (twins.length > 1) part += `:nth-of-type(${twins.indexOf(node) + 1})`;
      }
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(" > ");
  }
  function resolveAnchor(anchor) {
    if (!anchor) return null;
    if (anchor.selector) {
      try {
        const el = document.querySelector(anchor.selector);
        if (el && (!anchor.text || (el.textContent || "").includes(anchor.text))) return el;
      } catch {
      }
    }
    return anchor.text ? findByText(anchor.text) : null;
  }
  function findByText(text) {
    if (!document.body) return null;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while (n = walker.nextNode()) {
      if (n.nodeValue && n.nodeValue.includes(text)) return n.parentElement;
    }
    return null;
  }
  var layer = null;
  var markers = [];
  var rafPending = false;
  var listenersWired = false;
  function ensureLayer() {
    if (layer && layer.isConnected) return;
    layer = document.createElement("div");
    layer.className = "sn-markers";
    document.documentElement.appendChild(layer);
    if (!listenersWired) {
      listenersWired = true;
      window.addEventListener("scroll", scheduleReposition, true);
      window.addEventListener("resize", scheduleReposition);
    }
  }
  function scheduleReposition() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      reposition();
    });
  }
  function reposition() {
    for (const m of markers) {
      if (!m.target.isConnected) {
        m.el.style.display = "none";
        continue;
      }
      const r = m.target.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        m.el.style.display = "none";
        continue;
      }
      m.el.style.display = "flex";
      m.el.style.left = r.left + window.scrollX + "px";
      m.el.style.top = r.top + window.scrollY - 6 + "px";
    }
  }
  function mountMarkers(anchoredNotes, onClick) {
    ensureLayer();
    for (const m of markers) m.el.remove();
    markers = [];
    for (const note of anchoredNotes) {
      const target = resolveAnchor(note.anchor);
      if (!target) continue;
      const el = document.createElement("button");
      el.className = "sn-marker";
      el.textContent = "\u{1F4DD}";
      el.title = note.title || "View note";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick(note.id);
      });
      layer.appendChild(el);
      markers.push({ el, target });
    }
    reposition();
  }

  // src/content/panel.js
  function createPanel(host, href) {
    let panel = null;
    let attachObserver = null;
    let saveTimer = null;
    let ui = { x: null, y: null, w: 300, h: 220, opacity: 0.85, collapsed: false, open: false };
    function persist() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => saveUI(host, ui), 300);
    }
    function build() {
      if (panel) return;
      panel = document.createElement("div");
      panel.id = "site-notes-overlay";
      panel.innerHTML = `
      <div class="sn-header" title="Drag to move">
        <span class="sn-host"></span>
        <div class="sn-controls">
          <input class="sn-opacity" type="range" min="0.15" max="1" step="0.05" title="Transparency">
          <button class="sn-btn sn-dashboard-btn" title="All notes">\u229E</button>
          <button class="sn-btn sn-menu-btn" title="More\u2026">\u22EF</button>
          <button class="sn-btn sn-collapse" title="Collapse">\u2013</button>
          <button class="sn-btn sn-close" title="Hide (Alt+N to reopen)">\xD7</button>
        </div>
      </div>
      <div class="sn-menu" hidden>
        <button class="sn-menu-item sn-export-site">Export this site</button>
        <button class="sn-menu-item sn-import">Import notes</button>
      </div>
      <div class="sn-cards-container"></div>
      <button class="sn-add-note" title="Add a note">+ Add note</button>
      <div class="sn-resize" title="Drag to resize"></div>
    `;
      document.documentElement.appendChild(panel);
      panel.querySelector(".sn-host").textContent = host;
      const opacitySlider = panel.querySelector(".sn-opacity");
      opacitySlider.value = ui.opacity;
      applyOpacity();
      applyGeometry();
      applyCollapsed();
      opacitySlider.addEventListener("input", () => {
        ui.opacity = parseFloat(opacitySlider.value);
        applyOpacity();
        persist();
      });
      const stopAdjust = () => panel.classList.remove("sn-adjusting");
      const endDrag = () => {
        stopAdjust();
        opacitySlider.blur();
      };
      opacitySlider.addEventListener("pointerdown", () => panel.classList.add("sn-adjusting"));
      opacitySlider.addEventListener("pointerup", endDrag);
      opacitySlider.addEventListener("pointercancel", endDrag);
      opacitySlider.addEventListener("blur", stopAdjust);
      panel.querySelector(".sn-collapse").addEventListener("click", () => {
        ui.collapsed = !ui.collapsed;
        applyCollapsed();
        persist();
      });
      panel.querySelector(".sn-close").addEventListener("click", hide);
      const container = panel.querySelector(".sn-cards-container");
      panel.querySelector(".sn-add-note").addEventListener("click", () => {
        addCard(host, href, container);
      });
      const menu = panel.querySelector(".sn-menu");
      const closeMenu = () => {
        menu.hidden = true;
      };
      panel.querySelector(".sn-menu-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
      });
      panel.addEventListener("click", (e) => {
        if (!menu.hidden && !e.target.closest(".sn-menu") && !e.target.closest(".sn-menu-btn")) {
          closeMenu();
        }
        if (!e.target.closest(".sn-color-picker") && !e.target.closest(".sn-color-dot")) {
          panel.querySelectorAll(".sn-color-picker").forEach((p) => {
            p.hidden = true;
          });
        }
      });
      panel.querySelector(".sn-export-site").addEventListener("click", () => {
        closeMenu();
        exportSite(host);
        showToast(panel, "Exported this site");
      });
      panel.querySelector(".sn-import").addEventListener("click", async () => {
        closeMenu();
        const result = await pickAndImport();
        const message = importResultMessage(result);
        if (!message) return;
        if (!result.error) renderCards(host, href, container);
        showToast(panel, message);
      });
      let dashboardOpen = false;
      panel.querySelector(".sn-dashboard-btn").addEventListener("click", () => {
        if (dashboardOpen) return;
        dashboardOpen = true;
        closeMenu();
        mountDashboard(
          panel,
          () => {
            dashboardOpen = false;
            renderCards(host, href, container);
          },
          (note) => {
            if (note.host === host) {
              setTimeout(() => revealNote(note.id), 220);
            } else {
              const url = note.scope === "url" && note.url ? note.url : "https://" + note.host + "/";
              window.open(url, "_blank", "noopener,noreferrer");
            }
          }
        );
      });
      makeDraggable(panel.querySelector(".sn-header"));
      makeResizable(panel.querySelector(".sn-resize"));
    }
    function applyCollapsed() {
      if (!panel) return;
      panel.classList.toggle("sn-collapsed", ui.collapsed);
      const btn = panel.querySelector(".sn-collapse");
      if (!btn) return;
      btn.textContent = ui.collapsed ? "\u25A1" : "\u2013";
      btn.title = ui.collapsed ? "Expand" : "Collapse";
    }
    function applyOpacity() {
      if (!panel) return;
      panel.style.setProperty("--sn-alpha-rest", ui.opacity);
      panel.style.setProperty("--sn-boost-rest", (1 - ui.opacity).toFixed(3));
    }
    function applyGeometry() {
      if (!panel) return;
      panel.style.width = ui.w + "px";
      panel.style.height = ui.h + "px";
      if (ui.x === null || ui.y === null) {
        ui.x = window.innerWidth - ui.w - 24;
        ui.y = 24;
      }
      clampToViewport();
      panel.style.left = ui.x + "px";
      panel.style.top = ui.y + "px";
    }
    function clampToViewport() {
      ui.x = Math.min(Math.max(0, ui.x), Math.max(0, window.innerWidth - 60));
      ui.y = Math.min(Math.max(0, ui.y), Math.max(0, window.innerHeight - 40));
    }
    function makeDraggable(handle) {
      let startX, startY, origX, origY, dragging = false;
      handle.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".sn-btn") || e.target.closest(".sn-opacity")) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origX = ui.x;
        origY = ui.y;
        handle.setPointerCapture(e.pointerId);
      });
      handle.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        ui.x = origX + (e.clientX - startX);
        ui.y = origY + (e.clientY - startY);
        clampToViewport();
        panel.style.left = ui.x + "px";
        panel.style.top = ui.y + "px";
      });
      handle.addEventListener("pointerup", () => {
        if (dragging) {
          dragging = false;
          persist();
        }
      });
    }
    function makeResizable(grip) {
      let startX, startY, origW, origH, resizing = false;
      grip.addEventListener("pointerdown", (e) => {
        resizing = true;
        startX = e.clientX;
        startY = e.clientY;
        origW = ui.w;
        origH = ui.h;
        grip.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      grip.addEventListener("pointermove", (e) => {
        if (!resizing) return;
        ui.w = Math.max(240, origW + (e.clientX - startX));
        ui.h = Math.max(180, origH + (e.clientY - startY));
        panel.style.width = ui.w + "px";
        panel.style.height = ui.h + "px";
      });
      grip.addEventListener("pointerup", () => {
        if (resizing) {
          resizing = false;
          persist();
        }
      });
    }
    function ensureAttached() {
      if (panel && !panel.isConnected) {
        document.documentElement.appendChild(panel);
      }
      if (attachObserver) return;
      attachObserver = new MutationObserver(() => {
        if (ui.open && panel && !panel.isConnected) {
          document.documentElement.appendChild(panel);
        }
      });
      attachObserver.observe(document.documentElement, { childList: true });
    }
    function show() {
      build();
      ensureAttached();
      renderCards(host, href, panel.querySelector(".sn-cards-container"));
      panel.style.display = "flex";
      ui.open = true;
      persist();
    }
    function hide() {
      if (panel) panel.style.display = "none";
      ui.open = false;
      persist();
    }
    function toggle() {
      if (ui.open && panel && panel.style.display !== "none") hide();
      else show();
    }
    async function refreshMarkers() {
      const notes = await loadNotesForHost(host, href);
      const anchored = notes.filter((n) => n.anchor);
      mountMarkers(anchored, (noteId) => revealNote(noteId));
    }
    async function revealNote(noteId) {
      show();
      const container = panel.querySelector(".sn-cards-container");
      await renderCards(host, href, container);
      const card = container.querySelector(`[data-note-id="${noteId}"]`);
      if (card) {
        card.scrollIntoView({ block: "nearest" });
        card.classList.add("sn-flash");
        setTimeout(() => card.classList.remove("sn-flash"), 1200);
      }
    }
    async function addHighlightNote(selectionText, anchor) {
      const meta = await loadMeta(host);
      const ts = Date.now();
      const quoted = (selectionText || "").trim().replace(/\n/g, "\n> ");
      const note = {
        id: generateId(),
        host,
        scope: "url",
        url: href,
        title: "",
        text: quoted ? `> ${quoted}

` : "",
        color: meta.defaultColor || null,
        anchor: anchor || null,
        createdAt: ts,
        updatedAt: ts,
        synced: true
      };
      await saveNote(note);
      await revealNote(note.id);
      const card = panel.querySelector(`[data-note-id="${note.id}"]`);
      const body = card && card.querySelector(".sn-card-body");
      if (body) {
        if (body.hidden) card.querySelector(".sn-preview-toggle")?.click();
        body.focus();
        body.selectionStart = body.selectionEnd = body.value.length;
      }
      refreshMarkers();
    }
    async function init() {
      ui = await loadUI(host);
      const notes = await loadNotesForHost(host, href);
      if (notes.length || ui.open) show();
      refreshMarkers();
    }
    return { show, hide, toggle, init, addHighlightNote };
  }

  // src/content/index.js
  (() => {
    if (window.__siteNotesOverlayLoaded) return;
    window.__siteNotesOverlayLoaded = true;
    const HOST = location.hostname || "local";
    const HREF = location.href;
    initTheme();
    const panel = createPanel(HOST, HREF);
    chrome.runtime.onMessage.addListener((msg) => {
      if (!msg) return;
      if (msg.type === "SITE_NOTES_TOGGLE") panel.toggle();
      else if (msg.type === "SITE_NOTES_SHOW") panel.show();
      else if (msg.type === "SITE_NOTES_ADD_HIGHLIGHT") {
        const anchor = captureAnchor(msg.selectionText);
        panel.addHighlightNote(msg.selectionText, anchor);
      }
    });
    window.addEventListener("pagehide", () => {
      flushPendingSync();
    });
    panel.init();
  })();
})();
/*! Bundled license information:

dompurify/dist/purify.js:
  (*! @license DOMPurify 3.1.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.1.6/LICENSE *)
*/
