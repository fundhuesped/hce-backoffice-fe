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

        for (var i = vm.selectedMedications.length - 1; i >= 0; i--) {
          if(vm.selectedMedications[i].selected){
            tmpNewReceta.prescriptedMedications.push({medication:vm.selectedMedications[i].medication.id, quantityPerDay:vm.selectedMedications[i].quantityPerDay, quantityPerMonth:vm.selectedMedications[i].quantityPerMonth});
          }
        }
        tmpNewReceta.prescripctionType = 'Arv';
        tmpNewReceta.cantRecetas = vm.cantRecetas;
        tmpNewReceta.issuedDate = moment(tmpNewReceta.issuedDate).format('YYYY-MM-DD');

        tmpNewReceta.$save({pacienteId:HCService.currentPaciente.id},function(prescription) {
          toastr.success('Receta generada con éxito');
          if(prescription.prescriptionsIds){
            openModal(prescription.prescriptionsIds);
            //TODO Close?  $uibModalInstance.close('created');                                     
          }else{
            openModal([prescription.id]);
            $uibModalInstance.close('created');
          }
        }, showError);
      }

      function canSave() {
        if(vm.newReceta && vm.cantRecetas > 0 && vm.newReceta.issuedDate && vm.selectedMedications.length > 0){
          return true;
        }
        return false;
      }

      function openModal(prescriptions) {
        vm.cancel();
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'app/views/patientHCE/prescriptions/arvMedicationReceta.html',
            size: 'lg',
            controller: 'ArvMedicationRecetaController',
            controllerAs: 'ArvMedicationRecetaController',
            resolve: {
                prescriptions: function () {
                    return prescriptions;
                },
            }
        });
      }

	    function activate(){
        PatientArvTreatment.getForPaciente({pacienteId:HCService.currentPacienteId, state: 'Active'}, function (result) {
          if(result.length>0){
              vm.arvTreatment = result[0];
              vm.selectedMedications = vm.arvTreatment.patientARVTreatmentMedications; 
              for (var i = vm.arvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
                vm.arvTreatment.patientARVTreatmentMedications[i].selected = true;
                vm.arvTreatment.patientARVTreatmentMedications[i].quantityPerMonth = parseFloat(vm.arvTreatment.patientARVTreatmentMedications[i].quantityPerMonth);
                vm.arvTreatment.patientARVTreatmentMedications[i].quantityPerDay = parseFloat(vm.arvTreatment.patientARVTreatmentMedications[i].quantityPerDay);
              }
          }else{
              vm.arvTreatment = null;
          }
        });

	    }

	    function toggleMedicationSelection(medication) {
	    	for (var i = vm.selectedMedications.length - 1; i >= 0; i--) {
	    		if(vm.selectedMedications[i].id == medication.id){
    			    if(vm.selectedMedications[i].selected){
                vm.selectedMedications.selected = false;
              }else{
                vm.selectedMedications.selected = true;
              }
	    			return;
	    		}
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