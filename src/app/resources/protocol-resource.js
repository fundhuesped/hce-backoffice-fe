(function() {
    'use strict';
    function ProtocolProvider() {
      function ProtocolResource($resource,apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }

        var Protocol = $resource(apiBase + 'comun/protocol/:id/',{id:'@id'},{
          update: {
            method:'PUT'
          },
          getFullActiveList: {
            method: 'GET',
            params: {status: 'Active', all: true},
            isArray: true
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
          }
        });

        return Protocol;
        }
        
      this.$get = ['$resource','apiBase',ProtocolResource];
    }
  angular.module('hce.resources').provider('Protocol',ProtocolProvider);
})();