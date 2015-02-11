exports.move = function() {
	// ログイン処理
	var fb = require('facebook');
	fb.appid = Ti.App.Properties.getString('ti.facebook.appid');
	fb.permissions = ['public_profile','email','user_birthday'];
	fb.forceDialogAuth = false;

	fb.addEventListener('login', function(e) {
	    if (e.success) {
	    	Ti.App.Properties.setString('accessToken',fb.accessToken);
	        fb.requestWithGraphPath('me',{},"GET",function(e) {
	        	if (e.success) {
					var obj = JSON.parse(e.result),
					moment = require('alloy/moment'),
					token, user, id, email, birthday, gender, first_name, last_name, nickname;
					Ti.API.info(obj);
					id = obj.id;
					email = obj.email;
					Ti.API.info(obj.birthday);
					birthday = moment(obj.birthday, "MM/DD/YYYY");
					gender = obj.gender;
					first_name = obj.first_name;
					last_name = obj.last_name;
					nickname = first_name.substr(0,1) + last_name.substr(0,1);
					token = fb.accessToken;
					user = Alloy.createModel('social');
					user.fbLogin(token,id,email,birthday,gender,nickname,function(result) {
						if (result.success) {
							// プロフィール編集画面を生成するコントローラーを呼び出す
							Alloy.createController('question').move();
						} else {
							alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
						}
					});
				} else {
					alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				}
	        });
	    } else if (e.error) {
	        alert(e.error);
	    } else if (e.cancelled) {
	        alert("Canceled");
	    }
	});
	
	fb.addEventListener('logout', function(e) {
	    alert('Logged out');
	});
	
	/*以下、画面デザイン*/
	// Windowを作成
	var win = $.UI.create('Window',{classes:"win"});

	// ScrollableViewを作成
	var view1 = Ti.UI.createView();
	var view2 = Ti.UI.createView();
	var view3 = Ti.UI.createView();
	var view4 = Ti.UI.createView();
	var view5 = Ti.UI.createView();
	var scrollableView = Ti.UI.createScrollableView({
		showPagingControl:true,
		views:[view1,view2,view3,view4,view5],
		height:475,
		top:0,
		backgroundImage:"/images/login_bg.jpg",
		pagingControlColor:"transparent",
		pagingControlHeight:35,
		viewShadowColor:"#0070A8",
		viewShadowOffset:{x:0,y:5}
	});
	win.add(scrollableView);

	// view1
	var view1LabelGroup = $.UI.create('View',{classes:"view1LabelGroup"});
	var view1Logo = $.UI.create('ImageView',{classes:"view1Logo"});
	var view1Label1 = $.UI.create('Label',{classes:"view1Label1"});
	var view1Label2 = $.UI.create('Label',{classes:"view1Label2"});
	var view1Label3 = $.UI.create('Label',{classes:"view1Label3"});
	view1LabelGroup.add(view1Logo);
	view1LabelGroup.add(view1Label1);
	view1LabelGroup.add(view1Label2);
	view1LabelGroup.add(view1Label3);
	view1.add(view1LabelGroup);
	
	// view2
	
	// view3
	
	// view4
	
	// view5
	
	// 共通部分（フッター）	
	var fbLoginLabel = $.UI.create('ImageView',{classes:"fbLoginLabel"});
	fbLoginLabel.addEventListener('click', function(e) {
		fb.authorize();
		// fb.logout();
	});
	var note = $.UI.create('Label',{classes:"note"});
	win.add(fbLoginLabel);
	win.add(note);

	// open
	win.open();
};
