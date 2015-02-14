/* 画面構成
[tab1]profileList => profileDetail
[tab2]receiveList => profileDetail
[tab3]chatList => chatDetail => profileDetail
[tab4]settingList => settingNickname,settingIntroduction,settingResidence,settingBirthplace
*/

// 先頭箇所に関数や変数をすべて書く
var tabGroup = Titanium.UI.createTabGroup(),
	Cloud = require('ti.cloud'),
	// accessToken = Ti.App.Properties.getString('accessToken'),
	accessToken = "CAAIKTWeLmuoBAABfpQg4pLAZBhG2HmHUBVF4nxMAbdtfoEER6cIMHm3ERLhpyh1Spvo57QjLqW9pHQA5ZBpAfjKr0sknSgtKVpaECx0jY53EeO0ScpmkxnoxmBZApTQEwxBZCrrw634ghVNDs8mxZA3Dt5m1kOQhLq5uXSDN2v1bSYeoKBTia0UvZCn7FqCETVbBdAbzZCKDZAIHXv9q4NMHjqNwd2WyD3tFWMuGoibgDPzZCD0zLnuuZB",
	profileList,receiveList,chatList,settingList,tab1,tab2,tab3,tab4, // createTabGroup
	profileDetail,chatDetail,settingNickname,settingIntroduction,settingResidence,settingBirthplace, // otherPages
	id,nickname,introduction,residence,birthplace, // グローバル変数にしておいた方が良さそうなもの（自分のプロフィール関連）
	message_id,message_external,message_picture,message_nickname,message_introduction,message_residence,message_birthplace,message_status,chat_group_id, // グローバル変数にしておいた方が良さそうなもの（他人アカやチャット関連）
	
	profileCount,profileTable, // profileList
	profileSubtitle,profileImage,profileIntroductionLabel,residenceAnswer,birthplaceAnswer,
	talkDoneDialog = $.UI.create('AlertDialog', {classes:"talkDoneDialog"}),
	talkView = $.UI.create('View', {classes:"talkView"}),
	talkButton = $.UI.create('ImageView', {classes:"talkButton"}), // profileDetail
	receiveCount,receiveTable,receiveTableRows = [], // receiveList
	chatTable,chatTableRows = [], // chatList
	chatSubtitle,chatMessageTable,messageTableRows = [], // chatDetail
	myImage1,myImage2,myProfileLabel,myProfileRole, // settingList
	nicknameField, // settingNickname
	introductionArea; // settingIntroduction

// 誕生日から年齢を計算（birth = YYYY-mm-dd）
function calculateAge(birthday) {
	var easy_birth = birthday.slice(0,10);
	var  birth = easy_birth.split('-');
	var _birth = parseInt("" + birth[0] + birth[1] + birth[2]);
	var  today = new Date();
	var _today = parseInt("" + today.getFullYear() + affixZero(today.getMonth() + 1) + affixZero(today.getDate()));
	return parseInt((_today - _birth) / 10000);
}
function affixZero(int) {
	if (int < 10) int = "0" + int;
	return "" + int;
}

// ユーザー情報の取得
Cloud.SocialIntegrations.externalAccountLogin({
	type: 'facebook',
	token: accessToken
}, function (e) {
	if (e.success) {
		var user = e.users[0],
		fb_id,fb_profile,role,birthday,age;
		
		// external_id
		fb_id = user.external_accounts[0].external_id;
		fb_profile = "https://graph.facebook.com/" + fb_id + "/picture?type=large";
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				myImage1.image = fb_profile;
			},
			onerror : function(e) {
				myImage1.image = "/images/profile_default.jpg";
			},
			timeout : 5000
		});
		client.open("GET",fb_profile);
		client.send(); 
		
		// role
		role = user.role;
		myProfileRole.text = role + "として参加中";
		
		// nickname
        nickname = user.custom_fields.nickname;
		nicknameField.value = nickname;
		
		// introduction
		introduction = user.custom_fields.introduction;
		introductionArea.value = introduction;
		
		// residence
		residence = user.custom_fields.residence;
		
		// birthplace
		birthplace = user.custom_fields.birthplace;
		
		// birthday
		birthday = user.custom_fields.birthday;
		age = calculateAge(birthday);
		myProfileLabel.text = nickname + " " + age + "歳 " + residence;
    } else {
        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
    }
});

/*
// プロフィール写真の取得
Cloud.SocialIntegrations.externalAccountLogin({
    type: 'facebook',
    token: accessToken
}, function (e) {
    if (e.success) {
    	var me = e.users[0];
        var myId = me.id;
    	Cloud.Photos.query({
		    limit:1,
		    order:"-created_at",
		    where:{
		        user_id:myId
		    }
		}, function (e) {
		    var photo = e.photos[0];
		    myImage2.image = photo.urls.small_240;
		});
    } else {
        alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
    }
});
*/

