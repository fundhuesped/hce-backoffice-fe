(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceArvTreatmentList', hceArvTreatmentList);

  /** @ngInject */
  function hceArvTreatmentList() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/medications/patientARVTreatmentList.html',
      controller: 'PatientARVTreatmentListController',
      controllerAs: 'PMLController',
      scope: true,
    };

    return directive;
  }

})();
