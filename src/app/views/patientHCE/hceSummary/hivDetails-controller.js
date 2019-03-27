(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('HivDetailsController', hivDetailsController);

	hivDetailsController.$inject = ['toastr', 'moment',  '$uibModalInstance', 'PatientProblem', 'SessionService'];

    function hivDetailsController (toastr, moment, $uibModalInstance, PatientProblem, SessionService) {
    	var vm = this;
    	vm.cancel = cancel;
    	vm.problem = null;
    	vm.canSaveNewProblem = canSaveNewProblem;
    	vm.markAsError = markAsError;
      vm.save = save;
      vm.originalProblem = {};  //TODO Delete it
      vm.changeStatus = changeStatus;
      vm.canEdit = canEdit;
      vm.canBeClosed = canBeClosed;
      vm.canBeMarkedAsError = canBeMarkedAsError;

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

      //TODO delete it?
    	function activate() {
    		vm.problem = {};

        vm.closeDateCalendarPopup.options.minDate = vm.problem.startDate;
        vm.problem.startDate = new Date(vm.problem.startDate + 'T03:00:00');
        if (vm.problem.closeDate) {
          vm.problem.closeDate = new Date(vm.problem.closeDate + 'T03:00:00');;
        }
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
        PatientProblem.update(tmpProblem, function (response) {
          toastr.success('Problema editado con éxito');
          $uibModalInstance.close('edited');
        }, function (err) {
          toastr.error('Ocurrio un error');
        });
      }


        function canSaveNewProblem() {
          if(vm.controllerForm.$valid){
            return true;
          }
  		    return false;
        }



      	function markAsError() {
      		var tmpProblem = angular.copy(vm.problem);
      		tmpProblem.state = PatientProblem.stateChoices.STATE_ERROR;
          tmpProblem.startDate = moment(tmpProblem.startDate).format('YYYY-MM-DD');
          if (tmpProblem.closeDate) {
              tmpProblem.closeDate = moment(tmpProblem.closeDate).format('YYYY-MM-DD');

          }

      		PatientProblem.update(tmpProblem, function (response) {
          	toastr.success('Problema marcado como error');
			      $uibModalInstance.close('markedError');
      		}, function (err) {
		          toastr.error('Ocurrio un error');
      		});
      	}

      function canEdit() {
        return vm.problem.profesional.id == SessionService.currentUser.id && moment().diff(moment(vm.problem.createdOn), 'hours') <= 8;
      }

      function canBeClosed() {
        return true;
      }

      //TODO delete it
      function canBeMarkedAsError(argument) {
        return False;
      }

      function changeStatus() {
        if(vm.problem.state == 'Active'){
          vm.problem.endDate = null;
          vm.startDateCalendarPopup.options.maxDate = new Date();
        }
      }


    }
})();