// TabGroupの作成
function createTabGroup() {
	profileList = $.UI.create('Window',{classes:"basicWindow"});
	receiveList = $.UI.create('Window',{classes:"basicWindow"});
	chatList = $.UI.create('Window',{classes:"basicWindow"});
	settingList = $.UI.create('Window',{classes:"basicWindow"});
	profileList.hideNavBar();
	receiveList.hideNavBar();
	chatList.hideNavBar();
	settingList.hideNavBar();
	tab1 = $.UI.create('Tab',{classes:"tab1",window:profileList});
	tab2 = $.UI.create('Tab',{classes:"tab2",window:receiveList});
	tab3 = $.UI.create('Tab',{classes:"tab3",window:chatList});
	tab4 = $.UI.create('Tab',{classes:"tab4",window:settingList});
	tabGroup.addTab(tab1);
	tabGroup.addTab(tab2);
	tabGroup.addTab(tab3);
	tabGroup.addTab(tab4);
	tabGroup.open();
}

// 必要画面一覧
function createOtherWindow() {
	profileDetail = $.UI.create('Window',{classes:"basicWindow"});
	chatDetail = $.UI.create('Window',{classes:"basicWindow"});
	settingNickname = $.UI.create('Window',{classes:"basicWindow"});
	settingIntroduction = $.UI.create('Window',{classes:"basicWindow"});
	settingResidence = $.UI.create('Window',{classes:"basicWindow"});
	settingBirthplace = $.UI.create('Window',{classes:"basicWindow"});
	profileDetail.hideNavBar();
	chatDetail.hideNavBar();
	settingNickname.hideNavBar();
	settingIntroduction.hideNavBar();
	settingResidence.hideNavBar();
	settingBirthplace.hideNavBar();
	profileDetail.hideTabBar();
	chatDetail.hideTabBar();
	settingNickname.hideTabBar();
	settingIntroduction.hideTabBar();
	settingResidence.hideTabBar();
	settingBirthplace.hideTabBar();
}

