(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceOtherMedicationList', hceOtherMedicationList);

  /** @ngInject */
  function hceOtherMedicationList() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/medications/medications.html',
      controller: 'PatientMedicationListController',
      controllerAs: 'PMLController',
      scope: true,
    };

    return directive;
  }

})();
