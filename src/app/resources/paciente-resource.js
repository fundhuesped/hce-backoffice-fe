(function() {
    'use strict';
    function PacienteProvider() {
      function PacienteResource($resource,apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else if(status===400){
            return data;
          }else{            
            return [];
          }
        }
        var Paciente = $resource(apiBase + 'pacientes/paciente/:id/',{id:'@id'},{
          update: {
            method:'PUT'
          },
          getActiveList:{
            method: 'GET',
            params:{status:'Active'},
            isArray: true,
            transformResponse: transformDataSet
          },
          getInactiveList:{
            method: 'GET',
            params:{status:'Inactive'},
            isArray: true,
            transformResponse: transformDataSet            
          },
          query:{
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          },
          queryPaginated:{
           method: 'GET',
           isArray: false
          },
          getPaginatedActiveList:{
            method: 'GET',
            params:{status:'Active'},
            isArray: false
          }
        });
        
        return Paciente;
    	}
      this.$get = ['$resource','apiBase',PacienteResource];
    }
  angular.module('hce.resources').provider('Paciente',PacienteProvider);
})();