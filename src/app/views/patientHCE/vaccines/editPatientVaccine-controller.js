(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditPatientVaccineController', editPatientVaccineController);

	  editPatientVaccineController.$inject = ['$state', 'HCService', 'PatientVaccine', 'toastr', 'moment', 'Vaccine', '$uibModalInstance', 'patientVaccine'];

    function editPatientVaccineController ($state, HCService, PatientVaccine, toastr, moment, Vaccine, $uibModalInstance, patientVaccine) {
	    var vm = this;
      vm.hceService = HCService;
      vm.save = save;
      vm.patientVaccine = {};
      vm.getVaccines = getVaccines;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.markAsError = markAsError;
      vm.error = null;

      vm.applicationDateCalendar = {
        altInputFormats: ['d!-M!-yyyy'],
        opened: false,
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
        vm.error = null;
        var tmpPatientVaccine = angular.copy(vm.patientVaccine);
        tmpPatientVaccine.appliedDate = moment(tmpPatientVaccine.appliedDate).format('YYYY-MM-DD');

        if(moment(tmpPatientVaccine.appliedDate).diff(moment())>0){
          vm.error = 'La fecha de aplicación no puede ser mayor a hoy';
          return;
        }

        PatientVaccine.update(tmpPatientVaccine,function() {
          toastr.success('Aplicación guardada con exito');
          $uibModalInstance.close('edited');
        }, showError);
      }

      function canSave() {
        if(vm.patientVaccine &&vm.patientVaccine.vaccine && vm.patientVaccine.appliedDate){
          return true;
        }
        return false;
      }

	    function activate(){
        Vaccine.getActiveList(function(vaccines){
          vm.vaccines = vaccines;
        }, displayComunicationError);
        vm.patientVaccine = angular.copy(patientVaccine);
        vm.patientVaccine.appliedDate = new Date(vm.patientVaccine.appliedDate + 'T03:00:00');
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

      function markAsError() {
        var tmpVaccine = angular.copy(vm.patientVaccine);
        tmpVaccine.state = PatientVaccine.stateChoices.STATE_ERROR;
        tmpVaccine.appliedDate = moment(tmpVaccine.appliedDate).format('YYYY-MM-DD');
        PatientVaccine.update(tmpVaccine, function (response) {
            toastr.success('Aplicación marcada como error');
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