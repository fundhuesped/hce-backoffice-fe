(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditFamilyProblemController', editFamilyProblemController);

	   editFamilyProblemController.$inject = ['familyProblem', 'toastr', 'FamilyPatientProblem', '$uibModalInstance', 'SessionService','HCService', '$q'];

    function editFamilyProblemController (familyProblem, toastr, FamilyPatientProblem, $uibModalInstance, SessionService, HCService, $q) {
	    var vm = this;
      vm.familyProblem = {};
      vm.originalFamilyProblem = familyProblem;
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

        SessionService.checkPermission('hc_hce.add_patientfamilyhistoryproblem')
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

        var problemToUnmarkAsError = new FamilyPatientProblem();
        Object.assign(problemToUnmarkAsError, tmpProblem);

        HCService.agregarAlHistorial(function(){
          return $q(function(resolve, reject){
            console.log("Entra a la función de deshacer marcado de error de un familyProblem");
            problemToUnmarkAsError.$delete(function(){
              console.log('Supuestamente pudo borrar el familyProblem marcado como error');
              problemToUnmarkAsError.$save({pacienteId:HCService.currentPacienteId}, function(){
                console.log('Supuestamente pudo volver a crear el familyProblem antes de ser marcado como error');
              },  console.error);
              resolve();
            },  function(err){
              console.error(err);
              reject();
            });
          })
        });

        tmpProblem.state = FamilyPatientProblem.stateChoices.STATE_ERROR;
        tmpProblem.observations = vm.familyProblem.observations;
        FamilyPatientProblem.update(tmpProblem, function (response) {
          HCService.markAsDirty();
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
        var problemToUnedit = new FamilyPatientProblem();
        Object.assign(problemToUnedit, vm.originalFamilyProblem );

        HCService.agregarAlHistorial(function(){
          return $q(function(resolve, reject){
            console.log("Entra a la función de deshacer edicion de un familyProblem");
            problemToUnedit.$delete(function(){
              console.log('Supuestamente pudo borrar el familyProblem editado');
              problemToUnedit.$save({pacienteId:HCService.currentPacienteId}, function(){
                console.log('Supuestamente pudo volver a crear el familyProblem antes de ser editado');
              },  console.error);
              resolve();
            },  function(err){
              console.error(err);
              reject();
            });
          })
        });

        FamilyPatientProblem.update(vm.familyProblem, function (response) {
          HCService.markAsDirty();
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