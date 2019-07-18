(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewMedicationRecetaController', newMedicationRecetaController);

	  newMedicationRecetaController.$inject = ['$state', 'HCService', 'PatientMedication', 'Receta', 'toastr', 'moment', 'Medication', '$uibModalInstance', '$uibModal', '$window'];

    function newMedicationRecetaController ($state, HCService, PatientMedication, Receta, toastr, moment, Medication, $uibModalInstance, $uibModal, $window) {
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
        altInputFormats: ['d!-M!-yyyy'],
        options: {
          showWeeks: false,
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
        tmpNewReceta.cantRecetas = 1;

        for (var i = vm.selectedMedications.length - 1; i >= 0; i--) {
          tmpNewReceta.prescriptedMedications.push({patientMedication:vm.selectedMedications[i].id, quantityPerMonth:vm.selectedMedications[i].quantityPerMonth});
        }
        tmpNewReceta.prescripctionType = 'General';
        tmpNewReceta.issuedDate = moment(tmpNewReceta.issuedDate).format('YYYY-MM-DD');

        tmpNewReceta.$save({pacienteId:HCService.currentPaciente.id},function(prescription) {
          toastr.success('Receta generada con éxito');
          openModal([prescription.id]);
          $uibModalInstance.close('created');
        }, showError);
      }

      function openModal(prescriptions) {
        vm.cancel();
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'app/views/patientHCE/prescriptions/medicationRecetaNueva.html',
            size: 'lg',
            controller: 'MedicationRecetaNuevaController',
            controllerAs: 'MedicationRecetaNuevaController',
            resolve: {
                prescriptions: function () {
                    return prescriptions;
                },
            }
        });
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


	    function toggleMedicationSelection(patientMedication) {
	    	if(vm.selectedMedications.length>0){
		    	for (var i = vm.selectedMedications.length - 1; i >= 0; i--) {
		    		if(vm.selectedMedications[i].medication.id == patientMedication.medication.id){
	    			    vm.selectedMedications.splice(i, 1);
                patientMedication.quantityPerMonth = null;
		    			return;
		    		}
		    	}
          if(vm.selectedMedications.length<2){
            if(!patientMedication.quantityPerMonth){
              patientMedication.quantityPerMonth = 1;
            }
            vm.selectedMedications.push(patientMedication);          
          }
	    	}else{
          if(vm.selectedMedications.length<2){
            if(!patientMedication.quantityPerMonth){
              patientMedication.quantityPerMonth = 1;
            }
            vm.selectedMedications.push(patientMedication);          
          }
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
          if(error.data){
            if(error.data.detail){
              toastr.error(error.data.detail);
            }else{
              toastr.error(error.data);
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