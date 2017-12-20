(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientProfilaxisMedicationListController', patientProfilaxisMedicationListController);

	   patientProfilaxisMedicationListController.$inject = ['$state', 'HCService', 'PatientMedication', 'Medication', 'toastr', 'moment', '$uibModal'];

    function patientProfilaxisMedicationListController ($state, HCService, PatientMedication, Medication, toastr, moment, $uibModal) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientProfilaxisMedications = searchPatientProfilaxisMedications;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.medications = [];
      vm.pageChanged = pageChanged;
      vm.openNewPatientMedicationModal = openNewPatientMedicationModal;
      vm.openEditPatientMedicationModal = openEditPatientMedicationModal;
      vm.patientProxilaxisMedications = [];
      vm.openNewRecetaModal = openNewRecetaModal;

      activate();

	    function activate(){
        searchPatientProfilaxisMedications();
	    }

      function pageChanged() {
        searchPatientProfilaxisMedications();
      }

      function searchPatientProfilaxisMedications() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.medicationTypeCode = 'PROF';
        vm.filters.pacienteId = HCService.currentPacienteId;
        PatientMedication.getPaginatedForPaciente(vm.filters, function (paginatedResult) {
          vm.patientMedications = paginatedResult.results;
          vm.totalItems = paginatedResult.count;
        }, function(argument) {
          // body...
        });
      }

      function openEditPatientMedicationModal(selectedMedication) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/medications/profilaxis/editPatientProfilaxisMedication.html',
          size: 'md',
          controller: 'EditPatientProfilaxisMedicationController',
          controllerAs: 'EditPatientMedicationController',
          resolve: {
            patientMedication: function () {
              return selectedMedication;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='edited'){
            searchPatientProfilaxisMedications();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }

      function openNewPatientMedicationModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/medications/profilaxis/newPatientProfilaxisMedication.html',
          size: 'md',
          controller: 'NewPatientProfilaxisMedicationController',
          controllerAs: 'NewPatientProfilaxisMedicationController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='created'){
            searchPatientProfilaxisMedications();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });

      }

      function openNewRecetaModal(){
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/medications/profilaxis/newProfilaxisMedicationReceta.html',
          size: 'md',
          controller: 'NewProfilaxisMedicationRecetaController',
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