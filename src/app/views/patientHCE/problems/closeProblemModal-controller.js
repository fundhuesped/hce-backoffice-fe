(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('CloseProblemModalCtrl', closeProblemModalCtrl);

	closeProblemModalCtrl.$inject = ['patientProblem', 'toastr', 'PatientProblem', '$uibModalInstance'];

    function closeProblemModalCtrl (patientProblem, toastr, PatientProblem, $uibModalInstance) {
	    var vm = this;
      vm.patientProblem = angular.copy(patientProblem);
      vm.closeProblem = closeProblem;
	    vm.cancel = cancel;


      vm.closeDateCalendarPopup = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        options: {
          showWeeks: false,
          minDate: patientProblem.startDate
        },
        open : function(){
          this.opened = true;
        }
      };
      function activate(){
            HCService.getCurrentEvolution();
	    }

      function closeProblem() {
        vm.patientProblem.state = 'Closed';
        vm.patientProblem.closeDate = moment(vm.patientProblem.closeDate).format('YYYY-MM-DD');
        PatientProblem.update(vm.patientProblem,function (patientProblem) {
          toastr.success('Problema cerrado con éxito');
          $uibModalInstance.close('problemClosed');

        },showError);
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