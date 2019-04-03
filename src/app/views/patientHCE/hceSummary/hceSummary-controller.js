(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('HCESummaryController', hceSummaryController);

	hceSummaryController.$inject = ['HCService', '$uibModal', 'toastr'];

    function hceSummaryController (HCService, $uibModal, toastr) {
	    var vm = this;
        vm.canGenerateSummary = canGenerateSummary;
        vm.categories = {};

        function canGenerateSummary() {
            return vm.controllerForm.$valid && (vm.categories.evolutions||vm.categories.problems||vm.categories.arv||vm.categories.hiv||vm.categories.profilaxis||vm.categories.generalTreatment||vm.categories.laboratories||vm.categories.otherStudies||vm.categories.vaccines);
        }

        vm.openModal = openModal;

        function openModal() {
            if (vm.categories.hiv) {
                openHivModal(); return;
            }
            toastr.warning("Por favor seleccione una opcion valida");
        }

        function openHivModal() {
            var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/views/patientHCE/hceSummary/hivDetails.html',
            size: 'md', //TODO FIXME See if we need to set it bigger
            controller: 'HivDetailsController',
            controllerAs: 'HivDetailsController'
            });
            
            modalInstance.result.then(function (resolution) {
            if(resolution==='markedError' || resolution==='edited'){
                searchPatientProblems();
                if(!HCService.currentEvolution){
                HCService.getCurrentEvolution();
                }
            }
            });
        }
    }
})();