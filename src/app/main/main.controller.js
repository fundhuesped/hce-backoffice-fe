(function() {
  'use strict';

  angular
    .module('hce.app')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, toastr, SessionService) {
    var vm = this;
    vm.currentUser = SessionService.currentUser;

    activate();

    function activate() {
    }
  }
})();
