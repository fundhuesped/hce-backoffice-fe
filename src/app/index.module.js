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
        'scrollable-table',
    	'toastr',
        'ui.bootstrap',
        'angular-loading-bar',
        'darthwade.dwLoading',
        'LocalStorageModule',
        'angularBootstrapMaterial',
        'hce.resources', 
        'hce.login', 
        'hce.patientHCE', 
        'hce.patient', 
        'hce.services']);
})();
