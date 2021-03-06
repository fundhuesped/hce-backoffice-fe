(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewVaccinePrescriptionController', newVaccinePrescriptionController);

	  newVaccinePrescriptionController.$inject = ['$state', 'HCService', 'PatientVaccine', 'toastr', 'moment', 'Vaccine', 'Receta', '$uibModalInstance', '$window', '$uibModal'];

    function newVaccinePrescriptionController ($state, HCService, PatientVaccine, toastr, moment, Vaccine, Receta, $uibModalInstance, $window, $uibModal) {
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
      vm.controllerForm = {};
      vm.selectedVaccines = [];
      vm.toggleVaccineSelection = toggleVaccineSelection;
      vm.startDateCalendar = {
        altInputFormats: ['d!-M!-yyyy'],
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
          openModal([prescription.id]);
          $uibModalInstance.close('created');
        }, showError);
      }

      function openModal(prescriptions) {
        vm.cancel();
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'app/views/patientHCE/prescriptions/vaccinePrescription.html',
            size: 'lg',
            controller: 'VaccinePrescriptionController',
            controllerAs: 'VaccinePrescriptionController',
            resolve: {
                prescriptions: function () {
                    return prescriptions;
                },
            }
        });
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
          if(error.data){
            if(error.data.detail){
              toastr.error(error.data.detail);
              console.error(error.data.detail);
              console.trace()
            }else{
              toastr.error(JSON.stringify(error.data));
              console.error(error.data);
              console.trace()
            }
          }else{
            toastr.error(error);
            console.error(error);
            console.trace()
          }
        }else{
          toastr.error('Ocurrio un error');
          console.trace()
        }
      }
    }
})();