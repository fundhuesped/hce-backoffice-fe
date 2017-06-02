(function () {
    'use strict';
    function CivilStatusProvider() {
        function CivilStatusResource($resource, apiBase) {
            function transformDataSet(data, headersGetter, status){
            if(status === 200 && data){
                return angular.fromJson(data).results;  
              }else{
                return [];
              }
            }
            var CivilStatus = $resource(apiBase + 'comun/civilStatusType/:id/', {id: '@id'}, {
                update: {
                    method: 'PUT'
                },
                getFullActiveList: {
                  method: 'GET',
                  params: {status: 'Active', all: true},
                  isArray: true
                },

                getActiveList:{
                    method: 'GET',
                    params:{status:'Active', page_size:99},
                    isArray: true,
                    transformResponse: transformDataSet
                },
                getInactiveList:{
                    method: 'GET',
                    params:{status:'Inactive', page_size:99},
                    isArray: true,
                    transformResponse: transformDataSet
                },
                query:{
                    method: 'GET',
                    isArray: true,
                    transformResponse: transformDataSet
                }
            });

            return CivilStatus;
        }

        this.$get = ['$resource', 'apiBase', CivilStatusResource];
    }

    angular.module('hce.resources').provider('CivilStatus', CivilStatusProvider);
})();