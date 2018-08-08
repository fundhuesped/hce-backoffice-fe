(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewVaccinePrescriptionController', newVaccinePrescriptionController);

	  newVaccinePrescriptionController.$inject = ['$state', 'HCService', 'PatientVaccine', 'toastr', 'moment', 'Vaccine', 'Receta', '$uibModalInstance', '$window'];

    function newVaccinePrescriptionController ($state, HCService, PatientVaccine, toastr, moment, Vaccine, Receta, $uibModalInstance, $window) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newReceta = new Receta();
      vm.save = save;
      vm.getVaccines = getVaccines;
      vm.cancel = cancel;
      vm.newProblemDateOption = null;
      vm.newProblemDate = null;
      vm.canSave = canSave;
      vm.error = null;
      vm.selectedVaccines = [];
      vm.toggleVaccineSelection = toggleVaccineSelection;
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
        tmpNewReceta.prescriptedVaccines = [];
        for (var i = vm.selectedVaccines.length - 1; i >= 0; i--) {
            tmpNewReceta.prescriptedVaccines.push(vm.selectedVaccines[i]);
        }
        tmpNewReceta.prescripctionType = 'Vaccine';
        tmpNewReceta.issuedDate = moment(tmpNewReceta.issuedDate).format('YYYY-MM-DD');
        tmpNewReceta.cantRecetas = 1;

        tmpNewReceta.$save({pacienteId:HCService.currentPaciente.id},function(prescription) {
          toastr.success('Receta generada con éxito');
          var url = $state.href('vaccinePrescription', {prescriptionId: prescription.id});
          $window.open(url,'_blank');
          openRecetaModal(prescription.id);
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newReceta && vm.selectedVaccines.length>0 && vm.newReceta.issuedDate){
          return true;
        }
        return false;
      }

	    function activate(){
        Vaccine.getActiveList(function(vaccines){
          vm.vaccines = vaccines;
        }, displayComunicationError);
	    }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function getVaccines($viewValue) {
        var filters = {
          name : $viewValue
        };

        return Vaccine.getFullActiveList(filters, function(vaccines){
          vm.vaccines = vaccines;
        }, displayComunicationError).$promise;

      }


      function toggleVaccineSelection(vaccine) {
        if(vm.selectedVaccines.length>0){
          for (var i = vm.selectedVaccines.length - 1; i >= 0; i--) {
            if(vm.selectedVaccines[i].id == vaccine.id){
                vm.selectedVaccines.splice(i, 1);
              return;
            }
          }
        }
        vm.selectedVaccines.push(vaccine);          
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