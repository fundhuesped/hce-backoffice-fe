(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceNavbar', hceNavbar);

  /** @ngInject */
  function hceNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'NavbarController',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment, SessionService) {
      var vm = this;
      vm.currentUser = SessionService.currentUser;
      vm.logout = SessionService.logout;
      vm.currentUserCan = SessionService.currentUserCan;
    }
  }

})();
