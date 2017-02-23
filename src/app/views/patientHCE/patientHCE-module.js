(function(){
	'use strict';
	angular.module('hce.patientHCE',[])
	.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider, $urlRouterProvider) {
	    $stateProvider
      .state('app.patientHCE', {
          abstract: true,
          url: '/patient/:patientId',
          views: {
            'content': {
              templateUrl: 'app/views/patientHCE/patientHCE-layout.html',
              controller: 'PatientHCELayoutController',
              controllerAs: 'PHCECtrl'         
            }
          }
      })
      .state('app.patientHCE.resumen', {
          url: '/resumen',
          views: {
            'detail': {
              templateUrl: 'app/views/patientHCE/overview/overview.html',
              controller: 'OverviewController',
              controllerAs: 'OverviewController'        
            }
          },
      })
      .state('app.patientHCE.problems', {
          url: '/problemas',
          views: {
            'detail': {
              templateUrl: 'app/views/patientHCE/problems/problems.html',
            }
          },
      });

	}
})();