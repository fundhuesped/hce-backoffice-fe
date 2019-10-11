(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientClinicalResultsListController', patientClinicalResultsListController);

	   patientClinicalResultsListController.$inject = ['$state', 'HCService', 'PatientClinicalResult', 'toastr', 'moment', '$uibModal','SessionService'];

    function patientClinicalResultsListController ($state, HCService, PatientClinicalResult, toastr, moment, $uibModal, SessionService) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientClinicalResults = searchPatientClinicalResults;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.hasPermissions = false;
      vm.pageChanged = pageChanged;
      vm.patientClinicalResults = [];
      vm.isSearching = false;

      vm.openNewPatientClinicalResultModal = openNewPatientClinicalResultModal;
      vm.openEditPatientClinicalResultModal = openEditPatientClinicalResultModal;

      activate();

	    function activate(){
        searchPatientClinicalResults();

        SessionService.checkPermission('hc_masters.add_clinicalstudy')
            .then( function(hasPerm){
                vm.hasPermissions = hasPerm;
            }, function(error){
                vm.hasPermissions = false;
                console.error("=== Error al verificar permisos en controlador ===");
                console.error(error);
                console.trace();
            });
	    }

      function pageChanged() {
        searchPatientClinicalResults();
      }

      function searchPatientClinicalResults() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.pacienteId = HCService.currentPacienteId;
        vm.isSearching = true;
        PatientClinicalResult.getPaginatedForPaciente(vm.filters, function (paginatedResult) {
          vm.isSearching = false;
          vm.patientClinicalResults = paginatedResult.results;
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        }, function (err) {
          vm.isSearching = false;
          displayComunicationError();
        });
      }

      function openEditPatientClinicalResultModal(selection) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/clinicalResults/editPatientClinicalResult.html',
          size: 'md',
          controller: 'EditPatientClinicalResultController',
          controllerAs: 'EditPatientClinicalResultController',
          resolve: {
            patientClinicalResult: function () {
              return selection;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='edited'){
            searchPatientClinicalResults();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }

      function openNewPatientClinicalResultModal() {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/clinicalResults/newPatientClinicalResult.html',
          size: 'md',
          controller: 'NewPatientClinicalResultsController',
          controllerAs: 'NewPatientClinicalResultsController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='created'){
            searchPatientClinicalResults();
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