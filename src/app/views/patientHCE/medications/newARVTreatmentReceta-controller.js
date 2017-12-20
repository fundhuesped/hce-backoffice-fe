(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewARVTreatmentRecetaController', newARVTreatmentRecetaController);

	  newARVTreatmentRecetaController.$inject = ['$state', 'HCService', 'PatientArvTreatment', 'Receta', 'toastr', 'moment', 'Medication', '$uibModalInstance', '$uibModal', '$window'];

    function newARVTreatmentRecetaController ($state, HCService, PatientArvTreatment, Receta, toastr, moment, Medication, $uibModalInstance, $uibModal, $window) {
	    var vm = this;
      vm.hceService = HCService;
      vm.arvTreatment = {};
      vm.newReceta = new Receta();
      vm.save = save;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.toggleMedicationSelection = toggleMedicationSelection;
      vm.cantRecetas = 1;
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
          tmpNewReceta.prescriptedMedications.push({medication:vm.selectedMedications[i].medication, quantityPerDay:vm.selectedMedications[i].quantityPerDay, quantityPerMonth:vm.selectedMedications[i].quantityPerMonth});
        }
        tmpNewReceta.prescripctionType = 'Arv';
        tmpNewReceta.$save({pacienteId:HCService.currentPaciente.id},function(prescription) {
          toastr.success('Receta generada con éxito');
          var url = $state.href('arvPrescription', {prescriptionId: prescription.id});
          $window.open(url,'_blank');
          openRecetaModal(prescription.id);
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newReceta && vm.cantRecetas > 0 && vm.newReceta.issuedDate && vm.selectedMedications.length > 0){
          return true;
        }
        return false;
      }

	    function activate(){
        PatientArvTreatment.getForPaciente({pacienteId:HCService.currentPacienteId, state: 'Active'}, function (result) {
          if(result.length>0){
              vm.arvTreatment = result[0];
              vm.selectedMedications = vm.arvTreatment.patientARVTreatmentMedications; 
              for (var i = vm.arvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
                vm.arvTreatment.patientARVTreatmentMedications[i].selected = true;
              }
          }else{
              vm.arvTreatment = null;
          }
        });

	    }
      function openRecetaModal(prescriptionId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/views/patientHCE/prescriptions/arvPrescription.html',
            size: 'md',
            controller: 'MedicationRecetaController',
            controllerAs: 'Ctrl',
            resolve: {
              prescriptionId: function () {
                return prescriptionId;
              }
            }
          });
      }

	    function toggleMedicationSelection(medication) {
	    	if(vm.selectedMedications.length>0){
		    	for (var i = vm.selectedMedications.length - 1; i >= 0; i--) {
		    		if(vm.selectedMedications.medication.id == medication.id){
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