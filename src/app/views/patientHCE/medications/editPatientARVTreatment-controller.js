(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditPatientARVTreatmentController', editPatientARVTreatmentController);

	  editPatientARVTreatmentController.$inject = ['$state', 'HCService', 'PatientArvTreatment', 'toastr', 'moment', 'Medication', '$uibModalInstance', '$filter', 'patientArvTreatment'];

    function editPatientARVTreatmentController ($state, HCService, PatientArvTreatment, toastr, moment, Medication, $uibModalInstance, $filter, patientArvTreatment) {
	    var vm = this;
      vm.hceService = HCService;
      vm.patientArvTreatment = patientArvTreatment;
      vm.save = save;
      vm.cancel = cancel;
      vm.canSave = canSave;


      vm.nrtiMedications = [];
      vm.nnrtiMedications = [];
      vm.ipMedications = [];
      vm.iiMedications = [];
      vm.comboMedications = [];
      vm.otherMedications = [];

      vm.changeReasons = ['Toxicidad', 
                          'Abandono',
                          'Simplificacion',
                          'Fallo'];


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
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.endDateCalendar = {
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
        var tmpPatientArvTreatment = angular.copy(vm.patientArvTreatment);
        tmpPatientArvTreatment.paciente = HCService.currentPaciente.id;
        tmpPatientArvTreatment.startDate = moment(tmpPatientArvTreatment.startDate).format('YYYY-MM-DD');
        if(tmpPatientArvTreatment.endDate && tmpPatientArvTreatment.state == 'Closed'){
          tmpPatientArvTreatment.endDate = moment(tmpPatientArvTreatment.endDate).format('YYYY-MM-DD');
        }

        PatientArvTreatment.update(vm.patientArvTreatment,function() {
          toastr.success('Tratamiento editado con exito');
          $uibModalInstance.close('edited');
        }, showError);
      }

      function canSave() {
        if(vm.patientArvTreatment && vm.newPatientArvTreatment.startDate){
          return true;
        }
        return false;
      }

	    function activate(){
        Medication.getActiveList({medicationTypeCode:'NRTI'},function(medications){
          vm.nrtiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'NNRTI'},function(medications){
          vm.nnrtiMedications = medications;
        }, displayComunicationError);

        Medication.getActiveList({medicationTypeCode:'IP'},function(medications){
          vm.ipMedications = medications;
        }, displayComunicationError);

        Medication.getActiveList({medicationTypeCode:'II'},function(medications){
          vm.iiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'COMBO'},function(medications){
          vm.comboMedications = medications;
        }, displayComunicationError);


        Medication.getActiveList({medicationGroup:'ARV', medicationTypeCode: 'OTROS'},function(medications){
          vm.otherMedications = medications;
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