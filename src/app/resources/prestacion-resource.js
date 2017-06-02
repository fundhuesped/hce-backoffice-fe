(function() {
    'use strict';
    function PrestacionProvider() {
      function PrestacionResource($resource,apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var Prestacion = $resource(apiBase + 'practicas/prestacion/:id/',{id:'@id'},{
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
            params:{status:'Active',page_size:99},
            isArray: true,
            transformResponse: transformDataSet
          },
          getInactiveList:{
            method: 'GET',
            params:{status:'Inactive',page_size:99},
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

        Object.defineProperty(Prestacion.prototype,
            'durationHours', {
            enumerable: true,
            configurable: false,
            get: function () {
              var tempVal = Math.floor(this.duration/60)|0;
              return tempVal;
            },
            set: function (value) {
                this.duration = this.durationMinutes + value *60;
            }
        });

        Object.defineProperty(Prestacion.prototype,
            'durationMinutes', {
            enumerable: true,
            configurable: false,
            get: function () {
              return Math.floor(this.duration%60)|0;
            },
            set: function (value) {
              this.duration = this.durationHours*60 + value;
            }
        });
        return Prestacion;
        
    	}
      this.$get = ['$resource','apiBase',PrestacionResource];
    }
  angular.module('hce.resources').provider('Prestacion',PrestacionProvider);
})();