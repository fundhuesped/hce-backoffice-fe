(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientHCELayoutController', patientHCELayoutController);

	patientHCELayoutController.$inject = ['$state', '$stateParams','SessionService', 'HCService'];

    function patientHCELayoutController ($state, $stateParams, SessionService, HCService) {
	    var vm = this;
        vm.currentUserCan = SessionService.currentUserCan;
        activate();

        Object.defineProperty(
          vm,
          'summaryActiveProblems', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.summaryActiveProblems;
          }
        });
        Object.defineProperty(
          vm,
          'activeProblemsCount', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.activeProblemsCount;
          }
        });
        Object.defineProperty(
          vm,
          'summaryPatientVaccines', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.summaryPatientVaccines;
          }
        });
        Object.defineProperty(
          vm,
          'activePatientVaccinesCount', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.activePatientVaccinesCount;
          }
        });

        Object.defineProperty(
          vm,
          'summaryPatientMedications', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.summaryPatientMedications;
          }
        });
        Object.defineProperty(
          vm,
          'activePatientMedicationsCount', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.activePatientMedicationsCount;
          }
        });
	    function activate(){
        setTimeout(function (argument) {
         HCService.getActivePatientProblems();
        }, 1000);
        
	    }

    }
})();