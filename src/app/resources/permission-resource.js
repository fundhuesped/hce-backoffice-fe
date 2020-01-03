(function () {
    'use strict';
    function PermissionProvider() {
        function PermissionResource($resource, apiBase) {
          
            var Permission = $resource(apiBase + 'core/user/permissions/', null, {
                currentUserCan: {
                  method: 'POST',
                  isArray: false
                }
            });

            return Permission;
        }

        this.$get = ['$resource', 'apiBase', PermissionResource];
    }

    angular.module('hce.resources').provider('Permission', PermissionProvider);
})();