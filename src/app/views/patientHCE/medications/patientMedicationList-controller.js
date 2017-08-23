(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientMedicationListController', patientMedicationListController);

	   patientMedicationListController.$inject = ['$state', 'HCService', 'PatientMedication', 'Medication', 'toastr', 'moment', '$uibModal'];

    function patientMedicationListController ($state, HCService, PatientMedication, Medication, toastr, moment, $uibModal) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientMedications = searchPatientMedications;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.pageChanged = pageChanged;

      vm.openNewPatientMedicationModal = openNewPatientMedicationModal;
      vm.openEditPatientMedicationModal = openEditPatientMedicationModal;


      Object.defineProperty(
          vm,
          'patientMedications', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.patientMedications;
          }
      });

      activate();

	    function activate(){
        searchPatientMedications();
	    }

      function pageChanged() {
        searchPatientVaccines();
      }

      function searchPatientMedications() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        HCService.getPatientMedications(vm.filters).$promise.then(function (paginatedResult) {
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        });
      }

      function openEditPatientMedicationModal(selectedMedication) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/medications/editPatientMedication.html',
          size: 'md',
          controller: 'EditPatientMedicationController',
          controllerAs: 'EditPatientMedicationController',
          resolve: {
            patientMedication: function () {
              return selectedMedication;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='edited'){
            searchPatientMedications();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }

      function openNewPatientMedicationModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/medications/newPatientMedication.html',
          size: 'md',
          controller: 'NewPatientMedicationController',
          controllerAs: 'NewPatientMedicationController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='created'){
            searchPatientMedications();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });

      }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function showError(error) {
        if(error){
          toastr.error(error.data.detail);
        }else{
          toastr.error('Ocurrio un error');
        }
      }
    }
})();