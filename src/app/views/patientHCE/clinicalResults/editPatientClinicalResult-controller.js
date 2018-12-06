(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditPatientClinicalResultController', editPatientClinicalResultController);

	  editPatientClinicalResultController.$inject = ['$state', 'HCService', 'PatientClinicalResult', 'toastr', 'moment', 'ClinicalStudy', '$uibModalInstance', 'patientClinicalResult'];

    function editPatientClinicalResultController ($state, HCService, PatientClinicalResult, toastr, moment, ClinicalStudy, $uibModalInstance, patientClinicalResult) {
	    var vm = this;
      vm.hceService = HCService;
      vm.save = save;
      vm.patientClinicalResult = {};
      vm.clinicalStudies = [];
      vm.getClinicalStudies = getClinicalStudies;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.markAsError = markAsError;
      vm.canEdit = canEdit;
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

        var tmpPatientClinicalResult = angular.copy(vm.patientClinicalResult);
        tmpPatientClinicalResult.studyDate = moment(tmpPatientClinicalResult.studyDate).format('YYYY-MM-DD');
        PatientClinicalResult.update(tmpPatientClinicalResult, function (response) {
          toastr.success('Resultado guardado con éxito');
          $uibModalInstance.close('edited');
        }, showError);
      }

      function canSave() {
        if(vm.patientClinicalResult &&vm.patientClinicalResult.clinicalStudy && vm.patientClinicalResult.studyDate){
          return true;
        }
        return false;
      }

	    function activate(){
        ClinicalStudy.getActiveList(function(clinicalStudies){
          vm.clinicalStudies = clinicalStudies;
        }, displayComunicationError);
        vm.patientClinicalResult = angular.copy(patientClinicalResult);
        vm.patientClinicalResult.studyDate = new Date(vm.patientClinicalResult.studyDate + 'T03:00:00');
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

      function canEdit() {
        return moment().diff(moment(patientClinicalResult.createdOn), 'hours') <= 8;
      }

      function markAsError() {
        var tmpPatientClinicalResult = angular.copy(vm.patientClinicalResult);
        tmpPatientClinicalResult.state = PatientClinicalResult.stateChoices.STATE_ERROR;
        tmpPatientClinicalResult.studyDate = moment(tmpPatientClinicalResult.studyDate).format('YYYY-MM-DD');
        PatientClinicalResult.update(tmpPatientClinicalResult, function (response) {
            toastr.success('Resultado marcado como error');
          $uibModalInstance.close('markedError');
        }, function (err) {
            toastr.error('Ocurrio un error');
        });
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