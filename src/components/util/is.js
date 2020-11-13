/**
 * 타입 체크
 *
 * @module util/is
 */

// https://www.w3.org/TR/dom/#dom-node-nodetype
const {
  ELEMENT_NODE, // 1
  TEXT_NODE, // 3
  DOCUMENT_NODE, // 9
  DOCUMENT_FRAGMENT_NODE, // 11
} = Node;

/**
 * 배열인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} 배열이면 `true`
 */
export function isArray(x) {
  return Array.isArray(x);
}

/**
 * 문자열인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} 문자열이면 `true`
 */
export function isString(x) {
  return typeof x === 'string';
}

/**
 * 숫자인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} 숫자이면 `true`
 */
export function isNumber(x) {
  return typeof x === 'number' && !isNaN(x);
}

/**
 * 함수인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} 함수이면 `true`
 */
export function isFunction(x) {
  return typeof x === 'function';
}

/**
 * SVG 요소인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} SVG 요소이면 `true`
 */
export function isSvgElement(x) {
  return x instanceof SVGElement;
}

/**
 * Node인지 체크
 *
 * @param {any} x 체크 대상
 * @param {boolean} [excludeSvg=true] `true`면 체크 시 SVG 요소 제외
 * @returns {boolean} Node이면 `true`
 */
export function isNode(x, excludeSvg = true) {
  return !!x && typeof x.nodeType === 'number' && (excludeSvg ? !isSvgElement(x) : true);
}

/**
 * NodeList 객체인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} NodeList 객체이면 `true`
 */
export function isNodeList(x) {
  return x instanceof NodeList;
}

/**
 * 텍스트 노드인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} 텍스트 노드이면 `true`
 */
export function isTextNode(x) {
  return isNode(x) && x.nodeType === TEXT_NODE;
}

/**
 * HTML 요소인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} HTML 요소이면 `true`
 */
export function isElement(x) {
  return x instanceof HTMLElement;
}

/**
 * 텍스트 노드거나 HTML 요소인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} 텍스트 노드나 HTML 요소이면 `true`
 */
export function isTextOrElement(x) {
  return isNode(x) && (x.nodeType === TEXT_NODE || x.nodeType === ELEMENT_NODE);
}

/**
 * Document 노드인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} Document 노드이면 `true`
 */
export function isDocument(x) {
  return isNode(x) && x.nodeType === DOCUMENT_NODE;
}

/**
 * DocumentFragment인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} DocumentFragment이면 `true`
 */
export function isDocumentFragment(x) {
  return isNode(x) && x.nodeType === DOCUMENT_FRAGMENT_NODE;
}

/**
 * 자식 노드가 없는 DocumentFragment인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} DocumentFragment이지만 자식 노드가 없으면 `true`
 */
export function isEmptyDocumentFragment(x) {
  return isDocumentFragment(x) && !x.hasChildNodes();
}

/**
 * Selection 객체인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} Selection 객체이면 `true`
 */
export function isSelection(x) {
  return x instanceof Selection;
}

/**
 * Range 객체인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} Range 객체이면 `true`
 */
export function isRange(x) {
  return x instanceof Range;
}

/**
 * Range의 속성을 갖는 객체인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} 유사 Range 객체이면 `true`
 */
export function isRangeLike(x) {
  return (
    !!x &&
    isNode(x.commonAncestorContainer) &&
    isNode(x.startContainer) &&
    isNumber(x.startOffset) &&
    isNode(x.endContainer) &&
    isNumber(x.endOffset)
  );
}

/**
 * 다른 타입이 아닌 단순 객체인지 체크
 *
 * @param {any} x 체크 대상
 * @returns {boolean} 단순 객체이면 `true`
 */
export function isObject(x) {
  return (
    typeof x === 'object' && x !== null && !isArray(x) && !isNode(x) && !isNodeList(x) && !isSelection(x) && !isRange(x)
  );
}

export {
  /** @see module:util/is.isArray */
  isArray as array,
  /** @see module:util/is.isString */
  isString as string,
  /** @see module:util/is.isNumber */
  isNumber as number,
  /** @see module:util/is.isFunction */
  isFunction as function,
  /** @see module:util/is.isNode */
  isNode as node,
  /** @see module:util/is.isNodeList */
  isNodeList as nodeList,
  /** @see module:util/is.isTextNode */
  isTextNode as textNode,
  /** @see module:util/is.isElement */
  isElement as element,
  /** @see module:util/is.isSvgElement */
  isSvgElement as svgElement,
  /** @see module:util/is.isTextOrElement */
  isTextOrElement as textOrElement,
  /** @see module:util/is.isDocument */
  isDocument as document,
  /** @see module:util/is.isDocumentFragment */
  isDocumentFragment as documentFragment,
  /** @see module:util/is.isEmptyDocumentFragment */
  isEmptyDocumentFragment as emptyDocumentFragment,
  /** @see module:util/is.isSelection */
  isSelection as selection,
  /** @see module:util/is.isRange */
  isRange as range,
  /** @see module:util/is.isRangeLike */
  isRangeLike as rangeLike,
  /** @see module:util/is.isObject */
  isObject as object,
};
