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
    function NavbarController($state, moment, SessionService, HCService, toastr) {
      var vm = this;
      vm.currentUser = SessionService.currentUser;
      vm.logout = SessionService.logout;
      vm.currentUserCan = SessionService.currentUserCan;
      vm.closeEvolution = closeEvolution;
      vm.currentPaciente = {};
      vm.years = null;

      Object.defineProperty(
          vm,
          'currentPaciente', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentPaciente;
          }
      });

      Object.defineProperty(
          vm,
          'currentEvolution', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentEvolution;
          }
      });

      Object.defineProperty(
          vm,
          'years', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentPaciente?moment().diff(HCService.currentPaciente.birthDate, 'years'):null;
          }
      });

      activate();

      function activate() {
      }


      function closeEvolution() {
        HCService.closeEvolution().then(function() {
          toastr.success('Visita cerrada con exito');
        }, showError);
      }
    }
  }

})();
