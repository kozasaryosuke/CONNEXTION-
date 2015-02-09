exports.definition = {
  config: {
    columns: {
      active: "boolean"
    },
    adapter: {
      type: "acs",
      collection_name: "socialIntegrations"
    },
    settings: {
      object_name: "socialIntegrations",
      object_method: "socialIntegrations"
    }
  },
  extendModel: function(Model) {
    _.extend(Model.prototype, {
      fbLogin: function(token,id,email,birthday,gender,nickname,callback){
        this.config.Cloud.SocialIntegrations.externalAccountLogin({
          type: 'facebook',
          token: token,
          email: email,
          custom_fields: {
            birthday: birthday,
            gender: gender,
            nickname: nickname
          }
        }, function (e) {
          if (e.success) {
            var user = e.users[0];
            Ti.API.info(user);
            callback(e);
          } else {
            Ti.API.info('Error:\n' +
                  ((e.error && e.message) || JSON.stringify(e)));
          }
        });        
      }
    });
    return Model;
  },
  extendCollection: function(Collection) {
    _.extend(Collection.prototype, {});
    return Collection;
  }
};