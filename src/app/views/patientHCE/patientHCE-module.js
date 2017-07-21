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
          },
        onEnter: function($stateParams, HCService){
            HCService.setPaciente($stateParams.patientId);
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
              controller: 'PatientProblemsController',
              controllerAs: 'PatientProblemsController'        
            }
          },
      })
      .state('app.patientHCE.evolutions', {
          url: '/evoluciones',
          views: {
            'detail': {
              templateUrl: 'app/views/patientHCE/evolutions/evolutions.html',
              controller: 'EvolutionsController',
              controllerAs: 'EvolutionsController',
            }
          },
      })
      .state('app.patientHCE.vaccines', {
          url: '/vacunas',
          views: {
            'detail': {
              templateUrl: 'app/views/patientHCE/vaccines/vaccines.html',
              controller: 'PatientVaccinesController',
              controllerAs: 'PatientVaccinesController'        
            }
          },
      });

	}
})();