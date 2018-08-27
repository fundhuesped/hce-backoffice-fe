(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientVaccineController', newPatientVaccineController);

	  newPatientVaccineController.$inject = ['$state', 'HCService', 'PatientVaccine', 'toastr', 'moment', 'Vaccine', '$uibModalInstance'];

    function newPatientVaccineController ($state, HCService, PatientVaccine, toastr, moment, Vaccine, $uibModalInstance) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientVaccine = new PatientVaccine();
      vm.save = save;
      vm.getVaccines = getVaccines;
      vm.cancel = cancel;
      vm.newProblemDateOption = null;
      vm.newProblemDate = null;
      vm.canSave = canSave;
      vm.error = null;

      vm.applicationDateCalendar = {
        altInputFormats: ['d!-M!-yyyy'],
        opened: false,
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
        var tmpPatientVaccine = angular.copy(vm.newPatientVaccine);
        tmpPatientVaccine.paciente = HCService.currentPaciente.id;
        tmpPatientVaccine.appliedDate = moment(tmpPatientVaccine.appliedDate).format('YYYY-MM-DD');
        if(moment(tmpPatientVaccine.appliedDate).diff(moment())>0){
          vm.error = 'La fecha de aplicación no puede ser mayor a hoy';
          return;
        }

        tmpPatientVaccine.$save({pacienteId:HCService.currentPaciente.id},function() {
          toastr.success('Aplicación guardada con exito');
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newPatientVaccine &&vm.newPatientVaccine.vaccine && vm.newPatientVaccine.appliedDate){
          return true;
        }
        return false;
      }

	    function activate(){
        Vaccine.getActiveList(function(vaccines){
          vm.vaccines = vaccines;
        }, displayComunicationError);
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