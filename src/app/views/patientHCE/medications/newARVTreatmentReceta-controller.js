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
            for (var i = prescription.prescriptionsIds.length - 1; i >= 0; i--) {
              var url = $state.href('arvPrescription', {prescriptionId: prescription.prescriptionsIds[i]});
              $window.open(url,'_blank');                          
            }
          }else{
            var url = $state.href('arvPrescription', {prescriptionId: prescription.id});
            $window.open(url,'_blank');
            openRecetaModal(prescription.id);
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
      function openRecetaModal(prescriptionsIds) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
            templateUrl: 'app/views/patientHCE/prescriptions/arvPrescription.html',
            size: 'md',
            controller: 'MedicationRecetaController',
            controllerAs: 'Ctrl',
            resolve: {
              prescriptionsIds: function () {
                return prescriptionsIds;
              }
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