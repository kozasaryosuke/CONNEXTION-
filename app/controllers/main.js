// 先頭箇所に関数や変数をすべて書く
var tabGroup = Titanium.UI.createTabGroup(),
    Cloud = require('ti.cloud'),
    accessToken = Ti.App.Properties.getString('accessToken'),
	fb_id,fb_profile,role,nickname,introduction,residence,birthplace,birthday,age,
	profileList,receiveList,chatList,settingList,
	tab1,tab2,tab3,tab4,
	profileDetail,chatDetail,settingNickname,settingIntroduction,settingResidence,settingBirthplace,
	profileHeader,profileView,profileCount,profileTable,
	chatTable,
	settingHeader,settingView,settingSubTitle,myProfileHeader,myImage1,myImage2,myImageButton,myProfileLabel,myProfileRole,settingTable,settingRows,
	nicknameRow,nicknameLabel,nicknameRight,
	introductionRow,introductionLabel,introductionRight,
	birthplaceRow,birthplaceLabel,birthplaceRight,
	residenceRow,residenceLabel,residenceRight,
	backButton,nicknameDialog,doneButton,settingContentView,catchNickname,nicknameField,
	introductionDialog1,introductionDialog2,catchIntroduction,introductionArea,
	residenceTable,residenceRows,
	birthplaceTable,birthplaceRows;

