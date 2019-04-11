(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('HCESummaryController', hceSummaryController);

	hceSummaryController.$inject = ['HCService', '$uibModal', 'toastr', '$state', '$window'];

    function hceSummaryController (HCService, $uibModal, toastr, $state, $window) {
	    var vm = this;
        vm.canGenerateSummary = canGenerateSummary;
        vm.categories = {};
        vm.openModal = openModal;
        vm.displayName = null;

        function canGenerateSummary() {
            return vm.controllerForm.$valid && (vm.categories.evolutions||vm.categories.problems||vm.categories.arv||vm.categories.hiv||vm.categories.profilaxis||vm.categories.generalTreatment||vm.categories.laboratories||vm.categories.otherStudies||vm.categories.vaccines);
        }


        function openModal() {
            //TODO FIXME add more params
            var booleanValue = vm.displayName == "pns";

            var url = $state.href('summaryDetails', {
                patientId: HCService.currentPacienteId,
                showPNS: booleanValue,
                showHIV: vm.categories.hiv,
                showEvolutions: vm.categories.evolutions,
                showProblems: vm.categories.problems,
                showARV: vm.categories.arv,
                showProfilaxis: vm.categories.profilaxis
            });

            $window.open(url,'_blank');
        }
    }
})();