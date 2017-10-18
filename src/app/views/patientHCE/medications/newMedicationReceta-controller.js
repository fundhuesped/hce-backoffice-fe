(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewMedicationRecetaController', newMedicationRecetaController);

	  newMedicationRecetaController.$inject = ['$state', 'HCService', 'PatientMedication', 'Receta', 'toastr', 'moment', 'Medication', '$uibModalInstance', '$window'];

    function newMedicationRecetaController ($state, HCService, PatientMedication, Receta, toastr, moment, Medication, $uibModalInstance, $window) {
	    var vm = this;
      vm.hceService = HCService;
      vm.patientMedications = [];
      vm.newReceta = new Receta();
      vm.save = save;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.toggleMedicationSelection = toggleMedicationSelection;
      vm.selectedMedications = [];
      vm.startDateCalendar = {
        opened: false,
        options: {
          minDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      activate();

      function save() {
        var tmpNewReceta = angular.copy(vm.newReceta);
        tmpNewReceta.prescriptedMedications = [];

        for (var i = vm.selectedMedications.length - 1; i >= 0; i--) {
          tmpNewReceta.prescriptedMedications.push({medication:vm.selectedMedications[i]});
        }
        tmpNewReceta.prescripctionType = 'General';
        tmpNewReceta.$save({pacienteId:HCService.currentPaciente.id},function(prescription) {
          toastr.success('Receta generada con éxito');
          var url = $state.href('generalPrescription', {prescriptionId: prescription.id});
          $window.open(url,'_blank');
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newReceta && vm.newReceta.issuedDate && vm.selectedMedications.length > 0 && hasSelectedMedicationQuantity){
          return true;
        }
        return false;
      }

      function hasSelectedMedicationQuantity() {
        return true;
      }

	    function activate(){
        PatientMedication.getForPaciente({pacienteId:HCService.currentPacienteId, state: 'Active'}, function (results) {
          vm.patientMedications = results;
        });
	    }


	    function toggleMedicationSelection(medication) {
	    	if(vm.selectedMedications.length>0){
		    	for (var i = vm.selectedMedications.length - 1; i >= 0; i--) {
		    		if(vm.selectedMedications.id == medication.id){
	    			    vm.selectedMedications.splice(i, 1);
		    			return;
		    		}
		    	}
    			vm.selectedMedications.push(medication);
	    	}else{
	    		vm.selectedMedications.push(medication);
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