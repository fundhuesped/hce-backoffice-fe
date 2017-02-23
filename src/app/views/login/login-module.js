(function(){
	'use strict';
	angular.module('hce.login',[])
	.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider, $urlRouterProvider) {
	    $stateProvider
	      .state('login', {
	        url: '/login',
	        templateUrl: 'app/views/login/login.html',
	        controller: 'LoginController',
	        controllerAs: 'LoginController',
	      })
	}
})();