(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewFamilyProblemController', newFamilyProblemController);

	  newFamilyProblemController.$inject = ['$state', 'HCService', 'FamilyPatientProblem', 'toastr', 'moment', 'Problem', '$uibModalInstance', '$timeout'];

    function newFamilyProblemController ($state, HCService, FamilyPatientProblem, toastr, moment, Problem, $uibModalInstance, $timeout) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newFamilyProblem = new FamilyPatientProblem();
      vm.saveNewFamilyProblem = saveNewFamilyProblem;
      vm.radio = {};
      vm.getProblems = getProblems;
      vm.cancel = cancel;
      vm.newProblemDateOption = null;
      vm.newProblemDate = null;
      vm.canSaveNewProblem = canSaveNewProblem;
      vm.relationshipChoices = FamilyPatientProblem.relationshipChoices;
      vm.waitingToShowError = false;
      vm.loading = false;


      activate();

      function saveNewFamilyProblem() {
        vm.newFamilyProblem.paciente = HCService.currentPaciente.id;
        
        vm.newFamilyProblem.$save({pacienteId:HCService.currentPaciente.id},function(newProblem) {
          toastr.success('Problema guardado con exito');
          $uibModalInstance.close('familyProblemCreated');
          HCService.markAsDirty();
          var problemToDelete = new FamilyPatientProblem();
          problemToDelete.id = newProblem.id;
          HCService.agregarAlHistorial(function(){
              console.log("Entra a la función de borrado de un problema");
              problemToDelete.$delete(function(){
                console.log('Supuestamente pudo borrar el familyProblem creado');
            },  console.error);
          });
        }, showError);
      }

      function canSaveNewProblem() {
        return vm.controllerForm.$valid;
      }

	    function activate(){
        Problem.getActiveList(function(problems){
          vm.problems = problems;
        }, displayComunicationError);
	    }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function getProblems($viewValue) {
        if($viewValue.includes(";")){
          toastr.warning("No se permite el uso de \';\' en el buscador");
          return;
        }
        if(vm.loading==false){
          toastr.info('Cargando..');
          vm.loading = true;
          $timeout(
            function() {
              vm.loading = false;
            }, 1500);
        }

        var filters = {
          name : $viewValue
        };

        return Problem.getFullActiveList(filters, function(problems){
          vm.problems = problems;
          vm.loading = false;
          if (problems.length <= 0 && !vm.waitingToShowError){
            toastr.warning('No se han encontrado resultados');
            vm.waitingToShowError = true;
            $timeout(
              function() {
                vm.waitingToShowError = false;
              }, 1500);
          }
        }, displayComunicationError).$promise;

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