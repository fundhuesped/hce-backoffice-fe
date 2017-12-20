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
      .state('app.patientHCE.medications', {
          url: '/medicacion',
          views: {
            'detail': {
              templateUrl: 'app/views/patientHCE/medications/medications.html',
              controller: 'PatientMedicationListController',
              controllerAs: 'PMLController',
            }
          },
      })
      .state('app.patientHCE.arvTreatments', {
          url: '/arvTreatments',
          views: {
            'detail': {
              templateUrl: 'app/views/patientHCE/medications/patientARVTreatmentList.html',
              controller: 'PatientARVTreatmentListController',
              controllerAs: 'PMLController',
            }
          },
      })
      .state('app.patientHCE.clinicalResults', {
          url: '/estudios',
          views: {
            'detail': {
              templateUrl: 'app/views/patientHCE/clinicalResults/clinicalResults.html',
              controller: 'PatientClinicalResultsListController',
              controllerAs: 'PatientClinicalResultsListController',
            }
          },
      })
      .state('app.patientHCE.laboratoryResults', {
          url: '/laboratorios',
          views: {
            'detail': {
              templateUrl: 'app/views/patientHCE/laboratoriesResults/laboratoriesResults.html',
              controller: 'PatientLaboratoryResultsListController',
              controllerAs: 'Ctrl',
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