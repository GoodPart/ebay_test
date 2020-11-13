// https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/Node/prototype/contains/polyfill.js
function contains(node) {
  if (!(0 in arguments)) {
    throw new TypeError('1 argument is required');
  }

  do {
    if (this === node) {
      return true;
    }
  } while ((node = node && node.parentNode));

  return false;
}

if (!document.contains) {
  // IE
  if ('HTMLElement' in this && 'contains' in HTMLElement.prototype) {
    try {
      delete HTMLElement.prototype.contains;
    } catch (e) {}
  }

  if ('Node' in this) {
    Node.prototype.contains = contains;
  } else {
    document.contains = Element.prototype.contains = contains;
  }
}