// 誕生日から年齢を計算（birthday=YYYY-mm-ddと仮定）
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
        var user = e.users[0];
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
		//
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
        var id = me.id;
    	Cloud.Photos.query({
		    limit:1,
		    order:"-created_at",
		    where:{
		        user_id:id
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
	profileDetail = $.UI.create('Window',{classes:"whiteWindow"});
	chatDetail = $.UI.create('Window',{classes:"whiteWindow"});
	settingNickname = $.UI.create('Window',{classes:"basicWindow"});
	settingIntroduction = $.UI.create('Window',{classes:"basicWindow"});
	settingResidence = $.UI.create('Window',{classes:"basicWindow"});
	settingBirthplace = $.UI.create('Window',{classes:"basicWindow"});
	settingNickname.hideNavBar();
	settingIntroduction.hideNavBar();
	settingResidence.hideNavBar();
	settingBirthplace.hideNavBar();
	settingNickname.hideTabBar();
	settingIntroduction.hideTabBar();
	settingResidence.hideTabBar();
	settingBirthplace.hideTabBar();
}

// profileListの作成
function createProfileList() {
	profileHeader = $.UI.create('ImageView', {classes:"basicHeader"});
	profileView = $.UI.create('View', {classes:"mainView"});
	profileCount = $.UI.create('Label', {classes:"basicSubTitle"});
	profileTable = $.UI.create('TableView', {classes:"profileTable"});
	profileView.add(profileCount);
	profileView.add(profileTable);
	profileList.add(profileHeader);
	profileList.add(profileView);
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
                        profileLink.addEventListener('click',function(e){tab1.open(profileDetail);});
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

// chatListの作成
function createChatList() {
	chatTable = $.UI.create('TableView',{classes:"chatTable"});
	chatList.add(chatTable);
}
// chatTableの作成
function createChatTable() {
	Cloud.SocialIntegrations.externalAccountLogin({
        type: 'facebook',
        token: accessToken
    }, function(e) {
        if (e.success) {
            Cloud.Chats.getChatGroups(function (e) {
                if (e.success) {
                    rows = [];
                    for (var i = 0; i < e.chat_groups.length; i++) {
                        var group = e.chat_groups[i];
                        var chatRow = $.UI.create('TableViewRow',{classes:"chatRow"});
                        var chatPhoto = $.UI.create('ImageView',{classes:"chatPhoto"});
                        var chatLabel = $.UI.create('Label',{classes:"chatLabel",text: group.participate_ids});
                        var chatMessage = $.UI.create('Label',{classes:"chatMessage",text: group.message});
                        var chatLink = $.UI.create('View',{classes:"chatLink"});
                        chatLink.addEventListener('click',function(e){tab3.open(chatDetail);});
                        chatRow.add(chatPhoto);
                        chatRow.add(chatLabel);
                        chatRow.add(chatMessage);
                        chatRow.add(chatLink);
                        rows.push(chatRow);
                    }
                    chatTable.setData(rows);
                } else {
                    alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
                }
            });
        } else {
            Ti.API.info("Login failed.");
        }
    });
}

// settingListの作成
function createSettingList() {
		settingHeader = $.UI.create('ImageView', {classes:"basicHeader"});
	    settingView = $.UI.create('View', {classes:"mainView"});
		    settingSubTitle = $.UI.create('Label', {classes:"basicSubTitle",text:"マイプロフィール"});
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
		    settingTable = $.UI.create('TableView', {classes:"settingTable"});
				settingRows = [];
					// ニックネーム
					nicknameRow = $.UI.create('TableViewRow',{classes:"settingRow"});
						nicknameLabel = $.UI.create('Label',{classes:"settingLabel",text:"ニックネーム"});
						nicknameRight = $.UI.create('ImageView',{classes:"rightIcon"});
					nicknameRow.addEventListener('click', function(e) {tab4.open(settingNickname);});
					nicknameRow.add(nicknameLabel);
					nicknameRow.add(nicknameRight);
				settingRows.push(nicknameRow);
					// 自己紹介文
					introductionRow = $.UI.create('TableViewRow',{classes:"settingRow"});
						introductionLabel = $.UI.create('Label',{classes:"settingLabel",text:"自己紹介文"});
						introductionRight = $.UI.create('ImageView',{classes:"rightIcon"});
					introductionRow.addEventListener('click', function(e) {tab4.open(settingIntroduction);});
					introductionRow.add(introductionLabel);
					introductionRow.add(introductionRight);
				settingRows.push(introductionRow);
					// 出身地
					birthplaceRow = $.UI.create('TableViewRow',{classes:"settingRow"});
						birthplaceLabel = $.UI.create('Label',{classes:"settingLabel",text:"出身地"});
						birthplaceRight = $.UI.create('ImageView',{classes:"rightIcon"});
					birthplaceRow.addEventListener('click', function(e) {tab4.open(settingBirthplace);});
					birthplaceRow.add(birthplaceLabel);
					birthplaceRow.add(birthplaceRight);
				settingRows.push(birthplaceRow);
					// 居住地
					residenceRow = $.UI.create('TableViewRow',{classes:"settingRow"});
						residenceLabel = $.UI.create('Label',{classes:"settingLabel",text:"現在の居住地"});
						residenceRight = $.UI.create('ImageView',{classes:"rightIcon"});
					residenceRow.addEventListener('click', function(e) {tab4.open(settingResidence);});
					residenceRow.add(residenceLabel);
					residenceRow.add(residenceRight);
				settingRows.push(residenceRow);
			settingTable.setData(settingRows);
		settingView.add(settingSubTitle);
		settingView.add(myProfileHeader);
		settingView.add(settingTable);
	settingList.add(settingHeader);
	settingList.add(settingView);
}

// settingNicknameの作成
function createSettingNickname() {
		settingHeader = $.UI.create('ImageView', {classes:"basicHeader"});
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
	    settingView = $.UI.create('View', {classes:"subView"});
		    settingSubTitle = $.UI.create('Label', {classes:"basicSubTitle",text:"ニックネーム"});
		    settingContentView = $.UI.create('View', {classes:"contentView"});
				catchNickname = $.UI.create('Label',{classes:"catchLabel",top:75});
				nicknameField = $.UI.create('TextField',{classes:"nicknameField"});
				nicknameField.addEventListener('change', function(e) {
					nickname = nicknameField.value;
					if (nickname.length < 2) {
						catchNickname.text = "※ニックネームは2文字以上です";
					} else {
						catchNickname.text = "";
					}
				});
			settingContentView.add(catchNickname);
			settingContentView.add(nicknameField);
		settingView.add(settingSubTitle);
		settingView.add(settingContentView);
	settingNickname.add(settingHeader);
	settingNickname.add(backButton);
	settingNickname.add(doneButton);
	settingNickname.add(settingView);
}

// settingIntroductionの作成
function createSettingIntroduction() {
		settingHeader = $.UI.create('ImageView', {classes:"basicHeader"});
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
	    settingView = $.UI.create('View', {classes:"subView"});
		    settingSubTitle = $.UI.create('Label', {classes:"basicSubTitle",text:"自己紹介文"});
		    settingContentView = $.UI.create('View', {classes:"contentView"});
				catchIntroduction = $.UI.create('Label',{classes:"catchLabel",top:150});
				introductionArea = $.UI.create('TextArea',{classes:"introductionArea"});
				introductionArea.addEventListener('change', function(e) {
					introduction = introductionArea.value;
					if (introduction.length === 0) {
						catchIntroduction.text = "※自己紹介文を入力してください";
					} else if (introduction.length > 140) {
						catchIntroduction.text = "※自己紹介文は140字以内で入力してください（現在、" + introduction.length + "字）。";
					} else {
						catchIntroduction.text = "";
					}
				});
			settingContentView.add(catchIntroduction);
			settingContentView.add(introductionArea);
		settingView.add(settingSubTitle);
		settingView.add(settingContentView);
	settingIntroduction.add(settingHeader);
	settingIntroduction.add(backButton);
	settingIntroduction.add(doneButton);
	settingIntroduction.add(settingView);
}

// settingResidenceの作成
function createSettingResidence() {
		settingHeader = $.UI.create('ImageView', {classes:"basicHeader"});
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
	    settingView = $.UI.create('View', {classes:"subView"});
		    settingSubTitle = $.UI.create('Label', {classes:"basicSubTitle",text:"現在の居住地"});
			residenceTable = $.UI.create('TableView',{classes:"residenceTable"});
				residenceRows = [];
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
				residenceRows.push(hokkaidouRow);
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
				residenceRows.push(aomoriRow);
			residenceTable.setData(residenceRows);
		settingView.add(settingSubTitle);
		settingView.add(residenceTable);
	settingResidence.add(settingHeader);
	settingResidence.add(backButton);
	settingResidence.add(doneButton);
	settingResidence.add(settingView);
}

// settingBirthplaceの作成
function createSettingBirthplace() {
		settingHeader = $.UI.create('ImageView', {classes:"basicHeader"});
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
	    settingView = $.UI.create('View', {classes:"subView"});
		    settingSubTitle = $.UI.create('Label', {classes:"basicSubTitle",text:"出身地"});
			birthplaceTable = $.UI.create('TableView',{classes:"birthplaceTable"});
				birthplaceRows = [];
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
				birthplaceRows.push(hokkaidouRow);
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
				birthplaceRows.push(aomoriRow);
			birthplaceTable.setData(birthplaceRows);
		settingView.add(settingSubTitle);
		settingView.add(birthplaceTable);
	settingBirthplace.add(settingHeader);
	settingBirthplace.add(backButton);
	settingBirthplace.add(doneButton);
	settingBirthplace.add(settingView);
}

exports.move = function() {
	createTabGroup();
	createOtherWindow();
	createProfileList();
	createProfileTable();
	createChatList();
	createChatTable();
	createSettingList();
	createSettingNickname();
	createSettingIntroduction();
	createSettingResidence();
	createSettingBirthplace();
};
