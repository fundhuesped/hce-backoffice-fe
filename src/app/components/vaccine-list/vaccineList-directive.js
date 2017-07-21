(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceVaccineList', hceVaccineList);

  /** @ngInject */
  function hceVaccineList() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/vaccines/vaccines.html',
      controller: 'PatientVaccinesController',
      controllerAs: 'PatientVaccinesController',
      scope: true,
    };

    return directive;
  }

})();
