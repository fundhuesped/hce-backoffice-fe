(function(){
	'use strict';
	angular.module('hce.patient',[])
	.config(routerConfig);

	/** @ngInject */
	function routerConfig($stateProvider, $urlRouterProvider) {
	    $stateProvider
      .state('app.patientSearch', {
          url: '/searchpatient',
          views: {
            'content': {
              templateUrl: 'app/views/patient/patientSearch.html',
              controller: 'PatientSearchController',
              controllerAs: 'PatientSearchController'         
            }
          }
      })
      .state('app.newPatient', {
          url: '/newPatient',
          views: {
            'content': {
              templateUrl: 'app/views/patient/newPatient.html',
              controller: 'NewPatientController',
              controllerAs: 'NewPatientController'
            }
          }
      });
	}
})();