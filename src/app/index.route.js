(function() {
  'use strict';

  angular
    .module('hce.app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
          abstract: true,
          url: '/app',
          templateUrl: 'app/views/app-layout/app-layout.html',
          controller: 'AppLayoutController',
          controllerAs: 'AppLayoutController',
      })
      .state('app.home', {
          url: '/home',
          views: {
            'content': {
              templateUrl: 'app/main/main.html',
              controller: 'MainController',
              controllerAs: 'MainController'        
            }
          },
      })
      .state('generalPrescription', {
          url: '/generalPrescription?prescriptionId',
          templateUrl: 'app/views/patientHCE/prescriptions/generalPrescription.html',
          controller: 'MedicationRecetaNuevaController',
          controllerAs: 'Ctrl',        
          params: {
              prescription: null
          }
      })

      .state('summaryDetails', {
        //TODO FIXME add more params
        url: '/summaryDetails?patientId',
        templateUrl: 'app/views/patientHCE/hceSummary/hivDetails.html',
        controller: 'HivDetailsController',
        controllerAs: 'HivDetailsController',        
        params: {
          patientId: null
        }
      })

      .state('profilaxisPrescription', {
          url: '/profilaxisPrescription?prescriptionId',
          templateUrl: 'app/views/patientHCE/prescriptions/profilaxisPrescription.html',
          controller: 'MedicationRecetaNuevaController',
          controllerAs: 'Ctrl',        
          params: {
              prescription: null
          }
      })
      .state('arvPrescription', {
          url: '/arvPrescription?prescriptionId',
          templateUrl: 'app/views/patientHCE/prescriptions/arvPrescription.html',
          controller: 'ArvMedicationRecetaController',
          controllerAs: 'Ctrl',        
          params: {
              prescription: null
          }
      })
      .state('vaccinePrescription', {
          url: '/vaccinePrescription?prescriptionId',
          templateUrl: 'app/views/patientHCE/prescriptions/vaccinePrescription.html',
          controller: 'VaccinePrescriptionController',
          controllerAs: 'Ctrl',        
          params: {
              prescription: null
          }
      })
      .state('home', {
        url: '/',
          templateUrl: 'app/views/login/login.html',
          controller: 'LoginController',
          controllerAs: 'LoginController',
      });
    $urlRouterProvider.otherwise('/');
  }
})();
