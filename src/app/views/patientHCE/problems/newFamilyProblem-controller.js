(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewFamilyProblemController', newFamilyProblemController);

	  newFamilyProblemController.$inject = ['$state', 'HCService', 'FamilyPatientProblem', 'toastr', 'moment', 'Problem', '$uibModalInstance'];

    function newFamilyProblemController ($state, HCService, FamilyPatientProblem, toastr, moment, Problem, $uibModalInstance) {
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
      activate();

      function saveNewFamilyProblem() {
        vm.newFamilyProblem.paciente = HCService.currentPaciente.id;
        vm.newFamilyProblem.$save({pacienteId:HCService.currentPaciente.id},function() {
          toastr.success('Problema guardado con exito');
          $uibModalInstance.close('familyProblemCreated');
        }, showError);
      }

      function canSaveNewProblem() {
        if(vm.newFamilyProblem &&vm.newFamilyProblem.problem && vm.newFamilyProblem.relationship){
          return true;
        }
        return false;
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
        var filters = {
          name : $viewValue
        };

        return Problem.getFullActiveList(filters, function(problems){
          vm.problems = problems;
        }, displayComunicationError).$promise;

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