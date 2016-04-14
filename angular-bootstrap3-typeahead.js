/**
 * angular-bootstrap3-typeahead
 * angular directive for https://github.com/bassjobsen/Bootstrap-3-Typeahead
 *
 * @version v0.0.1 - 2016-04-04
 * @author David Konrad (davidkonrad@gmail.com)
 * @license MIT (https://opensource.org/licenses/MIT)
**/

(function() {
'use strict';

//declaration
angular.module('bootstrap3-typeahead', []);

//implementation
angular.module('bootstrap3-typeahead').directive('bs3Typeahead', ["$parse", function($parse) {

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function link(scope, element, attrs, controller) {

      /**
        default typeahead options
       */
      var attrMap = {
        source: [],
        items: 8,
        minLength: 1,
        showHintOnFocus: false,
        scrollHeight: 0,
        displayText: null,
        afterSelect: $.noop,
        addItem: false,
        autoSelect: true,
        delay: 0,
        matcher: null,
        sorter: null,
        updater: null,
        highlighter: null
      }

      /**
        bootstrap3-typeahead reference
       */
      var instance = null

      /**
        * return the directive attribute name associated with a typeahead option
        * 
        * @param typeahead option name, example items
        * @returns {string} attrName, example bs3Items
        */
      var getAttrName = function(attr) {
        return 'bs3' + attr.charAt(0).toUpperCase() + attr.toLowerCase().slice(1)     
      }

      /**
        * return the value of an attribute declaration
        * checks if the attribute value is found in the scope
        * 
        * @param bs3-* attrName 
        * @returns {value} a default value, a custom value or a $scope variable
        */
      var getAttrValue = function(attrName) {
        var value = attrs[attrName], scopeValue = scope[value]
        return scopeValue !== undefined ? scopeValue : value
      } 

      /**
        * initialize the typeahead
        *
        * @param object attributes, harvested directive attributes translated into jQuery names
        *
        */
      var initialize = function(attributes) {
        if (instance) element.typeahead('destroy')
        instance = element.typeahead(attributes)
      }

      /**
        * read attributes and wait for promise (if any)
        * calls initialize() when ready
        */
      var prepare = function() {
        var attributes = angular.copy(attrMap)
        for (var name in attributes) {
          var value = getAttrValue(getAttrName(name))
          if (value != undefined) attributes[name] = value
        }
        var promise = attrs['bs3Promise']
        if (promise) {
          scope.$watch(promise, function(newVal, oldVal, childScope) {
            if (typeof childScope[promise] == 'object') {
              attributes['source'] = JSON.parse(angular.toJson(childScope[promise]))
              initialize(attributes)
            }
          })
        } else {
          initialize(attributes) 
        }
      }

      prepare()

      /**
        clean up the typeahead instance after destroy
       */
      scope.$on('$destroy', function() {
        element.typeahead('destroy')
      })

    }
  }
}])

})();


