/**
 * Created by anuraggrover on 12/08/15.
 */

(function () {
    'use strict';

    // ToDo: Find a better place for this
    HTMLElement.prototype.closest = function (selector) {
        var match = null,
            element = this;

        if (selector.indexOf('#') !== -1) {
            selector = selector.substr(1);

            while (element.parentNode !== document) {
                if (element.getAttribute('id') === selector) {
                    match = element;
                    break;
                } else {
                    element = element.parentNode;
                }
            }
        } else if (selector.indexOf('.') !== -1) {
            selector = selector.substr(1);

            while (element.parentNode !== document) {
                if (element.classList.contains(selector)) {
                    match = element;
                    break;
                } else {
                    element = element.parentNode;
                }
            }
        } else { // Tag, eh?
            return null;
        }

        return match;
    };

    HTMLElement.prototype.toggleClass = function (classToken, flag) {
        var element = this;

        if ( flag !== undefined ) {
            if ( flag ) {
                element.classList.add(classToken);
            } else {
                element.classList.remove(classToken);
            }
        } else {
            element.classList.toggle(classToken);
        }
    };
})();