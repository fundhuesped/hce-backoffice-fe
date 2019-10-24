(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditFamilyProblemController', editFamilyProblemController);

	   editFamilyProblemController.$inject = ['familyProblem', 'toastr', 'FamilyPatientProblem', '$uibModalInstance', 'SessionService'];

    function editFamilyProblemController (familyProblem, toastr, FamilyPatientProblem, $uibModalInstance, SessionService) {
	    var vm = this;
      vm.familyProblem = {};
      vm.save = save;
	    vm.cancel = cancel;
      vm.relationshipChoices = FamilyPatientProblem.relationshipChoices;
      vm.markAsError = markAsError;
      vm.canEdit = canEdit;
      vm.canSave = canSave;
      vm.hasPermissions = false;

      activate();

      function activate(){
        vm.familyProblem = angular.copy(familyProblem);

        SessionService.checkPermission('hc_hce.edit_familyproblem')
            .then( function(hasPerm){
                vm.hasPermissions = hasPerm;
            }, function(error){
                vm.hasPermissions = false;
                console.error("=== Error al verificar permisos en controlador ===");
                console.error(error);
                console.trace();
            });
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