angular-bootstrap3-typeahead
============================

AngularJS directive for the [Bootstrap 3 Typeahead](https://github.com/bassjobsen/Bootstrap-3-Typeahead/) jQuery plugin.

##Usage

**tl;dr** classic `states` demo introducing `ng-model` **http://plnkr.co/edit/TTE3LludaCD9JxH2QJeR?p=preview**

###Installation
```shell
$ bower install angular-bootstrap3-typeahead
```

or  

```shell
$ npm install angular-bootstrap3-typeahead
```

###Registration

To be able to use the directive, you need to register the `angular-bootstrap3-typeahead` module as a dependency:

```javascript
angular.module('yourModule', ['bootstrap3-typeahead'
 // other dependencies
]);
```

###Directive
The directive maps declarative `bs3`-* attributes to their respective typeahead equivalences. The following example contains all of the supported attributes :

```html
<input 
  type="text" 
  bs3-typeahead 
  ng-model = "$scope.variable"
  bs3-promise = "angular promise"

  bs3-source = "[]"
  bs3-items = "8"
  bs3-minLength = "1"
  bs3-showHintOnFocus = "false"
  bs3-scrollHeight = "0"
  bs3-displayText = "$scope.function"
  bs3-afterSelect = "$scope.function"
  bs3-addItem = "$scope.function"
  bs3-autoSelect = "true"
  bs3-delay = "0"
  bs3-matcher = "$scope.function"
  bs3-sorter = "$scope.function"
  bs3-updater = "$scope.function"
  bs3-highlighter = "$scope.function"
/>
```

For all the well known standard options I refer to the [bootstrap3-typehead documentation](https://github.com/bassjobsen/Bootstrap-3-Typeahead#options). For the use of `bs3-promise`, a specialized option for `bootstrap3-typeahead`, se below. 

###Example

Consider the following usage of `bootstrap3-typeahead` in an AngularJS app using [AngularStrap](http://mgcrea.github.io/angular-strap/) (a better and more clean bootstrap implementation over the official Bootstrap UI) 

```js
var modal = $modal({
  scope: $scope,
  templateUrl: 'path/to/template',
  backdrop: 'static',
  show: true
})
modal.$promise.then(modal.show).then(function() {
  $('.typeahead').typeahead({
   showHintOnFocus: true,
   source: $scope.items,
   displayText: function(item) {
     return item.sagsNo
   },
   items: 15,
   afterSelect: function(item) {
     $timeout(function() {
       $scope.someId = item.id
     })
   }
  })
})
```

As you may see, there is several issues using this approach 

1. The need of "manually" initializing the typeahead
2. We cannot use our `$scope` methods right away, for example along with `afterSelect`
3. We must programmatically setup a wait condition, so the typeahead can be initialised when the modal is shown
4. We must use a `$timeout` in order to be sure to update the `$scope.someId` variable 
4. It is in any aspect so far from "the angular way"

With the use of the bootstrap3-typeahead directive the same can be done as 

markup:  
```html
<input bs3-typeahead bs3-source="items" bs3-displayText="displayText" bs3-afterSelect="afterSelect" />
```

script:  
```js
$scope.displayText = function(item) {
  return item.sagsNo
}
$scope.afterSelect = function(item) {
  $scope.someId = item.id
}
```
		
###Using `bs3-promise`

`bs3-promise` is a special attribute that let you assign a `source` with a delay. This can be useful if you need to use a `source` which origin from a service, a remote file or similar. It is a simple but effective attempt to angularish' the typeahead. Example :

```js
$http.get('my-remote-file.json').then(function(response) {
	$scope.items = response
})
```
```html
<input bs3-typeahead bs3-promise="items" />
```

`bs3-promise` does _not_ actually use promises. If you specify `bs3-promise` then the directive will simply wait and `$watch` the referred `$scope` variable. Once the variable is set the typeahead is initialised. 
This also mean, that if you later on change the variable you are referring to in `bs3-promise`, then the typeahead will be _reinitailised_ with the new variable as `source`. 
`bs3-promise` let you easily change source on the fly.

