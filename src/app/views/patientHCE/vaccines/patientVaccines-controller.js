(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientVaccinesController', patientVaccinesController);

	patientVaccinesController.$inject = ['$state', 'HCService', 'PatientVaccine', 'Vaccine', 'toastr', 'moment', '$uibModal', 'lodash'];

    function patientVaccinesController ($state, HCService, PatientVaccine, Vaccine, toastr, moment, $uibModal, lodash) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientVaccines = searchPatientVaccines;
      vm.problems = [];
      vm.filters = {};
      vm.pageChanged = pageChanged;
      vm.getVaccines = getVaccines;
      vm.openNewRecetaModal = openNewRecetaModal;
      vm.hasVaccines = hasVaccines;
      vm.vaccinesList = [];
      vm.openNewPatientVaccineModal = openNewPatientVaccineModal;
      vm.openEditPatientVaccineModal = openEditPatientVaccineModal;
      vm.isSearching = false;

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
        vm.isSearching = true;
        vm.filters.all = true;
        HCService.getPatientVaccines(vm.filters).$promise.then(function (result) {
          vm.isSearching = false;
          vm.vaccinesList = result;
          vm.vaccines = lodash.groupBy(result, 'vaccine.name');
        }, function (err) {
          vm.isSearching = false;
          displayComunicationError();
        });
      }

      function hasVaccines() {
        return vm.vaccinesList.length>0;
      }

      function openEditPatientVaccineModal(selectedVaccine) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
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
          backdrop: 'static',
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

      function openNewRecetaModal(){
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/vaccines/newVaccinePrescription.html',
          size: 'md',
          controller: 'NewVaccinePrescriptionController',
          controllerAs: 'Ctrl'
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

        return Vaccine.getFullActiveList(filters, function(vaccines){
          vm.vaccines = vaccines;
        }, displayComunicationError).$promise;

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