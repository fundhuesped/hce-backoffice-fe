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
            return vm.controllerForm.$valid && (vm.categories.evolutions||vm.categories.problems||vm.categories.arv||vm.categories.hiv||vm.categories.profilaxis||vm.categories.generalTreatment||vm.categories.laboratory||vm.categories.otherStudies||vm.categories.vaccines);
        }

        function openModal() {
            var booleanValue = vm.displayName == "pns";

            var modalInstance = $uibModal.open({
                backdrop: true,
                templateUrl: 'app/views/patientHCE/hceSummary/summaryDetails.html',
                size: 'lg',
                controller: 'SummaryDetailsController',
                controllerAs: 'SummaryDetailsController',
                resolve: {
                    patientId: function () {
                        return HCService.currentPacienteId;
                    },
                    showPNS: function () {
                        return booleanValue;
                    },
                    showHIV: function () {
                        return vm.categories.hiv;
                    },
                    showEvolutions: function () {
                        return vm.categories.evolutions;
                    },
                    showProblems: function () {
                        return vm.categories.problems;
                    },
                    showARV: function () {
                        return  vm.categories.arv;
                    },
                    showProfilaxis: function () {
                        return  vm.categories.profilaxis;
                    },
                    showGeneral: function () {
                        return vm.categories.generalTreatment;
                    },
                    showLab: function () {
                        return vm.categories.laboratory;
                    },
                    showOthers: function () {
                        return vm.categories.otherStudies;
                    },
                    showVaccines: function () {
                        return vm.categories.vaccines;
                    },
                    observations: function () {
                        return vm.observations;
                    },
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
        }
    }
})();