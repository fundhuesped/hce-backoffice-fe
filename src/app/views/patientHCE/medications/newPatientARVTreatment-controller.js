(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientArvTreatmentController', newPatientArvTreatmentController);

	  newPatientArvTreatmentController.$inject = ['$state', 'HCService', 'PatientArvTreatment', 'toastr', 'moment', 'Medication', '$uibModalInstance', '$filter'];

    function newPatientArvTreatmentController ($state, HCService, PatientArvTreatment, toastr, moment, Medication, $uibModalInstance, $filter) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientArvTreatment = new PatientArvTreatment();
      vm.save = save;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.toggleMedicationSelection = toggleMedicationSelection;
      vm.showInfo = showInfo;


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

      Object.defineProperty(
          vm,
          'currentARVTreatment', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentARVTreatment;
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
        var tmpPatientArvTreatment = angular.copy(vm.newPatientArvTreatment);
        tmpPatientArvTreatment.paciente = HCService.currentPaciente.id;
        tmpPatientArvTreatment.startDate = moment(tmpPatientArvTreatment.startDate).format('YYYY-MM-DD');
        if(tmpPatientArvTreatment.endDate && tmpPatientArvTreatment.state == 'Closed'){
          tmpPatientArvTreatment.endDate = moment(tmpPatientArvTreatment.endDate).format('YYYY-MM-DD');
        }

        tmpPatientArvTreatment.$save({pacienteId:HCService.currentPaciente.id},function() {
          toastr.success('Tratamiento guardado con exito');
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newPatientArvTreatment &&vm.newPatientArvTreatment.patientARVTreatmentMedications && vm.newPatientArvTreatment.patientProblem &&vm.newPatientArvTreatment.patientARVTreatmentMedications.length > 0 && vm.newPatientArvTreatment.startDate){
          return true;
        }
        return false;
      }

      function showInfo() {
        var problems = $filter('filter')(HCService.activeProblems, {problem:{problemType:'HIV'}});
        if(problems && problems.length>0){
          return false;
        }else{
          return true;
        }
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

        Medication.getActiveList({medicationTypeCode:'INI'},function(medications){
          vm.iiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'COMBO'},function(medications){
          vm.comboMedications = medications;
        }, displayComunicationError);


        Medication.getActiveList({medicationGroup:'ARV', medicationTypeCode: 'OTROS'},function(medications){
          vm.otherMedications = medications;
        }, displayComunicationError);
        	HCService.getPatientProblems();

          if(vm.currentARVTreatment){
            vm.newPatientArvTreatment.state = 'Closed';
          }
	    }


	    function toggleMedicationSelection(medication) {
	    	if(vm.newPatientArvTreatment.patientARVTreatmentMedications){
	    		if(vm.newPatientArvTreatment.patientARVTreatmentMedications.length==0){
	    			vm.newPatientArvTreatment.patientARVTreatmentMedications.push({medication:medication});
	    			return;
	    		}
		    	for (var i = vm.newPatientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
		    		if(vm.newPatientArvTreatment.patientARVTreatmentMedications[i].medication.id == medication.id){
	    			    vm.newPatientArvTreatment.patientARVTreatmentMedications.splice(i, 1);
		    			return;
		    		}
		    	}
    			vm.newPatientArvTreatment.patientARVTreatmentMedications.push({medication:medication});
	    	}else{
	    		vm.newPatientArvTreatment.patientARVTreatmentMedications = [{medication:medication}];
	    	}
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