(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditFamilyProblemController', editFamilyProblemController);

	   editFamilyProblemController.$inject = ['familyProblem', 'toastr', 'FamilyPatientProblem', '$uibModalInstance'];

    function editFamilyProblemController (familyProblem, toastr, FamilyPatientProblem, $uibModalInstance) {
	    var vm = this;
      vm.familyProblem = {};
      vm.save = save;
	    vm.cancel = cancel;
      vm.relationshipChoices = FamilyPatientProblem.relationshipChoices;
      vm.markAsError = markAsError;
      vm.canEdit = canEdit;
      vm.canSave = canSave;
      activate();

      function activate(){
        vm.familyProblem = angular.copy(familyProblem);
	    }


      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      function markAsError() {
        var tmpProblem = angular.copy(vm.familyProblem);
        tmpProblem.state = FamilyPatientProblem.stateChoices.STATE_ERROR;
        tmpProblem.observations = vm.familyProblem.observations;
        FamilyPatientProblem.update(tmpProblem, function (response) {
            toastr.success('Problema marcado como error');
          $uibModalInstance.close('markedError');
        }, function (err) {
          console.error(err);
          toastr.error('Ocurrio un error');
        });
      }

      function canSave() {
        return vm.controllerForm.$valid;
      }

      function save() {
        FamilyPatientProblem.update(vm.familyProblem, function (response) {
          toastr.success('Problema editado con éxito');
          $uibModalInstance.close('familyProblemEdited');
        }, function (err) {
          toastr.error('Ocurrio un error');
        });
      }

      function canEdit() {
        return moment().diff(moment(vm.familyProblem.createdOn), 'hours') <= 8;
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