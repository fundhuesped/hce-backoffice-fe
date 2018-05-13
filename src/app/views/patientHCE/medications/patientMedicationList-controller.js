(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientMedicationListController', patientMedicationListController);

	   patientMedicationListController.$inject = ['$state',
                                                'HCService',
                                                'PatientMedication',
                                                'Medication',
                                                'toastr',
                                                'moment',
                                                '$uibModal',
                                                'lodash'];

    function patientMedicationListController ($state,
                                              HCService,
                                              PatientMedication,
                                              Medication,
                                              toastr,
                                              moment,
                                              $uibModal,
                                              lodash) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientMedications = searchPatientMedications;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.pageChanged = pageChanged;
      vm.showArv = showArv;
      vm.openNewPatientMedicationModal = openNewPatientMedicationModal;
      vm.openEditPatientMedicationModal = openEditPatientMedicationModal;
      vm.openNewRecetaModal = openNewRecetaModal;
      vm.hasActiveMedications = hasActiveMedications;


      Object.defineProperty(
          vm,
          'patientMedications', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.patientMedications;
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

      activate();

	    function activate(){
        searchPatientMedications();
	    }

      function pageChanged() {
        searchPatientMedications();
      }

      function searchPatientMedications() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.notMedicationTypeCode = 'PROF';
        HCService.getPatientMedications(vm.filters).$promise.then(function (paginatedResult) {
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        });
      }

      function openEditPatientMedicationModal(selectedMedication) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
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
          backdrop: 'static',
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

      function openNewRecetaModal(){
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/medications/newMedicationReceta.html',
          size: 'md',
          controller: 'NewMedicationRecetaController',
          controllerAs: 'Ctrl'
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='edited'){
            searchPatientTreatments();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }

      function hasActiveMedications() {
        return vm.activePatientMedicationsCount > 0;
      }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function showArv() {
        return $state.current.name == 'app.patientHCE.medications';
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