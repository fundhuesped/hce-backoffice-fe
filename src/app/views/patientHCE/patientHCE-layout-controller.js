(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientHCELayoutController', patientHCELayoutController);

	patientHCELayoutController.$inject = ['$state', '$stateParams','SessionService', 'HCService'];

    function patientHCELayoutController ($state, $stateParams, SessionService, HCService) {
	    var vm = this;
        vm.currentUserCan = SessionService.currentUserCan;
        activate();

	    function activate(){
            // HCService.setPaciente($stateParams.patientId);
	    }

    }
})();