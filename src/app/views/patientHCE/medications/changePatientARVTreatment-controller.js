(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('ChangePatientArvTreatmentController', changePatientArvTreatmentController);

	  changePatientArvTreatmentController.$inject = ['$state', 'HCService', 'PatientArvTreatment', 'toastr', 'moment', '$uibModalInstance', 'patientArvTreatment'];

    function changePatientArvTreatmentController ($state, HCService, PatientArvTreatment, toastr, moment, $uibModalInstance, patientArvTreatment) {
	    var vm = this;
      vm.save = save;
      vm.patientArvTreatment = {};
      vm.cancel = cancel;
      vm.canSave = canSave;


      vm.changeReasons = ['Toxicidad', 
                          'Abandono',
                          'Simplificacion',
                          'Fallo'];


      vm.endDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        options: {
          showWeeks: false,
          maxDate: new Date(),
          minDate: patientArvTreatment.startDate
        },
        open : function(){
          this.opened = true;
        }
      };

      activate();

      function save() {

        var tmpPatientArvTreatment = angular.copy(vm.patientArvTreatment);
        tmpPatientArvTreatment.endDate = moment(tmpPatientArvTreatment.endDate).format('YYYY-MM-DD');
        tmpPatientArvTreatment.startDate = patientArvTreatment.startDate;
        tmpPatientArvTreatment.state = 'Closed';
        PatientArvTreatment.update(tmpPatientArvTreatment, function (response) {
          toastr.success('Cambio guardado con éxito');
          $uibModalInstance.close('edited');
        }, showError);
      }

      function canSave() {
        if(vm.finalizeTreatmentForm.$valid){
          return true;
        }
        return false;
      }

	    function activate(){
        vm.patientArvTreatment = angular.copy(patientArvTreatment);
        vm.patientArvTreatment.endDate = new Date(vm.patientArvTreatment.endDate + 'T03:00:00');
        vm.patientArvTreatment.startDate = new Date(vm.patientArvTreatment.startDate + 'T03:00:00')
        vm.endDateCalendar.options.minDate = vm.patientArvTreatment.startDate;        
	    }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
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