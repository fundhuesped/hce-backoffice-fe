(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientProblemController', newPatientProblemController);

	  newPatientProblemController.$inject = ['$state', 'HCService', 'PatientProblem', 'toastr', 'moment', 'Problem', '$uibModalInstance'];

    function newPatientProblemController ($state, HCService, PatientProblem, toastr, moment, Problem, $uibModalInstance) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientProblem = {};
      vm.saveNewPatientProblem = saveNewPatientProblem;
      vm.radio = {};
      vm.getProblems = getProblems;
      vm.cancelNewPatientProblem = cancelNewPatientProblem;
      vm.newProblemDateOption = null;
      vm.newProblemDate = null;
      vm.canSaveNewProblem = canSaveNewProblem;

      Object.defineProperty(
          vm,
          'newPatientProblem', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.newPatientProblem;
          },
          set: function (value) {
            if(!HCService.newPatientProblem){
              HCService.openNewPatientProblem();
            }
          }
      });

      activate();

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

      function saveNewPatientProblem() {

        // if(vm.newProblemDateOption == 'today'){
        //   vm.newPatientProblem.startDate = moment().format('YYYY-MM-DD');
        // }else{
        //   if(vm.newProblemDateOption == 'otherDate'){
        //     vm.newPatientProblem.startDate = moment(vm.newProblemDate).format('YYYY-MM-DD');
        //   }
        // }
        HCService.saveNewPatientProblem().then(function() {
          toastr.success('Problema guardado con exito');
          $uibModalInstance.close('familyProblemCreated');

        }, showError);
      }

      function canSaveNewProblem() {
        if(vm.newPatientProblem && vm.newPatientProblem.startDate&&vm.newPatientProblem.state&&vm.newPatientProblem.state=='Active'&&vm.newPatientProblem.problem){
          return true;
        }
        if(vm.newPatientProblem && vm.newPatientProblem.startDate&&vm.newPatientProblem.closeDate&&vm.newPatientProblem.state&&vm.newPatientProblem.state=='Closed'&&vm.newPatientProblem.problem){
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

      function cancelNewPatientProblem() {
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