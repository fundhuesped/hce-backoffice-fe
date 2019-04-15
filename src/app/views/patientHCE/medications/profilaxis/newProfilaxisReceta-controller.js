(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewProfilaxisMedicationRecetaController', newProfilaxisMedicationRecetaController);

	  newProfilaxisMedicationRecetaController.$inject = ['$state', 'HCService', 'PatientMedication', 'Receta', 'toastr', 'moment', 'Medication', '$uibModalInstance', '$window'];

    function newProfilaxisMedicationRecetaController ($state, HCService, PatientMedication, Receta, toastr, moment, Medication, $uibModalInstance, $window) {
	    var vm = this;
      vm.hceService = HCService;
      vm.patientMedications = [];
      vm.newReceta = new Receta();
      vm.save = save;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.toggleMedicationSelection = toggleMedicationSelection;
      vm.cantRecetas = 1;
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
          tmpNewReceta.prescriptedMedications.push({patientMedication:vm.selectedMedications[i], quantityPerDay:vm.selectedMedications[i].quantityPerDay, quantityPerMonth:vm.selectedMedications[i].quantityPerMonth});
        }
        tmpNewReceta.prescripctionType = 'Prophylaxis';
        tmpNewReceta.issuedDate = moment(tmpNewReceta.issuedDate).format('YYYY-MM-DD');
        var issuedDateFormatted = tmpNewReceta.issuedDate;

        tmpNewReceta.$save({pacienteId:HCService.currentPaciente.id},function(prescription) {
          toastr.success('Receta generada con éxito');
          var url = $state.href('profilaxisPrescription', {
            prescriptionId: prescription.id,
            issuedDate: issuedDateFormatted
          });
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
        PatientMedication.getForPaciente({pacienteId:HCService.currentPacienteId, state: 'Active', medicationTypeCode: 'PROF'}, function (results) {
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