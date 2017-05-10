(function() {
  'use strict';

  angular
    .module('hce.app', ['ngAnimate', 
    	'ngCookies', 
    	'ngTouch', 
    	'ngSanitize', 
    	'ngMessages', 
    	'ngAria', 
    	'ngResource', 
    	'ui.router', 
    	'ui.bootstrap', 
    	'toastr',
        'ui.bootstrap',
        'angular-loading-bar',
        'darthwade.dwLoading',
        'LocalStorageModule',
        'angularBootstrapMaterial',
        'hce.resources', 
        'hce.login', 
        'hce.patientHCE', 
        'hce.patientSearch', 
        'hce.services']);
})();
