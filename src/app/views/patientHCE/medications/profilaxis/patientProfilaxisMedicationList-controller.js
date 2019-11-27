(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientProfilaxisMedicationListController', patientProfilaxisMedicationListController);

	   patientProfilaxisMedicationListController.$inject = ['$state',
                                                          'HCService',
                                                          'PatientMedication',
                                                          'Medication',
                                                          'toastr',
                                                          'moment',
                                                          '$uibModal',
                                                          'SessionService'];

    function patientProfilaxisMedicationListController ($state,
                                                        HCService,
                                                        PatientMedication,
                                                        Medication,
                                                        toastr,
                                                        moment,
                                                        $uibModal,
                                                        SessionService) {
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
      vm.hasPermissions = false;
      vm.openNewPatientMedicationModal = openNewPatientMedicationModal;
      vm.openEditPatientMedicationModal = openEditPatientMedicationModal;
      vm.patientProxilaxisMedications = [];
      vm.openNewRecetaModal = openNewRecetaModal;
      vm.hasActiveMedications = hasActiveMedications;
      vm.isSearching = false;
      vm.deleteChanges = deleteChanges;
      activate();


      Object.defineProperty(
          vm,
          'activePatientProfilaxisMedicationsCount', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.activePatientProfilaxisMedicationsCount;
          }
      });


	    function activate(){
        searchPatientProfilaxisMedications();

        SessionService.checkPermission('hc_hce.add_patientprescription')
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
        searchPatientProfilaxisMedications();
      }

      function deleteChanges(profilaxisMedication){
        var tmpProfilaxisMedication = new PatientMedication();
        tmpProfilaxisMedication.id = profilaxisMedication.id;
        tmpProfilaxisMedication.$delete(function(){
          toastr.success('Medicación eliminada con exito');
          searchPatientProfilaxisMedications();
        }, showError);
      }

      function searchPatientProfilaxisMedications() {
        vm.isSearching = true;
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.medicationTypeCode = 'PROF';
        vm.filters.pacienteId = HCService.currentPacienteId;
        PatientMedication.getPaginatedForPaciente(vm.filters, function (paginatedResult) {
        vm.isSearching = false;
          vm.patientMedications = paginatedResult.results;
          vm.totalItems = paginatedResult.count;
        }, function(err) {
          vm.isSearching = false;
          if(err.status !== 403){
            displayComunicationError();
          }
        });
      }

      function openEditPatientMedicationModal(selectedMedication) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
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
            HCService.getActivePatientProfilaxisMedications();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }

      function openNewPatientMedicationModal() {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/medications/profilaxis/newPatientProfilaxisMedication.html',
          size: 'md',
          controller: 'NewPatientProfilaxisMedicationController',
          controllerAs: 'NewPatientProfilaxisMedicationController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='created'){
            searchPatientProfilaxisMedications();
            HCService.getActivePatientProfilaxisMedications();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });

      }

      function openNewRecetaModal(){
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/medications/profilaxis/newProfilaxisMedicationReceta.html',
          size: 'lg',
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

      function hasActiveMedications() {
        return vm.hasPermissions && vm.activePatientProfilaxisMedicationsCount > 0;
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