// profileListの作成
function createProfileList() {
	var header,mainView;
	header = $.UI.create('ImageView', {classes:"basicHeader"});
	mainView = $.UI.create('View', {classes:"mainView"});
	profileCount = $.UI.create('Label', {classes:"basicSubTitle"});
	profileTable = $.UI.create('TableView', {classes:"profileTable"});
	mainView.add(profileCount);
	mainView.add(profileTable);
	profileList.add(header);
	profileList.add(mainView);
}
// profileTableの作成
function createProfileTable() {
	Cloud.SocialIntegrations.externalAccountLogin({
		type: 'facebook',
		token: accessToken
	}, function (e) {
		if (e.success) {
			// userのroleを取得し、それ以外のユーザーを表示する
			var me = e.users[0];
			var role = me.role;
			Cloud.Users.query({
				where: {
					role:{"$ne":role}
				}
			}, function (e) {
			   if (e.success) {
					// 総数を取得
					var count = e.users.length;
					profileCount.text = count + "人の" + e.users[0].role + "がみつかりました";
					// 列の処理
					var rows = [];
					for (var i = 0; i < e.users.length; i++) {
						var user = e.users[i];
						var user_id = user.id;
						var external_id = user.external_accounts[0].external_id;
						var user_nickname = user.custom_fields.nickname;
						var user_introduction = user.custom_fields.introduction;
						var user_residence = user.custom_fields.residence;
						var user_birthplace = user.custom_fields.birthplace;
						var profileRow = $.UI.create('TableViewRow',{classes:"profileRow"});
						var profilePhoto = $.UI.create('ImageView',{
							classes:"profilePhoto",
							image:"https://graph.facebook.com/" + user.external_accounts[0].external_id + "/picture?type=large"
						});
						var profileLabel = $.UI.create('Label',{classes:"profileLabel",text: user.custom_fields.nickname + '（' + calculateAge(user.custom_fields.birthday) + '歳）' + user.custom_fields.residence});
						var profileBalloon = $.UI.create('View',{classes:"profileBalloon"});
						var balloonLabel = $.UI.create('Label',{classes:"balloonLabel",text: user.custom_fields.introduction});
						profileBalloon.add(balloonLabel);
						var profileLink = $.UI.create('View',{classes:"profileLink"});
						profileLink.userId = user_id;
						profileLink.externalId = external_id;
						profileLink.userNickname = user_nickname;
						profileLink.userIntroduction = user_introduction;
						profileLink.userResidence = user_residence;
						profileLink.userBirthplace = user_birthplace;
						profileLink.addEventListener('click',function(e) {
							createProfileInfo(e.source.userId,e.source.externalId,e.source.userNickname,e.source.userIntroduction,e.source.userResidence,e.source.userBirthplace);
							createTalkButton("yet","話したい！を送りました","相手から「話したい！」が返ってくると\nメッセージのやり取りが可能になります");
							tab1.open(profileDetail);
						});
						profileRow.add(profilePhoto);
						profileRow.add(profileLabel);
						profileRow.add(profileBalloon);
						profileRow.add(profileLink);
						rows.push(profileRow);
					}
					profileTable.setData(rows);
				} else {
					alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				}
			});
		} else {
			Ti.API.info("Login failed.");
		}
	});
}
// profileDetailの作成
function createProfileDetail() {
	var header,backButton,mainView,profileHeader,profileIntroductionView,profileSubView,profileTableTitle,table,rows;
		header = $.UI.create('ImageView', {classes:"basicHeader"});
		backButton = $.UI.create('Label', {classes:"backButton"});
		backButton.addEventListener('click', function(e) {
			var activeTab = tabGroup.getActiveTab();
			activeTab.close(profileDetail);
		});
		mainView = $.UI.create('View', {classes:"mainView"});
			profileSubtitle = $.UI.create('Label', {classes:"basicSubTitle"});
			profileHeader = $.UI.create('View', {classes:"profileHeader"});
				profileImage = $.UI.create('ImageView', {classes:"profileImage"});
				profileIntroductionView = $.UI.create('Label', {classes:"profileIntroductionView"});
					profileIntroductionLabel = $.UI.create('Label', {classes:"profileIntroductionLabel"});
				profileIntroductionView.add(profileIntroductionLabel);
			profileHeader.add(profileImage);
			profileHeader.add(profileIntroductionView);
			profileSubView = $.UI.create('View', {classes:"profileSubView"});
				profileTableTitle = $.UI.create('Label',{classes:"profileTableTitle"});
				table = $.UI.create('TableView',{classes:"listTable"});
					rows = [];
						// 出身地
						var birthplaceRow = $.UI.create('TableViewRow',{classes:"settingRow"});
							var birthplaceLabel = $.UI.create('Label',{classes:"settingLabel",text:"出身地"});
							birthplaceAnswer = $.UI.create('Label',{classes:"answerLabel"});
						birthplaceRow.add(birthplaceLabel);
						birthplaceRow.add(birthplaceAnswer);
					rows.push(birthplaceRow);
						// 居住地
						var residenceRow = $.UI.create('TableViewRow',{classes:"settingRow"});
							var residenceLabel = $.UI.create('Label',{classes:"settingLabel",text:"現在の居住地"});
							residenceAnswer = $.UI.create('Label',{classes:"answerLabel"});
						residenceRow.add(residenceLabel);
						residenceRow.add(residenceAnswer);
					rows.push(residenceRow);
				table.setData(rows);
			profileSubView.add(profileTableTitle);
			profileSubView.add(table);
		mainView.add(profileSubtitle);
		mainView.add(profileHeader);
		mainView.add(profileSubView);
	profileDetail.add(header);
	profileDetail.add(backButton);
	profileDetail.add(mainView);
}
// profileInfoの作成
function createProfileInfo(_id,_external,_nickname,_introduction,_residence,_birthplace) {
	profileSubtitle.text = _nickname + "のプロフィール";
	profileIntroductionLabel.text = _introduction;
	var picture = "https://graph.facebook.com/" + _external + "/picture?type=large";
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			profileImage.image = picture;
		},
		onerror : function(e) {
			profileImage.image = "/images/profile_default.jpg";
		},
		timeout : 5000
	});
	client.open("GET",picture);
	client.send();
	residenceAnswer.text = _residence;
	birthplaceAnswer.text = _birthplace;
	id = _id;
}
// TalkButtonの作成
function createTalkButton(_status,_title,_message) {
	message_status = _status;
	talkDoneDialog.title = _title;
	talkDoneDialog.message = _message;
	talkButton.image = "/images/talk_" + _status + "_button.png";
	talkButton.addEventListener('click', function(e) {
		Cloud.SocialIntegrations.externalAccountLogin({
			type: 'facebook',
			token: accessToken
		}, function(e) {
			if (e.success) {
				Cloud.Statuses.create({
					message: message_status,
					custom_fields:{
						receiver: id
					}
				}, function (e) {
					if (e.success) {
						talkButton.image = "/images/talk_" + message_status + "_after_button.png";
						talkButton.touchEnabled = false;
						talkDoneDialog.show();
					} else {
						alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});
			} else {
				Ti.API.info("Login failed.");
			}
		});
	});
	profileDetail.add(talkView);
	profileDetail.add(talkButton);
}
// removeTalkButtonの作成
function removeTalkButton() {
	profileDetail.remove(talkView);
	profileDetail.remove(talkButton);
}

// receiveListの作成
function createReceiveList() {
	var header,mainView;
	header = $.UI.create('ImageView', {classes:"basicHeader"});
	mainView = $.UI.create('View', {classes:"mainView"});
	receiveCount = $.UI.create('Label', {classes:"basicSubTitle"});
	receiveTable = $.UI.create('TableView', {classes:"profileTable"});
	mainView.add(receiveCount);
	mainView.add(receiveTable);
	receiveList.add(header);
	receiveList.add(mainView);
}
// receiveTableの作成
function createReceiveTable() {
	Cloud.SocialIntegrations.externalAccountLogin({
		type: 'facebook',
		token: accessToken
	}, function(e) {
		if (e.success) {
			var myId = e.users[0].id;
			Cloud.Statuses.query({
				where:{
					receiver: myId
				}
			}, function (e) {
				if (e.success) {
					// 総数を取得
					var count = e.statuses.length;
					receiveCount.text = count + "人から「話したい！」されています";
					// tableの作成
					for (var i = 0; i < e.statuses.length; i++) {
						var status = e.statuses[i];
						var user_id = status.user_id;
						createReceiveTableRow(user_id);
					}
				}
			});
		} else {
			Ti.API.info("Login failed.");
		}
	});
}
// receiveTableRowの作成
function createReceiveTableRow(_id) {
	Cloud.Users.query({
		where: {
			id:_id
		}
	}, function (e) {
		if (e.success) {
			// 列の処理
			var user = e.users[0];
			var user_id = user.id;
			var external_id = user.external_accounts[0].external_id;
			var user_nickname = user.custom_fields.nickname;
			var user_introduction = user.custom_fields.introduction;
			var user_residence = user.custom_fields.residence;
			var user_birthplace = user.custom_fields.birthplace;
			var receiveRow = $.UI.create('TableViewRow',{classes:"profileRow"});
			var receivePhoto = $.UI.create('ImageView',{
				classes:"profilePhoto",
				image:"https://graph.facebook.com/" + user.external_accounts[0].external_id + "/picture?type=large"
			});
			var receiveLabel = $.UI.create('Label',{classes:"profileLabel",text: user.custom_fields.nickname + '（' + calculateAge(user.custom_fields.birthday) + '歳）' + user.custom_fields.residence});
			var receiveBalloon = $.UI.create('View',{classes:"profileBalloon"});
			var balloonLabel = $.UI.create('Label',{classes:"balloonLabel",text: user.custom_fields.introduction});
			receiveBalloon.add(balloonLabel);
			var receiveLink = $.UI.create('View',{classes:"profileLink"});
			receiveLink.userId = user_id;
			receiveLink.externalId = external_id;
			receiveLink.userNickname = user_nickname;
			receiveLink.userIntroduction = user_introduction;
			receiveLink.userResidence = user_residence;
			receiveLink.userBirthplace = user_birthplace;
			receiveLink.addEventListener('click',function(e) {
				createProfileInfo(e.source.userId,e.source.externalId,e.source.userNickname,e.source.userIntroduction,e.source.userResidence,e.source.userBirthplace);
				createTalkButton("done","マッチング成立",user_nickname + "さんとメッセージのやり取りが可能になりました");
				tab2.open(profileDetail);
			});
			receiveRow.add(receivePhoto);
			receiveRow.add(receiveLabel);
			receiveRow.add(receiveBalloon);
			receiveRow.add(receiveLink);
			receiveTableRows.push(receiveRow);
			receiveTable.setData(receiveTableRows);
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

// chatListの作成
function createChatList() {
	var header,mainView;
	header = $.UI.create('ImageView', {classes:"basicHeader"});
	mainView = $.UI.create('View', {classes:"mainView"});
	chatTable = $.UI.create('TableView', {classes:"chatTable"});
	mainView.add(chatTable);
	chatList.add(header);
	chatList.add(mainView);
}
// chatTableの作成
function createChatTable() {
	Cloud.SocialIntegrations.externalAccountLogin({
		type: 'facebook',
		token: accessToken
	}, function(e) {
		if (e.success) {
			var myId = e.users[0].id;
			Cloud.Chats.getChatGroups(function (e) {
				if (e.success) {
					// tableの作成
					for (var i = 0; i < e.chat_groups.length; i++) {
						var group = e.chat_groups[i];
						var latest_message = group.message;
						var group_id = group.id;
						for (var x = 0; x < group.participate_ids.length; x++) {
							var participate_id = group.participate_ids[x];
							if (participate_id !== myId) {
								createChatTableRow(participate_id,group_id,latest_message);
							}
						}
					}
				}
			});
		} else {
			Ti.API.info("Login failed.");
		}
	});
}
// chatTableRowの作成
function createChatTableRow(_id,_group,_message) {
	Cloud.Users.query({
		where: {
			id:_id
		}
	}, function (e) {
		if (e.success) {
			// 列の処理
			var user = e.users[0];
			var user_id = user.id;
			var external_id = user.external_accounts[0].external_id;
			var user_nickname = user.custom_fields.nickname;
			var user_introduction = user.custom_fields.introduction;
			var user_residence = user.custom_fields.residence;
			var user_birthplace = user.custom_fields.birthplace;
			var chatRow = $.UI.create('TableViewRow',{classes:"chatRow"});
			var chatPhoto = $.UI.create('ImageView',{
				classes:"chatPhoto",
				image:"https://graph.facebook.com/" + user.external_accounts[0].external_id + "/picture?type=large"
			});
			var chatLabel = $.UI.create('Label',{classes:"chatLabel",text:user.custom_fields.nickname});
			var chatMessage = $.UI.create('Label',{classes:"chatMessage",text:_message});
			var chatLink = $.UI.create('View',{classes:"chatLink"});
			chatLink.userId = user_id;
			chatLink.externalId = external_id;
			chatLink.userNickname = user_nickname;
			chatLink.userIntroduction = user_introduction;
			chatLink.userResidence = user_residence;
			chatLink.userBirthplace = user_birthplace;
			chatLink.addEventListener('click',function(e) {
				createChatInfo(e.source.userId,e.source.externalId,e.source.userNickname,e.source.userIntroduction,e.source.userResidence,e.source.userBirthplace,_group);
				removeTalkButton();
				createChatMessageTable();
				tab3.open(chatDetail);
			});
			chatRow.add(chatPhoto);
			chatRow.add(chatLabel);
			chatRow.add(chatMessage);
			chatRow.add(chatLink);
			chatTableRows.push(chatRow);
			chatTable.setData(chatTableRows);
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}
// chatDetailの作成
function createChatDetail() {
	var header,backButton,mainView,footer,textArea,sendButton;
		header = $.UI.create('ImageView', {classes:"basicHeader"});
		backButton = $.UI.create('Label', {classes:"backButton"});
		backButton.addEventListener('click', function(e) {
			var activeTab = tabGroup.getActiveTab();
			activeTab.close(chatDetail);
		});
		mainView = $.UI.create('View', {classes:"mainView"});
			chatSubtitle = $.UI.create('Label', {classes:"basicSubTitle"});
			chatMessageTable = $.UI.create('TableView', {classes:"chatMessageTable"});
		mainView.add(chatSubtitle);
		mainView.add(chatMessageTable);
		footer = $.UI.create('View',{classes:"messageFooterView"});
			textArea = $.UI.create('TextArea',{classes:"messageTextArea"});
			textArea.addEventListener('change', function(e) {
				message = textArea.value;
			});
			sendButton = $.UI.create('ImageView', {classes:"messageSendButton"});
			sendButton.addEventListener('click', function(e) {
				if (message.length > 0) {
					Cloud.SocialIntegrations.externalAccountLogin({
						type: 'facebook',
						token: accessToken
					}, function (e) {
						if (e.success) {
							var myId = e.users[0].id;
							// ChatsCreate
							Cloud.Chats.create({
								chat_group_id: chat_group_id,
								message: message
							}, function (e) {
								if (e.success) {
									for (var i = 0; i < e.chats.length; i++) {
										var chat = e.chats[i];
										var from_user_id = chat.from_user_id;
										if (from_user_id === myId) {
											var messageBalloon_classes = "myMessageBalloon";
											var balloonLabel_classes = "myMessageBalloonLabel";
											var messageImage_image = "";
										} else {
											var messageBalloon_classes = "messageBalloon";
											var balloonLabel_classes = "messageBalloonLabel";
											var messageImage_image = message_picture;
										}
										var messageRow = $.UI.create('TableViewRow',{classes:"messageRow"});
										var messageImage = $.UI.create('ImageView',{classes:"messageImage",image:messageImage_image});
											var messageLink = $.UI.create('View',{classes:"messageLink"});
											messageLink.addEventListener('click',function(e) {
												createProfileInfo(message_id,message_external,message_nickname,message_introduction,message_residence,message_birthplace);
												tab3.open(profileDetail);
											});
										messageImage.add(messageLink);
										var messageBalloon = $.UI.create('View',{classes:messageBalloon_classes});
											var balloonLabel = $.UI.create('Label',{classes:balloonLabel_classes,text: chat.message});
										messageBalloon.add(balloonLabel);
										messageRow.add(messageBalloon);
										messageRow.add(messageImage);
										messageTableRows.push(messageRow);
									}
									chatMessageTable.setData(messageTableRows);
									message = "";
									textArea.value = "";
								} else {
									alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
								}
							});
						} else {
							alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
						}
					});
				}
			});
		footer.add(textArea);
		footer.add(sendButton);
	chatDetail.add(header);
	chatDetail.add(backButton);
	chatDetail.add(mainView);
	chatDetail.add(footer);
}
// chatMessageTableの作成
function createChatMessageTable() {
	Cloud.SocialIntegrations.externalAccountLogin({
		type: 'facebook',
		token: accessToken
	}, function(e) {
		if (e.success) {
			var myId = e.users[0].id;
			Cloud.Chats.query({
				chat_group_id: chat_group_id,
				order: "created_at"
			}, function (e) {
				if (e.success) {
					for (var i = 0; i < e.chats.length; i++) {
						var chat = e.chats[i];
						var from_user_id = chat.from_user_id;
						if (from_user_id === myId) {
							var messageBalloon_classes = "myMessageBalloon";
							var balloonLabel_classes = "myMessageBalloonLabel";
							var messageImage_image = "";
						} else {
							var messageBalloon_classes = "messageBalloon";
							var balloonLabel_classes = "messageBalloonLabel";
							var messageImage_image = message_picture;
						}
						var messageRow = $.UI.create('TableViewRow',{classes:"messageRow"});
						var messageImage = $.UI.create('ImageView',{classes:"messageImage",image:messageImage_image});
							var messageLink = $.UI.create('View',{classes:"messageLink"});
							messageLink.addEventListener('click',function(e) {
								createProfileInfo(message_id,message_external,message_nickname,message_introduction,message_residence,message_birthplace);
								tab3.open(profileDetail);
							});
						messageImage.add(messageLink);
						var messageBalloon = $.UI.create('View',{classes:messageBalloon_classes});
							var balloonLabel = $.UI.create('Label',{classes:balloonLabel_classes,text: chat.message});
						messageBalloon.add(balloonLabel);
						messageRow.add(messageBalloon);
						messageRow.add(messageImage);
						messageTableRows.push(messageRow);
					}
					chatMessageTable.setData(messageTableRows);
				} else {
					alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				}
			});
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}
// chatInfoの作成
function createChatInfo(_message,_external,_nickname,_introduction,_residence,_birthplace,_id) {
	message_id = _message;
	message_external = _external;
	message_picture = "https://graph.facebook.com/" + _external + "/picture?type=large";
	message_nickname = _nickname;
	chatSubtitle.text = _nickname;
	message_introduction = _introduction;
	message_residence = _residence;
	message_birthplace = _birthplace;
	chat_group_id = _id;
}

// settingListの作成
function createSettingList() {
	var header,mainView,subtitle,myProfileHeader,myImageButton,table,rows;
		header = $.UI.create('ImageView', {classes:"basicHeader"});
	    mainView = $.UI.create('View', {classes:"mainView"});
			subtitle = $.UI.create('Label', {classes:"basicSubTitle",text:"マイプロフィール"});
			myProfileHeader = $.UI.create('View', {classes:"myProfileHeader"});
				myImage1 = $.UI.create('ImageView', {classes:"myImage"});
				myImage2 = $.UI.create('ImageView', {classes:"myImage"});
				myImageButton = $.UI.create('ImageView', {classes:"myImageButton"});
				myImageButton.addEventListener('click', function(e) {
					Cloud.SocialIntegrations.externalAccountLogin({
						type: 'facebook',
						token: accessToken
					}, function (e) {
						if (e.success) {
							Ti.Media.openPhotoGallery({
								success : function(event) {
									Cloud.Photos.create({
										photo: event.media
									}, function (e) {
										if (e.success) {
											var photo = e.photos[0];
											// プロフィール画像を即時反映（未実装）
											
										} else {
											alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
										}
									});
								},
								mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
							});
						} else {
							alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
						}
					});	
				});
				myProfileLabel = $.UI.create('Label', {classes:"myProfileLabel"});
				myProfileRole = $.UI.create('Label', {classes:"myProfileRole"});
			myProfileHeader.add(myImage1);
			myProfileHeader.add(myImage2);
			myProfileHeader.add(myImageButton);
			myProfileHeader.add(myProfileLabel);
			myProfileHeader.add(myProfileRole);
			table = $.UI.create('TableView', {classes:"settingTable"});
				rows = [];
					// ニックネーム
					var nicknameRow = $.UI.create('TableViewRow',{classes:"settingRow"});
						var nicknameLabel = $.UI.create('Label',{classes:"settingLabel",text:"ニックネーム"});
						var nicknameRight = $.UI.create('ImageView',{classes:"rightIcon"});
					nicknameRow.addEventListener('click', function(e) {tab4.open(settingNickname);});
					nicknameRow.add(nicknameLabel);
					nicknameRow.add(nicknameRight);
				rows.push(nicknameRow);
					// 自己紹介文
					var introductionRow = $.UI.create('TableViewRow',{classes:"settingRow"});
						var introductionLabel = $.UI.create('Label',{classes:"settingLabel",text:"自己紹介文"});
						var introductionRight = $.UI.create('ImageView',{classes:"rightIcon"});
					introductionRow.addEventListener('click', function(e) {tab4.open(settingIntroduction);});
					introductionRow.add(introductionLabel);
					introductionRow.add(introductionRight);
				rows.push(introductionRow);
					// 出身地
					var birthplaceRow = $.UI.create('TableViewRow',{classes:"settingRow"});
						var birthplaceLabel = $.UI.create('Label',{classes:"settingLabel",text:"出身地"});
						var birthplaceRight = $.UI.create('ImageView',{classes:"rightIcon"});
					birthplaceRow.addEventListener('click', function(e) {tab4.open(settingBirthplace);});
					birthplaceRow.add(birthplaceLabel);
					birthplaceRow.add(birthplaceRight);
				rows.push(birthplaceRow);
					// 居住地
					var residenceRow = $.UI.create('TableViewRow',{classes:"settingRow"});
						var residenceLabel = $.UI.create('Label',{classes:"settingLabel",text:"現在の居住地"});
						var residenceRight = $.UI.create('ImageView',{classes:"rightIcon"});
					residenceRow.addEventListener('click', function(e) {tab4.open(settingResidence);});
					residenceRow.add(residenceLabel);
					residenceRow.add(residenceRight);
				rows.push(residenceRow);
			table.setData(rows);
		mainView.add(subtitle);
		mainView.add(myProfileHeader);
		mainView.add(table);
	settingList.add(header);
	settingList.add(mainView);
}
// settingNicknameの作成
function createSettingNickname() {
	var header,mainView,subtitle,backButton,nicknameDialog,doneButton,contentView,errorMessage;
		header = $.UI.create('ImageView', {classes:"basicHeader"});
		backButton = $.UI.create('Label', {classes:"backButton"});
		backButton.addEventListener('click', function(e) {
			tab4.close(settingNickname);
		});
		nicknameDialog = $.UI.create('AlertDialog', {classes:"nicknameDialog"});
		doneButton = $.UI.create('Label', {classes:"doneButton"});
		doneButton.addEventListener('click', function(e) {
			if (nickname.length < 2) {
				nicknameDialog.show();
			} else {
				Cloud.SocialIntegrations.externalAccountLogin({
					type: 'facebook',
					token: accessToken
				}, function (e) {
					if (e.success) {
						// Update Users
						Cloud.Users.update({
							custom_fields: {
								nickname: nickname
							}
						}, function (e) {
							if (e.success) {
								myProfileLabel.text = nickname + " " + calculateAge(e.users[0].custom_fields.birthday) + "歳 " + residence;
								tab4.close(settingNickname);
							} else {
								alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
							}
						});
					} else {
						alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});
			}
		});
	    mainView = $.UI.create('View', {classes:"subView"});
		    subtitle = $.UI.create('Label', {classes:"basicSubTitle",text:"ニックネーム"});
		    contentView = $.UI.create('View', {classes:"contentView"});
				errorMessage = $.UI.create('Label',{classes:"catchLabel",top:75});
				nicknameField = $.UI.create('TextField',{classes:"nicknameField"});
				nicknameField.addEventListener('change', function(e) {
					nickname = nicknameField.value;
					if (nickname.length < 2) {
						errorMessage.text = "※ニックネームは2文字以上です";
					} else {
						errorMessage.text = "";
					}
				});
			contentView.add(errorMessage);
			contentView.add(nicknameField);
		mainView.add(subtitle);
		mainView.add(contentView);
	settingNickname.add(header);
	settingNickname.add(backButton);
	settingNickname.add(doneButton);
	settingNickname.add(mainView);
}
// settingIntroductionの作成
function createSettingIntroduction() {
	var header,mainView,subtitle,backButton,doneButton,contentView,introductionDialog1,introductionDialog2,errorMessage;
		header = $.UI.create('ImageView', {classes:"basicHeader"});
		backButton = $.UI.create('Label', {classes:"backButton"});
		backButton.addEventListener('click', function(e) {
			tab4.close(settingIntroduction);
		});
		introductionDialog1 = $.UI.create('AlertDialog', {classes:"introductionDialog1"});
		introductionDialog2 = $.UI.create('AlertDialog', {classes:"introductionDialog2"});
		doneButton = $.UI.create('Label', {classes:"doneButton"});
		doneButton.addEventListener('click', function(e) {
			if (introduction.length === 0) {
				introductionDialog1.show();
			} else if (introduction.length > 140) {
				introductionDialog2.show();
			} else {
				Cloud.SocialIntegrations.externalAccountLogin({
					type: 'facebook',
					token: accessToken
				}, function (e) {
					if (e.success) {
						// Update Users
						Cloud.Users.update({
							custom_fields: {
								introduction: introduction
							}
						}, function (e) {
							if (e.success) {
								tab4.close(settingIntroduction);
							} else {
								alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
							}
						});
					} else {
						alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});
			}
		});
		mainView = $.UI.create('View', {classes:"subView"});
			subtitle = $.UI.create('Label', {classes:"basicSubTitle",text:"自己紹介文"});
			contentView = $.UI.create('View', {classes:"contentView"});
				errorMessage = $.UI.create('Label',{classes:"catchLabel",top:150});
				introductionArea = $.UI.create('TextArea',{classes:"introductionArea"});
				introductionArea.addEventListener('change', function(e) {
					introduction = introductionArea.value;
					if (introduction.length === 0) {
						errorMessage.text = "※自己紹介文を入力してください";
					} else if (introduction.length > 140) {
						errorMessage.text = "※自己紹介文は140字以内で入力してください（現在、" + introduction.length + "字）。";
					} else {
						errorMessage.text = "";
					}
				});
			contentView.add(errorMessage);
			contentView.add(introductionArea);
		mainView.add(subtitle);
		mainView.add(contentView);
	settingIntroduction.add(header);
	settingIntroduction.add(backButton);
	settingIntroduction.add(doneButton);
	settingIntroduction.add(mainView);
}
// settingResidenceの作成
function createSettingResidence() {
	var header,mainView,subtitle,backButton,doneButton,table,rows;
		header = $.UI.create('ImageView', {classes:"basicHeader"});
		backButton = $.UI.create('Label', {classes:"backButton"});
		backButton.addEventListener('click', function(e) {
			tab4.close(settingResidence);
		});
		doneButton = $.UI.create('Label', {classes:"doneButton"});
		doneButton.addEventListener('click', function(e) {
			Cloud.SocialIntegrations.externalAccountLogin({
				type: 'facebook',
				token: accessToken
			}, function (e) {
				if (e.success) {
					// Update Users
					Cloud.Users.update({
						custom_fields: {
							residence: residence
						}
					}, function (e) {
						if (e.success) {
							myProfileLabel.text = nickname + " " + calculateAge(e.users[0].custom_fields.birthday) + "歳 " + residence;
							tab4.close(settingResidence);
						} else {
							alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
						}
					});
				} else {
					alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				}
			});
		});
		mainView = $.UI.create('View', {classes:"subView"});
			subtitle = $.UI.create('Label', {classes:"basicSubTitle",text:"現在の居住地"});
			table = $.UI.create('TableView',{classes:"residenceTable"});
				rows = [];
					// 北海道
					var hokkaidouRow = $.UI.create('TableViewRow',{classes:"basicRow"});
						var hokkaidouLabel = $.UI.create('Label',{classes:"selectLabel",text:"北海道"});
						var hokkaidouIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/hokkaidou_icon.png"});
						var hokkaidouCheck = $.UI.create('ImageView',{classes:"checkIcon"});
						if (residence === "北海道") {
							hokkaidouCheck.image = "/images/check_icon.png";
						}
					hokkaidouRow.add(hokkaidouLabel);
					hokkaidouRow.add(hokkaidouIcon);
					hokkaidouRow.add(hokkaidouCheck);
					hokkaidouRow.addEventListener('click', function(e) {
						residence = "北海道";
						hokkaidouCheck.image = "/images/check_icon.png";
					});
				rows.push(hokkaidouRow);
					// 青森県
					var aomoriRow = $.UI.create('TableViewRow',{classes:"basicRow"});
						var aomoriLabel = $.UI.create('Label',{classes:"selectLabel",text:"青森県"});
						var aomoriIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/aomori_icon.png"});
						var aomoriCheck = $.UI.create('ImageView',{classes:"checkIcon"});
						if (residence === "青森県") {
							aomoriCheck.image = "/images/check_icon.png";
						}
					aomoriRow.add(aomoriLabel);
					aomoriRow.add(aomoriIcon);
					aomoriRow.add(aomoriCheck);
					aomoriRow.addEventListener('click', function(e) {
						residence = "青森県";
						aomoriCheck.image = "/images/check_icon.png";
					});
				rows.push(aomoriRow);
			table.setData(rows);
		mainView.add(subtitle);
		mainView.add(table);
	settingResidence.add(header);
	settingResidence.add(backButton);
	settingResidence.add(doneButton);
	settingResidence.add(mainView);
}
// settingBirthplaceの作成
function createSettingBirthplace() {
	var header,mainView,subtitle,backButton,doneButton,table,rows;
		header = $.UI.create('ImageView', {classes:"basicHeader"});
		backButton = $.UI.create('Label', {classes:"backButton"});
		backButton.addEventListener('click', function(e) {
			tab4.close(settingBirthplace);
		});
		doneButton = $.UI.create('Label', {classes:"doneButton"});
		doneButton.addEventListener('click', function(e) {
			Cloud.SocialIntegrations.externalAccountLogin({
				type: 'facebook',
				token: accessToken
			}, function (e) {
				if (e.success) {
					// Update Users
					Cloud.Users.update({
						custom_fields: {
							birthplace: birthplace
						}
					}, function (e) {
						if (e.success) {
							tab4.close(settingBirthplace);
						} else {
							alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
						}
					});
				} else {
					alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				}
			});
		});
	    mainView = $.UI.create('View', {classes:"subView"});
		    subtitle = $.UI.create('Label', {classes:"basicSubTitle",text:"出身地"});
			table = $.UI.create('TableView',{classes:"birthplaceTable"});
				rows = [];
					// 北海道
					var hokkaidouRow = $.UI.create('TableViewRow',{classes:"basicRow"});
						var hokkaidouLabel = $.UI.create('Label',{classes:"selectLabel",text:"北海道"});
						var hokkaidouIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/hokkaidou_icon.png"});
						var hokkaidouCheck = $.UI.create('ImageView',{classes:"checkIcon"});
						if (birthplace === "北海道") {
							hokkaidouCheck.image = "/images/check_icon.png";
						}
					hokkaidouRow.add(hokkaidouLabel);
					hokkaidouRow.add(hokkaidouIcon);
					hokkaidouRow.add(hokkaidouCheck);
					hokkaidouRow.addEventListener('click', function(e) {
						birthplace = "北海道";
						hokkaidouCheck.image = "/images/check_icon.png";
					});
				rows.push(hokkaidouRow);
					// 青森県
					var aomoriRow = $.UI.create('TableViewRow',{classes:"basicRow"});
						var aomoriLabel = $.UI.create('Label',{classes:"selectLabel",text:"青森県"});
						var aomoriIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/aomori_icon.png"});
						var aomoriCheck = $.UI.create('ImageView',{classes:"checkIcon"});
						if (birthplace === "青森県") {
							aomoriCheck.image = "/images/check_icon.png";
						}
					aomoriRow.add(aomoriLabel);
					aomoriRow.add(aomoriIcon);
					aomoriRow.add(aomoriCheck);
					aomoriRow.addEventListener('click', function(e) {
						birthplace = "青森県";
						aomoriCheck.image = "/images/check_icon.png";
					});
				rows.push(aomoriRow);
			table.setData(rows);
		mainView.add(subtitle);
		mainView.add(table);
	settingBirthplace.add(header);
	settingBirthplace.add(backButton);
	settingBirthplace.add(doneButton);
	settingBirthplace.add(mainView);
}

// functionの呼び出し
exports.move = function() {
	createTabGroup();
	createOtherWindow();
	createProfileList();
	createProfileTable();
	createProfileDetail();
	createReceiveList();
	createReceiveTable();
	createChatList();
	createChatTable();
	createChatDetail();
	createSettingList();
	createSettingNickname();
	createSettingIntroduction();
	createSettingResidence();
	createSettingBirthplace();
};
