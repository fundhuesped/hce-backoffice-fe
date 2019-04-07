(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.app')
    	.controller('AppLayoutController', appLayoutController);

	appLayoutController.$inject = ['SessionService', 'HCService', '$state'];

    function appLayoutController (SessionService, HCService, $state) {
	    var vm = this;
        vm.currentUserCan = SessionService.currentUserCan;
        vm.changeCollapsed = changedCollapsed;
        vm.drawerCollapsed = true;
        vm.logoBig = '/assets/images/logo-redclin.png';
        vm.logoSmall = '/assets/images/logo_2_redclin_57x37.png';

        Object.defineProperty(
          vm,
          'currentPaciente', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentPaciente;
          }
        });

        vm.goToResumenPaciente = goToResumenPaciente;
        activate();

        function changedCollapsed() {
            vm.drawerCollapsed = !vm.drawerCollapsed;
        }

        function goToResumenPaciente() {
            if(HCService.currentPaciente){
                $state.go('app.patientHCE.resumen');
            }
        }

	    function activate(){
	    }
    }
})();