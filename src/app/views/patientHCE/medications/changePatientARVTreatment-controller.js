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
        
        var treatmentToUnedit = new PatientArvTreatment();
        Object.assign(treatmentToUnedit, tmpPatientArvTreatment);
        HCService.agregarAlHistorial(function(){
          treatmentToUnedit.$delete(function(){
            console.log('Supuestamente pudo borrar el arvTreatment editado');
            treatmentToUnedit.$save({pacienteId:HCService.currentPacienteId}, function(){
              console.log('Supuestamente pudo volver a crear el arvTreatment antes de ser editado');
            },  console.error);
          },  console.error);
        });

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

      function parseError(errorData){
        if(errorData.startsWith("AssertionError")){
          var errorAuxArray = (errorData.split('\n'));
          var errorToReturn = errorAuxArray[1];
          return errorToReturn;
        }
        return errorData;
      }

      function showError(error) {
        if(error){
          if(error.data){
            var errorToShow = parseError(error.data);
            if(errorToShow.detail){
              toastr.error(errorToShow.detail);
            }else{
              toastr.error(errorToShow);
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