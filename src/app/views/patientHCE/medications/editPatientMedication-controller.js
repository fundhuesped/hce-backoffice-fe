(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditPatientMedicationController', editPatientMedicationController);

	  editPatientMedicationController.$inject = ['$state', 'HCService', 'PatientMedication', 'toastr', 'moment', 'Medication', '$uibModalInstance', 'patientMedication', 'SessionService'];

    function editPatientMedicationController ($state, HCService, PatientMedication, toastr, moment, Medication, $uibModalInstance, patientMedication, SessionService) {
	    var vm = this;
      vm.hceService = HCService;
      vm.save = save;
      vm.patientMedication = {};
      vm.getMedications = getMedications;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.markAsError = markAsError;
      vm.changeStatus = changeStatus;
      vm.canEdit = canEdit;

      Object.defineProperty(
          vm,
          'patientProblems', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.activeProblems;
          }
      });


      vm.startDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        updateMaxVal: function () {
          this.options.maxDate = (vm.patientMedication.endDate?vm.patientMedication.endDate:new Date());
        },

        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.endDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        updateMinVal: function () {
          this.options.minDate = (vm.patientMedication.startDate?vm.patientMedication.startDate:new Date());
        },

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

        var tmpPatientMedication = angular.copy(vm.patientMedication);
        tmpPatientMedication.startDate = moment(tmpPatientMedication.startDate).format('YYYY-MM-DD');
        if(tmpPatientMedication.endDate && tmpPatientMedication.state == 'Closed'){
          tmpPatientMedication.endDate = moment(tmpPatientMedication.endDate).format('YYYY-MM-DD');
        }
        PatientMedication.update(tmpPatientMedication, function (response) {
          toastr.success('Medicación guardada con exito');
          $uibModalInstance.close('edited');
        }, showError);
      }

      function changeStatus() {
        if(vm.patientMedication.state == 'Active'){
          vm.patientMedication.endDate = null;
          vm.startDateCalendar.options.maxDate = new Date();
        }
      }

      function canSave() {
        if(vm.controllerForm.$valid){
          return true;
        }
        return false;
      }

	    function activate(){
        Medication.getActiveList(function(medications){
          vm.medications = medications;
        }, displayComunicationError);
        HCService.getPatientProblems();
        vm.patientMedication = angular.copy(patientMedication);
        vm.patientMedication.startDate = new Date(vm.patientMedication.startDate + 'T03:00:00');
        vm.endDateCalendar.options.minDate = vm.patientMedication.startDate;

        if(vm.patientMedication.endDate && (vm.patientMedication.state == 'Closed' || vm.patientMedication.state == 'Error') ){
          vm.patientMedication.endDate = new Date(vm.patientMedication.endDate + 'T03:00:00');
          vm.startDateCalendar.options.maxDate = new Date();

        }

	    }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }


      function getMedications($viewValue) {
        var filters = {
          name : $viewValue
        };

        return Medication.getFullActiveList(filters, function(medications){
          vm.medications = medications;
        }, displayComunicationError).$promise;

      }
      function canEdit() {
        return patientMedication.profesional.id == SessionService.currentUser.id && (moment().diff(moment(patientMedication.createdOn), 'hours') <= 8);
      }


      function markAsError() {
        var tmpPatientMedication = angular.copy(vm.patientMedication);
        tmpPatientMedication.state = PatientMedication.stateChoices.STATE_ERROR;
        tmpPatientMedication.startDate = moment(tmpPatientMedication.startDate).format('YYYY-MM-DD');
        if(tmpPatientMedication.endDate){
          tmpPatientMedication.endDate = moment(tmpPatientMedication.endDate).format('YYYY-MM-DD');
        }
        PatientMedication.update(tmpPatientMedication, function (response) {
            toastr.success('Medicación marcada como error');
          $uibModalInstance.close('markedError');
        }, function (err) {
            console.error(err);
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