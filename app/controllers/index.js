var Cloud = require('ti.cloud'),
accessToken = Ti.App.Properties.getString('accessToken');

if (typeof accessToken === 'undefined' || accessToken === null) {
    // 初回起動時、Facebookアカウントでのログイン用の画面を表示する
    Alloy.createController('login').move();
} else {
	// ユーザー情報を取得
	Cloud.SocialIntegrations.externalAccountLogin({
	    type: 'facebook',
	    token: accessToken
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        if (typeof user.role === 'undefined' || user.role === null) {
	        	// roleが未設定ならquestionに飛ばす
	        	Alloy.createController('question').move();
	        } else {
	        	Alloy.createController('main').move();
	        }
	    } else {
	        // ログイン失敗した場合はFacebookログイン画面を表示
	        Alloy.createController('login').move();
	    }
	});
}