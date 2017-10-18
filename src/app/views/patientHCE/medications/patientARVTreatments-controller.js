(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientARVTreatmentListController', patientARVTreatmentListController);

	   patientARVTreatmentListController.$inject = ['$state', 'HCService', 'PatientArvTreatment', 'Medication', 'toastr', 'moment', '$uibModal'];

    function patientARVTreatmentListController ($state, HCService, PatientArvTreatment, Medication, toastr, moment, $uibModal) {
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
      vm.openNewPatientARVTreatmentModal = openNewPatientARVTreatmentModal;
      vm.openEditPatientMedicationModal = openEditPatientMedicationModal;
      vm.openChangePatientArvTreatmentModal = openChangePatientArvTreatmentModal;
      vm.openNewRecetaModal = openNewRecetaModal;
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

	    function activate(){
        searchPatientTreatments();
	    }

      function pageChanged() {
        searchPatientVaccines();
      }

      function searchPatientTreatments() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.pacienteId = HCService.currentPacienteId;
        HCService.getCurrentARVTreatment();
        PatientArvTreatment.getPaginatedForPaciente(vm.filters, function (paginatedResult) {
            vm.patientTreatments = paginatedResult.results;
        }, function (err) {
             
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
          if(medications[i].medicationType.code == 'NRTI'){
            nrti.push(medications[i].abbreviation);
          }
          if(medications[i].medicationType.code == 'NNRTI'){
            nnrti.push(medications[i].abbreviation);
          }
          if(medications[i].medicationType.code == 'IP'){
            ip.push(medications[i].abbreviation);
          }
          if(medications[i].medicationType.code == 'II'){
            ii.push(medications[i].abbreviation);
          }
          if(medications[i].medicationType.code == 'COMBO'){
            combo.push(medications[i].abbreviation);
          }
          if(medications[i].medicationType.code == 'OTROS'){
            other.push(medications[i].abbreviation);
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
          templateUrl: 'app/views/patientHCE/medications/editPatientARVTreatment.html',
          size: 'lg',
          controller: 'EditPatientARVTreatmentController',
          controllerAs: 'Ctrl',
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
          templateUrl: 'app/views/patientHCE/medications/newARVReceta.html',
          size: 'md',
          controller: 'NewARVTreatmentRecetaController',
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

      function openChangePatientArvTreatmentModal(selectedTreatment) {
        var modalInstance = $uibModal.open({
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
          toastr.error(error.data.detail);
        }else{
          toastr.error('Ocurrio un error');
        }
      }
    }
})();