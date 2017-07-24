(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceNewEvolution', hceNewEvolution);

  /** @ngInject */
  function hceNewEvolution() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/evolutions/newEvolution.html',
      controller: 'NewEvolutionController',
      controllerAs: 'NewEvolutionController',
      scope: true,
    };

    return directive;
  }

})();
