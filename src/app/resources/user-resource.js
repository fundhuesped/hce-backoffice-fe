(function () {
  'use strict';
  function UserProvider() {
    function UserResource($resource, apiBase) {
        var User = $resource(apiBase + 'core/user/', null, {
        changePassword: {
          method: 'POST',
          url: apiBase + 'core/user/change-password/'
        }
      });
      return User;
    }

    this.$get = ['$resource', 'apiBase', UserResource];
  }

  angular.module('hce.resources').provider('User', UserProvider);
})();
