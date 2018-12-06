(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('AlreadyOpenController', alreadyOpenController);

	  alreadyOpenController.$inject = ['$uibModalInstance', '$window'];

    function alreadyOpenController ($uibModalInstance, $window) {
	    var vm = this;
      vm.close = close;

      function close() {
        window.close();
      }

    }
})();