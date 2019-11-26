(function () {
  'use strict';
  function PatientMedicationProvider() {
    function PatientMedicationResource($resource, apiBase, $http) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var PatientMedication = $resource(apiBase + 'hce/paciente/:pacienteId/medications', null, {
          update: {
            url: apiBase+'hce/patientMedication/:id/',
            method: 'PUT',
            params:{id:'@id'}
          },
          getPaginatedForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/medications',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: false
          },
          getAllForPaciente:{
            params:{pacienteId:'@pacienteId', all:"True"},
            method: 'GET',
            isArray: true
          },
          save: {
            url: apiBase+'hce/paciente/:pacienteId/medications',
            method: 'POST',
            params:{pacienteId:'@pacienteId'}
          },
          getForPaciente: {
            url: apiBase+'hce/paciente/:pacienteId/medications',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          }
      });


      PatientMedication.stateChoices = {
        STATE_APPLIED: 'Applied',
        STATE_ERROR: 'Error'
      };

      return PatientMedication;
    }


    this.$get = ['$resource', 'apiBase', '$http', PatientMedicationResource];
  }

  angular.module('hce.resources').provider('PatientMedication', PatientMedicationProvider);
})();
