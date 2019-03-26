(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('HCESummaryController', hceSummaryController);

	hceSummaryController.$inject = [];

    function hceSummaryController () {
	    var vm = this;
        vm.canGenerateSummary = canGenerateSummary;
        vm.categories = {};

        function canGenerateSummary() {
            return vm.controllerForm.$valid && (vm.categories.evolutions||vm.categories.problems||vm.categories.arv||vm.categories.profilaxis||vm.categories.generalTreatment||vm.categories.laboratories||vm.categories.otherStudies||vm.categories.vaccines);
        };

        vm.openHivModal = openHivModal;

        //TODO FIXME change selectedProblem for user id or similar
        function openHivModal(selectedProblem) {
            var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/views/patientHCE/hceSummary/hivDetails.html',
            size: 'md', //TODO FIXME See if we need to set it bigger
            controller: 'HivDetailsController',
            controllerAs: 'HivDetailsController',
            resolve: {
                //TODO FIXME replace with user id or similar
                patientProblem: function () {
                return selectedProblem;
                }
            }
            });
            modalInstance.result.then(function (resolution) {
            if(resolution==='markedError' || resolution==='edited'){
                searchPatientProblems();
                if(!HCService.currentEvolution){
                HCService.getCurrentEvolution();
                }
            }
            });
        };
    }
})();