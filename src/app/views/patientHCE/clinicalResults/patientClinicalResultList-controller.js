(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientClinicalResultsListController', patientClinicalResultsListController);

	   patientClinicalResultsListController.$inject = ['$state', 'HCService', 'PatientClinicalResult', 'toastr', 'moment', '$uibModal'];

    function patientClinicalResultsListController ($state, HCService, PatientClinicalResult, toastr, moment, $uibModal) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientClinicalResults = searchPatientClinicalResults;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.pageChanged = pageChanged;
      vm.patientClinicalResults = [];


      vm.openNewPatientClinicalResultModal = openNewPatientClinicalResultModal;
      vm.openEditPatientClinicalResultModal = openEditPatientClinicalResultModal;

      activate();

	    function activate(){
        searchPatientClinicalResults();
	    }

      function pageChanged() {
        searchPatientClinicalResults();
      }

      function searchPatientClinicalResults() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.pacienteId = HCService.currentPacienteId;
        PatientClinicalResult.getPaginatedForPaciente(vm.filters, function (paginatedResult) {
          vm.patientClinicalResults = paginatedResult.results;
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        }, function (err) {
          // body...
        });
      }

      function openEditPatientClinicalResultModal(selection) {
        var modalInstance = $uibModal.open({
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
          toastr.error(error.data.detail);
        }else{
          toastr.error('Ocurrio un error');
        }
      }
    }
})();