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
      vm.recipeFilters = {};
      vm.pageChanged = pageChanged;
      vm.showArv = showArv;
      vm.openNewPatientMedicationModal = openNewPatientMedicationModal;
      vm.openEditPatientMedicationModal = openEditPatientMedicationModal;
      vm.openNewRecetaModal = openNewRecetaModal;
      vm.hasActiveMedications = hasActiveMedications;
      vm.isSearching = false;
      vm.recipePatientMedications = [];

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
        searchRecipePatientMedications();
	    }

      function pageChanged() {
        searchPatientMedications();
        searchRecipePatientMedications();
      }

      function searchPatientMedications() {
        vm.isSearching = true;
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.notMedicationTypeCode = 'PROF';
        HCService.getPatientMedications(vm.filters).$promise.then(function (paginatedResult) {
          vm.isSearching = false;
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        }, function (err) {
          vm.isSearching = false;
          if(err.status !== 403 && err.status !== 401){
            displayComunicationError();
          }
        });
      }

      function searchRecipePatientMedications(){
        vm.recipeFilters.notMedicationTypeCode = 'PROF';
        HCService.getPatientMedicationsForRecipe(vm.recipeFilters).$promise.then(function (paginatedResult) {
          vm.isSearching = false;
          vm.recipePatientMedications = paginatedResult.results;
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        }, function (err) {
          vm.isSearching = false;
          if(err.status !== 403 && err.status !== 401){
            displayComunicationError();
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
            searchRecipePatientMedications();
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
            searchRecipePatientMedications();
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
          if(error.data){
            if(error.data.detail){
              toastr.error(error.data.detail);
            }else{
              toastr.error(error.data);
            }
          }else{
            toastr.error(error);
          }
        }else{
          toastr.error('Ocurrio un error');
        }
      }
    }
})();