(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientARVTreatmentListController', patientARVTreatmentListController);

	   patientARVTreatmentListController.$inject = ['$state', 'HCService', 'PatientArvTreatment', 'Medication', 'toastr', 'moment', '$uibModal', 'SessionService'];

    function patientARVTreatmentListController ($state, HCService, PatientArvTreatment, Medication, toastr, moment, $uibModal, SessionService) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientTreatments = searchPatientTreatments;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.pageChanged = pageChanged;
      vm.patientTreatments = [];
      vm.getSchema = getSchema;
      vm.hasPermissions = false;
      vm.openNewPatientARVTreatmentModal = openNewPatientARVTreatmentModal;
      vm.openEditPatientMedicationModal = openEditPatientMedicationModal;
      vm.openChangePatientArvTreatmentModal = openChangePatientArvTreatmentModal;
      vm.openNewRecetaModal = openNewRecetaModal;
      vm.isSearching = false;
      vm.deleteChange = deleteChange;
      activate();



      Object.defineProperty(
          vm,
          'currentARVTreatment', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentARVTreatment;
          }
      });

      function deleteChange(treatment){
        var tmpTreatment = new PatientArvTreatment();
        tmpTreatment.id = treatment.id;
        tmpTreatment.$delete(function(){
          toastr.success('Tratamiento eliminado con exito');
          searchPatientTreatments();
        }, showError);
      }

	    function activate(){
        searchPatientTreatments();

        SessionService.checkPermission('hc_hce.add_patientarvtreatment')
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
        searchPatientVaccines();
      }

      function searchPatientTreatments() {
        vm.isSearching = true;
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.pacienteId = HCService.currentPacienteId;
        HCService.getCurrentARVTreatment();
        PatientArvTreatment.getPaginatedForPaciente(vm.filters, function (paginatedResult) {
            vm.isSearching = false;
            vm.patientTreatments = paginatedResult.results;
        }, function (err) {
            vm.isSearching = false;
            if(err.status !== 403 && err.status !== 401){
              displayComunicationError(); 
            }
        });                
      }

      function getSchema(medications) {
        var nrti = [];
        var nnrti = [];
        var ip = [];
        var ii = [];
        var combo = [];
        var other = [];
        var schema = '';
        if(!medications){
          return;
        }
        for (var i = medications.length - 1; i >= 0; i--) {
          if(medications[i].medication.medicationType.code == 'NRTI'){
            nrti.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'NNRTI'){
            nnrti.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'IP'){
            ip.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'INI'){
            ii.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'COMBO'){
            combo.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'OTROS'){
            other.push(medications[i].medication.abbreviation);
          }
        }
        if(nrti.length>0){
          schema += '['; 
          for (var i = nrti.length - 1; i >= 0; i--) {
            schema += nrti[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(nnrti.length>0){
          schema += '['; 
          for (var i = nnrti.length - 1; i >= 0; i--) {
            schema += nnrti[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(ip.length>0){
          schema += '['; 
          for (var i = ip.length - 1; i >= 0; i--) {
            schema += ip[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(ii.length>0){
          schema += '['; 
          for (var i = ii.length - 1; i >= 0; i--) {
            schema += ii[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(combo.length>0){
          schema += '['; 
          for (var i = combo.length - 1; i >= 0; i--) {
            schema += combo[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(other.length>0){
          schema += '['; 
          for (var i = other.length - 1; i >= 0; i--) {
            schema += other[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += ']'; 
        }
        return schema;

      }

      function openEditPatientMedicationModal(selectedTreatment) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/medications/editPatientARVTreatment.html',
          size: 'lg',
          controller: 'EditPatientARVTreatmentController',
          controllerAs: 'EditPatientARVTreatmentController',
          resolve: {
            patientArvTreatment: function () {
              return selectedTreatment;
            }
          }
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

      function openNewRecetaModal(){
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/medications/newARVReceta.html',
          size: 'lg',
          controller: 'NewARVTreatmentRecetaController',
          controllerAs: 'NewARVTreatmentRecetaController'
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

      function openChangePatientArvTreatmentModal(selectedTreatment) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/medications/changePatientARVTreatment.html',
          size: 'md',
          controller: 'ChangePatientArvTreatmentController',
          controllerAs: 'ChangePatientArvTreatmentController',
          resolve: {
            patientArvTreatment: function () {
              return selectedTreatment;
            }
          }
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

      function openNewPatientARVTreatmentModal() {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/medications/newPatientArvTreatment.html',
          size: 'lg',
          controller: 'NewPatientArvTreatmentController',
          controllerAs: 'NewPatientArvTreatmentController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='created'){
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