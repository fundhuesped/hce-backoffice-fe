(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.app')
    	.controller('AppLayoutController', appLayoutController);

	appLayoutController.$inject = ['SessionService'];

    function appLayoutController (SessionService) {
	    var vm = this;
        vm.currentUserCan = SessionService.currentUserCan;
	    vm.changeCollapsed = changedCollapsed;
        vm.drawerCollapsed = false;
        activate();

        function changedCollapsed() {
            vm.drawerCollapsed = !vm.drawerCollapsed;
        }

	    function activate(){
	    }
    }
})();