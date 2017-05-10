(function () {
  'use strict';
  function EvolutionProvider() {
    function EvolutionResource($resource, apiBase, $http) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var Evolution = $resource(apiBase + 'hce/paciente/:pacienteId/visits', null, {
          update: {
            url: apiBase+'hce/visit/:id/',
            method: 'PUT',
            params:{id:'@id'}
          },
          getPaginatedForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/visits',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: false
          },
          getCurrentVisit: {
            url: apiBase+'hce/paciente/:pacienteId/currentVisit',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: false
          },
          save: {
            url: apiBase+'hce/paciente/:pacienteId/visits',
            method: 'POST',
            params:{pacienteId:'@pacienteId'}
          },
          getForPaciente: {
            url: apiBase+'hce/paciente/:pacienteId/visits',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          }
      });


      Evolution.stateChoices = {
        STATE_OPEN: 'Open',
        STATE_CLOSED: 'Closed'
      };

      return Evolution;
    }


    this.$get = ['$resource', 'apiBase', '$http', EvolutionResource];
  }

  angular.module('hce.resources').provider('Evolution', EvolutionProvider);
})();
