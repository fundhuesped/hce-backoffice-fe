(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientProfilaxisMedicationController', newPatientProfilaxisMedicationController);

	  newPatientProfilaxisMedicationController.$inject = ['$state', 'HCService', 'PatientMedication', 'toastr', 'moment', 'Medication', '$uibModalInstance'];

    function newPatientProfilaxisMedicationController ($state, HCService, PatientMedication, toastr, moment, Medication, $uibModalInstance) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientMedication = new PatientMedication();
      vm.save = save;
      vm.getMedications = getMedications;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.error = null;

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
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.endDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };
      activate();

      function save() {

        vm.error = null;
        if(moment(vm.newPatientMedication.startDate).diff(moment())>0){
          vm.error = 'La fecha de inicio no puede ser mayor a hoy';
          return;
        }
        if(moment(vm.newPatientMedication.endDate).diff(moment())>0){
          vm.error = 'La fecha de fin no puede ser mayor a hoy';
          return;
        }
        if(vm.newPatientMedication.endDate && moment(vm.newPatientMedication.startDate).diff(vm.newPatientMedication.endDate)>0){
          vm.error = 'La fecha de fin no puede ser menor a la fecha de inicio';
          return;
        }

        var tmpPatientMedication = angular.copy(vm.newPatientMedication);
        tmpPatientMedication.paciente = HCService.currentPaciente.id;
        tmpPatientMedication.startDate = moment(tmpPatientMedication.startDate).format('YYYY-MM-DD');
        if(tmpPatientMedication.endDate && tmpPatientMedication.state == 'Closed'){
          tmpPatientMedication.endDate = moment(tmpPatientMedication.endDate).format('YYYY-MM-DD');
        }

        tmpPatientMedication.$save({pacienteId:HCService.currentPaciente.id},function() {
          toastr.success('Medicación guardada con exito');
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newPatientMedication &&vm.newPatientMedication.medication && vm.newPatientMedication.startDate){
          return true;
        }
        return false;
      }

	    function activate(){
        Medication.getActiveList(function(medications){
          vm.medications = medications;
        }, displayComunicationError);
        HCService.getPatientProblems();
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
          name : $viewValue,
          medicationTypeCode : 'PROF'
        };

        return Medication.getFullActiveList(filters, function(medications){
          vm.medications = medications;
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