(function () {
  'use strict';
  function FamilyPatientProblemProvider() {
    function FamilyPatientProblemResource($resource, apiBase, $http) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var FamilyPatientProblem = $resource(apiBase + 'hce/paciente/:pacienteId/familyproblems', null, {
          update: {
            url: apiBase+'hce/familyProblem/:id/',
            method: 'PUT',
            params:{id:'@id'}
          },
          getPaginatedForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/familyProblems',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: false
          },
          save: {
            url: apiBase+'hce/paciente/:pacienteId/familyProblems',
            method: 'POST',
            params:{pacienteId:'@pacienteId'}
          },
          delete: {
            url: apiBase+'hce/familyProblem/:id/',
            method: 'DELETE',
            params:{id:'@id'}
          },
          getForPaciente: {
            url: apiBase+'hce/paciente/:pacienteId/familyProblems',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          }
      });


      FamilyPatientProblem.stateChoices = {
        STATE_ACTIVE: 'Active',
        STATE_ERROR: 'Error'
      };

      FamilyPatientProblem.relationshipChoices = {
        RELATIONSHIP_MOTHER: {label:'Madre',name:'Mother'},
        RELATIONSHIP_FATHER: {label:'Padre',name:'Father'},
        RELATIONSHIP_BROTHER: {label:'Hermano/a',name:'Brother'},
        RELATIONSHIP_GRANDMOTHER: {label:'Abuela',name:'Grandmother'},
        RELATIONSHIP_GRANDFATHER: {label:'Abuelo',name:'Grandfather'},
        RELATIONSHIP_OTHER: {label:'Otro',name:'Other'}
      };

      FamilyPatientProblem.translateRelationship = function (name) {
        for (var i = relationshipChoices.length - 1; i >= 0; i--) {
          if( relationshipChoices[i].name == name ){
            return relationshipChoices[i].label;
          }
        }
      };

      return FamilyPatientProblem;
    }


    this.$get = ['$resource', 'apiBase', '$http', FamilyPatientProblemResource];
  }

  angular.module('hce.resources').provider('FamilyPatientProblem', FamilyPatientProblemProvider);
})();
