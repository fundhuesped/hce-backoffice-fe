(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientVaccinesController', patientVaccinesController);

	patientVaccinesController.$inject = ['$state', 'HCService', 'PatientVaccine', 'Vaccine', 'toastr', 'moment', '$uibModal'];

    function patientVaccinesController ($state, HCService, PatientVaccine, Vaccine, toastr, moment, $uibModal) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientVaccines = searchPatientVaccines;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.pageChanged = pageChanged;
      vm.getVaccines = getVaccines;

      vm.openNewPatientVaccineModal = openNewPatientVaccineModal;
      vm.openEditPatientVaccineModal = openEditPatientVaccineModal;


      Object.defineProperty(
          vm,
          'patientVaccines', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.patientVaccines;
          }
      });

      activate();

	    function activate(){
        searchPatientVaccines();
	    }

      function pageChanged() {
        searchPatientVaccines();
      }

      function searchPatientVaccines() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        HCService.getPatientVaccines(vm.filters).$promise.then(function (paginatedResult) {
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        });
      }

      function openEditPatientVaccineModal(selectedVaccine) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/vaccines/editPatientVaccine.html',
          size: 'md',
          controller: 'EditPatientVaccineController',
          controllerAs: 'EditPatientVaccineController',
          resolve: {
            patientVaccine: function () {
              return selectedVaccine;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='edited'){
            searchPatientVaccines();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }

      function openNewPatientVaccineModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/vaccines/newPatientVaccine.html',
          size: 'md',
          controller: 'NewPatientVaccineController',
          controllerAs: 'NewPatientVaccineController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='created'){
            searchPatientVaccines();
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

      function getVaccines($viewValue) {
        var filters = {
          name : $viewValue
        };

        return Vaccine.getFullActiveList(filters, function(problems){
          vm.vaccines = vaccines;
        }, displayComunicationError).$promise;

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