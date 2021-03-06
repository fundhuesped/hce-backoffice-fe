(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceCommonNavbar', hceCommonNavbar);

  /** @ngInject */
  function hceCommonNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/common-navbar/navbar.html',
      scope: true,
      controller: CommonNavbarController,
      controllerAs: 'CommonNavbarController',
      bindToController: {
        hceTitle:"@"
      }
    };

    return directive;

    /** @ngInject */
    function CommonNavbarController(moment, SessionService) {
      var vm = this;
      vm.currentUser = SessionService.currentUser;
      vm.logout = SessionService.logout;
      vm.currentUserCan = SessionService.currentUserCan;
    }
  }

})();
