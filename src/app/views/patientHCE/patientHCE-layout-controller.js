(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientHCELayoutController', patientHCELayoutController);

	patientHCELayoutController.$inject = ['$state', 'SessionService'];

    function patientHCELayoutController ($state, SessionService) {
	    var vm = this;
        vm.currentUserCan = SessionService.currentUserCan;
        vm.showingSummary = showingSummary;
        vm.showingEvolutions = showingEvolutions;
        vm.showingProblems = showingProblems;
        vm.showingTreatments = showingTreatments;
        vm.showingResults = showingResults;
        activate();

	    function activate(){
	    }

        function showingSummary() {
            return $state.is('app.patientHCE.resumen');
        }

        function showingEvolutions() {
            return $state.is('app.patientHCE.evolutions');
        }
        
        function showingProblems() {
            return $state.is('app.patientHCE.problems');
        }
        
        function showingTreatments() {
            return $state.is('app.patientHCE.treatments');
        }
        
        function showingResults() {
            return $state.is('app.patientHCE.results');
        }
    }
})();