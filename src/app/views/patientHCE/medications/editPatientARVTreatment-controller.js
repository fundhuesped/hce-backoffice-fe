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
      vm.cancel = cancel;


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

	    function activate(){
        Medication.getActiveList({medicationTypeCode:'NRTI'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.nrtiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'NNRTI'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.nnrtiMedications = medications;
        }, displayComunicationError);

        Medication.getActiveList({medicationTypeCode:'IP'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.ipMedications = medications;
        }, displayComunicationError);

        Medication.getActiveList({medicationTypeCode:'INI'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.iiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'COMBO'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.comboMedications = medications;
        }, displayComunicationError);


        Medication.getActiveList({medicationGroup:'ARV', medicationTypeCode: 'OTROS'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
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