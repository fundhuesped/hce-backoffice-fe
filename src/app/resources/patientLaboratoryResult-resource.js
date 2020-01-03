(function () {
  'use strict';
  function PatientLaboratoryResultProvider() {
    function PatientLaboratoryResultResource($resource, apiBase, $http) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var PatientLaboratoryResult = $resource(apiBase + 'laboratory/paciente/:pacienteId/labResults', null, {
          update: {
            url: apiBase+'laboratory/labResult/:id/',
            method: 'PUT',
            params:{id:'@id'}
          },
          getPaginatedForPaciente:{
            method: 'GET',
            isArray: false
          },
          save: {
            method: 'POST',
          },
          delete: {
            url: apiBase+'laboratory/labResult/:id/',
            method: 'DELETE',
            params:{id:'@id'}
          },
          getAllForPaciente:{
            params:{pacienteId:'@pacienteId', all:"True"},
            method: 'GET',
            isArray: true
          },
          getForPaciente: {
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          }
      });


      PatientLaboratoryResult.stateChoices = {
        STATE_ACTIVE: 'Active',
        STATE_ERROR: 'Error'
      };
      return PatientLaboratoryResult;
    }


    this.$get = ['$resource', 'apiBase', '$http', PatientLaboratoryResultResource];
  }

  angular.module('hce.resources').provider('PatientLaboratoryResult', PatientLaboratoryResultProvider);
})();
