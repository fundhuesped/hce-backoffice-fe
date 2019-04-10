(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('SummaryDetailsController', summaryDetailsController);

  summaryDetailsController.$inject = ['toastr', '$stateParams', 'HIVData'];

    function summaryDetailsController (toastr, $stateParams, HIVData) {
      var vm = this;
      vm.cancel = cancel;
      vm.canBeClosed = canBeClosed;
      vm.details = null;

      init();

      function init() {
        getDetails();
      }

      function cancel() {
        
      }

      function canBeClosed() {
        return true;
      }

      function getDetails() {
        //TODO FIXME this is broken, use params instead
        HIVData.getHIVChart({patientId: $stateParams.patientId}, function (result) {
            vm.details = result;
        }, function (err) {
          console.error(err);
          vm.details = null;
        });
      }
    }
})();