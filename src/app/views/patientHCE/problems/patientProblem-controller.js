(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientProblemController', patientProblemController);

	patientProblemController.$inject = ['$state', 'HCService', 'toastr', 'moment', 'Problem', '$uibModal', '$uibModalInstance', 'PatientProblem','patientProblem'];

    function patientProblemController ($state, HCService, toastr, moment, Problem, $uibModal, $uibModalInstance, PatientProblem, patientProblem) {
    	var vm = this;
    	vm.cancel = cancel;
    	vm.problem = null;
    	vm.canSaveNewProblem = canSaveNewProblem;
    	vm.canEdit = canEdit;
    	vm.markAsError = markAsError;
      vm.save = save;

    	activate();

    	function activate() {
    		vm.problem = angular.copy(patientProblem);
            vm.problem.startDate = new Date(vm.problem.startDate + 'T03:00:00');
            if (vm.problem.closeDate) {
                vm.problem.closeDate = new Date(vm.problem.closeDate + 'T03:00:00');;
            }
    	}


    	function cancel() {
    		$uibModalInstance.dismiss('cancel');
    	}


      function save() {
        PatientProblem.update(vm.familyProblem, function (response) {
          toastr.success('Problema editado con éxito');
          $uibModalInstance.close('problemEdited');
        }, function (err) {
          toastr.error('Ocurrio un error');
        });
      }


      function canSaveNewProblem() {
        if(vm.problem && vm.problem.startDate&&vm.problem.state&&vm.problem.state=='Active'&&vm.problem.problem){
          return true;
        }
        if(vm.problem && vm.problem.startDate&&vm.problem.closeDate&&vm.problem.state&&vm.problem.state=='Closed'&&vm.problem.problem){
            return true;
        }
		return false;
      }


      	function markAsError() {
      		var tmpProblem = angular.copy(patientProblem);
      		tmpProblem.state = PatientProblem.stateChoices.STATE_ERROR;
      		PatientProblem.update(tmpProblem, function (response) {
          		toastr.success('Problema marcado como error');
			    $uibModalInstance.close('markedError');
      		}, function (err) {
		          toastr.error('Ocurrio un error');
      		});
      	}

      	function canEdit() {
      		var timeAgo = moment.duration(moment().diff(moment(vm.problem.createdOn)));
      		if(timeAgo.hours()<10){
      		// if(timeAgo.hours()<3){
      			return false;
      		}
      		return true;
      	}

    	vm.startDateCalendarPopup = {
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      	};

      	vm.closeDateCalendarPopup = {
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      	};
    }
})();