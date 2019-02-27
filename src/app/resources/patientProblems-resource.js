(function () {
  'use strict';
  function PatientProblemProvider() {
    function PatientProblemResource($resource, apiBase, $http) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var PatientProblem = $resource(apiBase + 'hce/paciente/:pacienteId/problems', null, {
          update: {
            url: apiBase+'hce/patientProblem/:id/',
            method: 'PUT',
            params:{id:'@id'}
          },
          getPaginatedForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/problems',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: false
          },
          save: {
            url: apiBase+'hce/paciente/:pacienteId/problems',
            method: 'POST',
            params:{pacienteId:'@pacienteId'}
          },
          getAllForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/problems',
            params:{pacienteId:'@pacienteId', all:"True"},
            method: 'GET',
            isArray: true
          },
          getForPaciente: {
            url: apiBase+'hce/paciente/:pacienteId/problems',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          }
      });


      PatientProblem.stateChoices = {
        STATE_ACTIVE: 'Active',
        STATE_CLOSED: 'Closed',
        STATE_ERROR: 'Error'
      };
      return PatientProblem;
    }


    this.$get = ['$resource', 'apiBase', '$http', PatientProblemResource];
  }

  angular.module('hce.resources').provider('PatientProblem', PatientProblemProvider);
})();
