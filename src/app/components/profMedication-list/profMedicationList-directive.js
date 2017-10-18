(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceProfMedicationList', hceProfMedicationList);

  /** @ngInject */
  function hceProfMedicationList() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/medications/profilaxis/patientProfilaxisMedication-list.html',
      controller: 'PatientProfilaxisMedicationListController',
      controllerAs: 'PMLController',
      scope: true,
    };

    return directive;
  }

})();
