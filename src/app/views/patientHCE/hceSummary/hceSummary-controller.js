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
        vm.openHivModal = openHivModal;

        function canGenerateSummary() {
            return vm.controllerForm.$valid && (vm.categories.evolutions||vm.categories.problems||vm.categories.arv||vm.categories.hiv||vm.categories.profilaxis||vm.categories.generalTreatment||vm.categories.laboratories||vm.categories.otherStudies||vm.categories.vaccines);
        }


        function openModal() {
            //TODO FIXME Add here methods for other options
            // if (vm.categories.hiv) {
            //     openHivModal(); return;
            // }
            //TODO FIXME add more params
            var url = $state.href('summaryDetails', {patientId: HCService.currentPacienteId});
            $window.open(url,'_blank');
        }

        //TODO FIXME Delete it
        function openHivModal() {
            var modalInstance = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/views/patientHCE/hceSummary/summaryDetails.html',
            size: 'md',
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