(function() {
  'use strict';

  angular
    .module('hce.app', ['ngAnimate', 
        'ngCookies', 
        'ngTouch',
        'ngMask',
    	'ngSanitize', 
    	'ngMessages', 
    	'ngAria',
        'ngLodash',
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
        'hce.profile',
        'hce.patientHCE',
        'hce.patient', 
        'hce.services']);
})();
