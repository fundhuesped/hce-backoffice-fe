(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceProblemList', hceProblemList);

  /** @ngInject */
  function hceProblemList() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/problems/problems.html',
      controller: 'PatientProblemsController',
      controllerAs: 'PatientProblemsController',
      scope: true,
    };

    return directive;
  }

})();
