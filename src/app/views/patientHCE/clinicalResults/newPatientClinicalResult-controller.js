(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientClinicalResultsController', newPatientClinicalResultsController);

	  newPatientClinicalResultsController.$inject = ['$state', 'HCService', 'PatientClinicalResult', 'toastr', 'moment', 'ClinicalStudy', '$uibModalInstance'];

    function newPatientClinicalResultsController ($state, HCService, PatientClinicalResult, toastr, moment, ClinicalStudy, $uibModalInstance) {
	    var vm = this;
      vm.hceService = HCService;
      vm.save = save;
      vm.newPatientClinicalResult = new PatientClinicalResult();
      vm.clinicalStudies = [];
      vm.getClinicalStudies = getClinicalStudies;
      vm.cancel = cancel;
      vm.canSave = canSave;

      vm.studyDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      activate();

      function save() {
        var tmpPatientClinicalResult = angular.copy(vm.newPatientClinicalResult);
        tmpPatientClinicalResult.paciente = HCService.currentPaciente.id;
        tmpPatientClinicalResult.studyDate = moment(tmpPatientClinicalResult.studyDate).format('YYYY-MM-DD');

        tmpPatientClinicalResult.$save({pacienteId:HCService.currentPaciente.id},function() {
          toastr.success('Resultado guardado con exito');
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newPatientClinicalResult &&vm.newPatientClinicalResult.clinicalStudy && vm.newPatientClinicalResult.studyDate){
          return true;
        }
        return false;
      }

	    function activate(){
        ClinicalStudy.getActiveList(function(clinicalStudied){
          vm.clinicalStudied = clinicalStudied;
        }, displayComunicationError);
	    }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }


      function getClinicalStudies($viewValue) {
        var filters = {
          name : $viewValue
        };
        return ClinicalStudy.getFullActiveList(filters, function(clinicalStudies){
          vm.clinicalStudies = clinicalStudies;
        }, displayComunicationError).$promise;

      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
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