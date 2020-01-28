(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientProblemController', patientProblemController);

	patientProblemController.$inject = ['$state', 'HCService', 'toastr', 'moment', 'Problem', '$uibModal', '$uibModalInstance', 'PatientProblem', 'SessionService','patientProblem', '$q'];

    function patientProblemController ($state, HCService, toastr, moment, Problem, $uibModal, $uibModalInstance, PatientProblem, SessionService, patientProblem, $q) {
    	var vm = this;
    	vm.cancel = cancel;
    	vm.problem = null;
    	vm.canSaveNewProblem = canSaveNewProblem;
    	vm.markAsError = markAsError;
      vm.save = save;
      vm.originalProblem = patientProblem;
      vm.changeStatus = changeStatus;
      vm.canEdit = canEdit;
      vm.canBeClosed = canBeClosed;
      vm.canBeMarkedAsError = canBeMarkedAsError;
      vm.hasPermissions = false;

      vm.startDateCalendarPopup = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        updateMaxVal: function (value) {
          this.options.maxDate = (vm.problem.closeDate?vm.problem.closeDate:new Date());
        },
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

        vm.closeDateCalendarPopup = {
        opened: false,
        updateMinVal: function () {
          this.options.minDate = (vm.problem.startDate?vm.problem.startDate:new Date());
        },
        altInputFormats: ['d!-M!-yyyy'],
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

    	activate();

    	function activate() {
    		vm.problem = angular.copy(patientProblem);

        vm.closeDateCalendarPopup.options.minDate = vm.problem.startDate;
        vm.problem.startDate = new Date(vm.problem.startDate + 'T03:00:00');
        if (vm.problem.closeDate) {
          vm.problem.closeDate = new Date(vm.problem.closeDate + 'T03:00:00');;
        }

        SessionService.checkPermission('hc_hce.add_patientproblem')
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


      function save() {
        var tmpProblem = angular.copy(vm.problem);
        tmpProblem.startDate = moment(tmpProblem.startDate).format('YYYY-MM-DD');
        if (tmpProblem.closeDate) {
            tmpProblem.closeDate = moment(tmpProblem.closeDate).format('YYYY-MM-DD');
        }

        var problemToUnedit = new PatientProblem();
        Object.assign(problemToUnedit, vm.originalProblem );

        HCService.agregarAlHistorial(function(){
          return $q(function(resolve, reject){
            console.log("Entra a la función de deshacer edicion de un problema");
            problemToUnedit.$delete(function(){
              console.log('Supuestamente pudo borrar el problema editado');
              problemToUnedit.$save({pacienteId:HCService.currentPacienteId}, function(){
                console.log('Supuestamente pudo volver a crear el problema antes de ser editado');
              },  console.error);
              resolve();
            },  function(err){
              console.error(err);
              reject();
            });
          })
        });

        PatientProblem.update(tmpProblem, function (response) {
          HCService.markAsDirty();
          toastr.success('Problema editado con éxito');
          $uibModalInstance.close('edited');
          HCService.getCurrentEvolution();
        }, function (err) {
          toastr.error('Ocurrio un error');
        });
      }
      
      	function markAsError() {
      		var tmpProblem = angular.copy(vm.problem);
          tmpProblem.startDate = moment(tmpProblem.startDate).format('YYYY-MM-DD');
          if (tmpProblem.closeDate) {
              tmpProblem.closeDate = moment(tmpProblem.closeDate).format('YYYY-MM-DD');

          }
        
          var problemToUnmarkAsError = new PatientProblem();
          Object.assign(problemToUnmarkAsError, tmpProblem);

          HCService.agregarAlHistorial(function(){
            return $q(function(resolve, reject){
              console.log("Entra a la función de deshacer marcado de error de un problema");
              problemToUnmarkAsError.$delete(function(){
                console.log('Supuestamente pudo borrar problema marcado como error');
                problemToUnmarkAsError.$save({pacienteId:HCService.currentPacienteId}, function(){
                  console.log('Supuestamente pudo volver a crear el problema que se habia marcado como error');
                },  console.error);
                resolve();
              },  function(err){
                console.error(err);
                reject();
              });
            })
          });
          
      		tmpProblem.state = PatientProblem.stateChoices.STATE_ERROR;

      		PatientProblem.update(tmpProblem, function (response) {
            HCService.markAsDirty();
          	toastr.success('Problema marcado como error');
            $uibModalInstance.close('markedError');
            HCService.getCurrentEvolution();
      		}, function (err) {
              console.error(err);            
		          toastr.error('Ocurrio un error');
      		});
      	}

      function canEdit() {
        return vm.problem.profesional.id == SessionService.currentUser.id && moment().diff(moment(vm.problem.createdOn), 'hours') <= 8;
      }

      function canBeClosed() {
        if(patientProblem.state == 'Closed'){
          return false;
        }
        return true;
      }

      function canSaveNewProblem() {
        if(vm.controllerForm.$valid){
          return true;
        }
        return false;
      }

      function canBeMarkedAsError(argument) {
        return patientProblem.state !== 'Error';
      }

      function changeStatus() {
        if(vm.problem.state == 'Active'){
          vm.problem.endDate = null;
          vm.startDateCalendarPopup.options.maxDate = new Date();
        }
      }


    }
})();