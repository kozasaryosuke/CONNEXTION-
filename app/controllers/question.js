exports.move = function() {
	var tabGroup = Titanium.UI.createTabGroup(),
	Cloud = require('ti.cloud'),
	accessToken = Ti.App.Properties.getString('accessToken'),
	role,introduction,residence,birthplace;
	
	// Windowの作成
	var win = $.UI.create('Window',{classes:"win"});
	win.hideTabBar();
	win.hideNavBar();
		var headerImage = $.UI.create('ImageView',{classes:"headerImage"});
		var mainView = $.UI.create('View',{classes:"mainView"});
			var catchLabel = $.UI.create('Label',{classes:"catchLabel",text:"プロフィールを入力して\nあなただけの人脈を手に入れよう"});
			var profileTable = $.UI.create('TableView',{classes:"profileTable"});
				var profileRows = [];
					// 学生or社会人
					var roleRow = $.UI.create('TableViewRow',{classes:"basicRow"});
						var roleLabel = $.UI.create('Label',{classes:"basicLabel",text:"あなたは学生 or 社会人？"});
						var roleIcon = $.UI.create('ImageView',{classes:"basicIcon",image:"/images/role_icon.png"});
						var roleRight = $.UI.create('ImageView',{classes:"rightIcon"});
					roleRow.addEventListener('click', function(e) {tab.open(roleQuestion);});
					roleRow.add(roleLabel);
					roleRow.add(roleIcon);
					roleRow.add(roleRight);
				profileRows.push(roleRow);
					// 自己紹介文
					var introductionRow = $.UI.create('TableViewRow',{classes:"basicRow"});
						var introductionLabel = $.UI.create('Label',{classes:"basicLabel",text:"自己紹介文"});
						var introductionIcon = $.UI.create('ImageView',{classes:"basicIcon",image:"/images/introduction_icon.png"});
						var introductionRight = $.UI.create('ImageView',{classes:"rightIcon"});
					introductionRow.addEventListener('click', function(e) {tab.open(introductionQuestion);});
					introductionRow.add(introductionLabel);
					introductionRow.add(introductionIcon);
					introductionRow.add(introductionRight);
				profileRows.push(introductionRow);
					// 出身地
					var birthplaceRow = $.UI.create('TableViewRow',{classes:"basicRow"});
						var birthplaceLabel = $.UI.create('Label',{classes:"basicLabel",text:"出身地"});
						var birthplaceIcon = $.UI.create('ImageView',{classes:"basicIcon",image:"/images/birthplace_icon.png"});
						var birthplaceRight = $.UI.create('ImageView',{classes:"rightIcon"});
					birthplaceRow.addEventListener('click', function(e) {tab.open(birthplaceQuestion);});
					birthplaceRow.add(birthplaceLabel);
					birthplaceRow.add(birthplaceIcon);
					birthplaceRow.add(birthplaceRight);
				profileRows.push(birthplaceRow);
					// 居住地
					var residenceRow = $.UI.create('TableViewRow',{classes:"basicRow"});
						var residenceLabel = $.UI.create('Label',{classes:"basicLabel",text:"現在の居住地"});
						var residenceIcon = $.UI.create('ImageView',{classes:"basicIcon",image:"/images/residence_icon.png"});
						var residenceRight = $.UI.create('ImageView',{classes:"rightIcon"});
					residenceRow.addEventListener('click', function(e) {tab.open(residenceQuestion);});
					residenceRow.add(residenceLabel);
					residenceRow.add(residenceIcon);
					residenceRow.add(residenceRight);
				profileRows.push(residenceRow);
			profileTable.setData(profileRows);
			var noteView = $.UI.create('View',{classes:"noteView"});
				var noteLabel = $.UI.create('Label',{classes:"noteLabel"});
				var noteIcon = $.UI.create('ImageView',{classes:"noteIcon"});
			noteView.add(noteLabel);
			noteView.add(noteIcon);
			var sendButton = $.UI.create('Button',{classes:"cannotButton"});
		mainView.add(catchLabel);
		mainView.add(profileTable);
		mainView.add(noteView);
		mainView.add(sendButton);
	win.add(headerImage);
	win.add(mainView);
	
	// roleQuestion
	var roleQuestion = $.UI.create('Window',{classes:"questionWindow"});
		var catchRole = $.UI.create('Label',{classes:"catchLabel",text:"学生か社会人を選んでください"});
		var roleTable = $.UI.create('TableView',{classes:"roleTable"});
			var roleRows = [];
				// 学生
				var studentRow = $.UI.create('TableViewRow',{classes:"basicRow"});
					var studentLabel = $.UI.create('Label',{classes:"selectLabel",text:"学生"});
					var studentIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/student_icon.png"});
					var studentCheck = $.UI.create('ImageView',{classes:"checkIcon"});
				studentRow.addEventListener('click', function(e) {
					role = "学生";
					studentCheck.image = '/images/check_icon.png';
					roleLabel.text = '学生';
					roleLabel.color = '#333';
					roleIcon.image = '/images/student_icon.png';
					roleIcon.width = '26';
					roleIcon.left = '5';
					roleRight.image = '/images/check_icon.png';
					roleRight.width = '26';
					sendButton.shadowColor = "#101937";
					sendButton.shadowOffset = {x:0,y:2};
					sendButton.shadowRadius = 10;
					sendButton.backgroundImage = "/images/send_button_bg.png";
					sendButton.backgroundSelectedImage = "/images/send_button_bg.png";
					sendButton.addEventListener('click', function(e) {
						Cloud.SocialIntegrations.externalAccountLogin({
							type: 'facebook',
							token: accessToken
						}, function (e) {
							if (e.success) {
								// Update Users
								Cloud.Users.update({
									role: role,
									custom_fields: {
										introduction: introduction, 
										residence: residence,
										birthplace: birthplace
									}
								}, function (e) {
									if (e.success) {
										var user = e.users[0];
										Ti.API.info(user);
										Alloy.createController('main').move();
									} else {
										alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
									}
								});
							} else {
								alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
							}
						});
					});
					tab.close(roleQuestion);
				});
				studentRow.add(studentLabel);
				studentRow.add(studentIcon);
				studentRow.add(studentCheck);
			roleRows.push(studentRow);
				// 社会人
				var adultRow = $.UI.create('TableViewRow',{classes:"basicRow"});
					var adultLabel = $.UI.create('Label',{classes:"selectLabel",text:"社会人"});
					var adultIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/adult_icon.png"});
					var adultCheck = $.UI.create('ImageView',{classes:"checkIcon"});
				adultRow.addEventListener('click', function(e) {
					role = "社会人";
					adultCheck.image = '/images/check_icon.png';
					roleLabel.text = '社会人';
					roleLabel.color = '#333';
					roleIcon.image = '/images/adult_icon.png';
					roleIcon.width = '26';
					roleIcon.left = '5';
					roleRight.image = '/images/check_icon.png';
					roleRight.width = '26';
					sendButton.shadowColor = "#101937";
					sendButton.shadowOffset = {x:0,y:2};
					sendButton.shadowRadius = 10;
					sendButton.backgroundImage = "/images/send_button_bg.png";
					sendButton.backgroundSelectedImage = "/images/send_button_bg.png";
					sendButton.addEventListener('click', function(e) {
						Cloud.SocialIntegrations.externalAccountLogin({
							type: 'facebook',
							token: accessToken
						}, function (e) {
							if (e.success) {
								// Update Users
								Cloud.Users.update({
									role: role,
									custom_fields: {
										introduction: introduction, 
										residence: residence,
										birthplace: birthplace,
										// birthday: "1983-07-31T15:00:00.000Z",
									}
								}, function (e) {
									if (e.success) {
										var user = e.users[0];
										Ti.API.info(user);
										Alloy.createController('main').move();
									} else {
										alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
									}
								});
							} else {
								alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
							}
						});
					});
					tab.close(roleQuestion);
				});
				adultRow.add(adultLabel);
				adultRow.add(adultIcon);
				adultRow.add(adultCheck);
			roleRows.push(adultRow);
		roleTable.setData(roleRows);
	roleQuestion.add(catchRole);
	roleQuestion.add(roleTable);
	
	// introductionQuestion
	var introductionQuestion = $.UI.create('Window',{classes:"questionWindow"});
		var catchIntroduction = $.UI.create('Label',{classes:"catchLabel",text:"自己紹介文を入力して下さい(140字以内)"});
		var introductionArea = $.UI.create('TextArea',{classes:"introductionArea"});
		introductionArea.addEventListener('change', function(e) {
			introduction = introductionArea.value;
			catchIntroduction.text = "あと" + (140 - introduction.length) + "字可能";
			if (introduction.length > 140) {
				catchIntroduction.color = "#FF0000";
				introductionLabel.text = introduction;
				introductionLabel.color = "#333";
				introductionIcon.image = '/images/pencil_icon.png';
				introductionIcon.width = '26';
				introductionRight.image = '/images/ng_icon.png';
				introductionRight.width = '26';
				introductionIcon.left = '5';
			} else if (introduction.length > 0) {
				catchIntroduction.color = "#333";
				introductionLabel.text = introduction;
				introductionLabel.color = "#333";
				introductionIcon.image = '/images/pencil_icon.png';
				introductionIcon.width = '26';
				introductionRight.image = '/images/check_icon.png';
				introductionRight.width = '26';
				introductionIcon.left = '5';
			} else {
				catchIntroduction.color = "#333";
				introductionLabel.text = "自己紹介文";
				introductionLabel.color = "#B5B5B6";
				introductionIcon.image = '/images/introduction_icon.png';
				introductionIcon.width = '13';
				introductionRight.image = '/images/right_icon.png';
				introductionRight.width = '13';
				introductionIcon.left = '13';
			}
		});
	introductionQuestion.add(catchIntroduction);
	introductionQuestion.add(introductionArea);
	
	// residenceQuestion
	var residenceQuestion = $.UI.create('Window',{classes:"questionWindow"});
		var catchResidence = $.UI.create('Label',{classes:"catchLabel",text:"現在住んでいる都道府県を選んで下さい"});
		var residenceTable = $.UI.create('TableView',{classes:"residenceTable"});
			var residenceRows = [];
				// 北海道
				var hokkaidouRow = $.UI.create('TableViewRow',{classes:"basicRow"});
					var hokkaidouLabel = $.UI.create('Label',{classes:"selectLabel",text:"北海道"});
					var hokkaidouIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/hokkaidou_icon.png"});
					var hokkaidouCheck = $.UI.create('ImageView',{classes:"checkIcon"});
				hokkaidouRow.addEventListener('click', function(e) {
					residence = "北海道";
					hokkaidouCheck.image = '/images/check_icon.png';
					residenceLabel.text = '北海道';
					residenceLabel.color = '#333';
					residenceIcon.image = '/images/hokkaidou_icon.png';
					residenceIcon.width = '26';
					residenceIcon.left = '5';
					residenceRight.image = '/images/check_icon.png';
					residenceRight.width = '26';
					tab.close(residenceQuestion);
				});
				hokkaidouRow.add(hokkaidouLabel);
				hokkaidouRow.add(hokkaidouIcon);
				hokkaidouRow.add(hokkaidouCheck);
			residenceRows.push(hokkaidouRow);
				// 青森県
				var aomoriRow = $.UI.create('TableViewRow',{classes:"basicRow"});
					var aomoriLabel = $.UI.create('Label',{classes:"selectLabel",text:"青森県"});
					var aomoriIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/aomori_icon.png"});
					var aomoriCheck = $.UI.create('ImageView',{classes:"checkIcon"});
				aomoriRow.addEventListener('click', function(e) {
					residence = "青森県";
					aomoriCheck.image = '/images/check_icon.png';
					residenceLabel.text = '青森県';
					residenceLabel.color = '#333';
					residenceIcon.image = '/images/aomori_icon.png';
					residenceIcon.width = '26';
					residenceIcon.left = '5';
					residenceRight.image = '/images/check_icon.png';
					residenceRight.width = '26';
					tab.close(residenceQuestion);
				});
				aomoriRow.add(aomoriLabel);
				aomoriRow.add(aomoriIcon);
				aomoriRow.add(aomoriCheck);
			residenceRows.push(aomoriRow);
		residenceTable.setData(residenceRows);
	residenceQuestion.add(catchResidence);
	residenceQuestion.add(residenceTable);
	
	// birthplaceQuestion
	var birthplaceQuestion = $.UI.create('Window',{classes:"questionWindow"});
		var catchBirthplace = $.UI.create('Label',{classes:"catchLabel",text:"出身の都道府県を選んで下さい"});
		var birthplaceTable = $.UI.create('TableView',{classes:"birthplaceTable"});
			var birthplaceRows = [];
				// 北海道
				var hokkaidouRow = $.UI.create('TableViewRow',{classes:"basicRow"});
					var hokkaidouLabel = $.UI.create('Label',{classes:"selectLabel",text:"北海道"});
					var hokkaidouIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/hokkaidou_icon.png"});
					var hokkaidouCheck = $.UI.create('ImageView',{classes:"checkIcon"});
				hokkaidouRow.addEventListener('click', function(e) {
					birthplace = "北海道";
					hokkaidouCheck.image = '/images/check_icon.png';
					birthplaceLabel.text = '北海道';
					birthplaceLabel.color = '#333';
					birthplaceIcon.image = '/images/hokkaidou_icon.png';
					birthplaceIcon.width = '26';
					birthplaceIcon.left = '5';
					birthplaceRight.image = '/images/check_icon.png';
					birthplaceRight.width = '26';
					tab.close(birthplaceQuestion);
				});
				hokkaidouRow.add(hokkaidouLabel);
				hokkaidouRow.add(hokkaidouIcon);
				hokkaidouRow.add(hokkaidouCheck);
			birthplaceRows.push(hokkaidouRow);
				// 青森県
				var aomoriRow = $.UI.create('TableViewRow',{classes:"basicRow"});
					var aomoriLabel = $.UI.create('Label',{classes:"selectLabel",text:"青森県"});
					var aomoriIcon = $.UI.create('ImageView',{classes:"bigIcon",image:"/images/aomori_icon.png"});
					var aomoriCheck = $.UI.create('ImageView',{classes:"checkIcon"});
				aomoriRow.addEventListener('click', function(e) {
					birthplace = "青森県";
					aomoriCheck.image = '/images/check_icon.png';
					birthplaceLabel.text = '青森県';
					birthplaceLabel.color = '#333';
					birthplaceIcon.image = '/images/aomori_icon.png';
					birthplaceIcon.width = '26';
					birthplaceIcon.left = '5';
					birthplaceRight.image = '/images/check_icon.png';
					birthplaceRight.width = '26';
					tab.close(birthplaceQuestion);
				});
				aomoriRow.add(aomoriLabel);
				aomoriRow.add(aomoriIcon);
				aomoriRow.add(aomoriCheck);
			birthplaceRows.push(aomoriRow);
		birthplaceTable.setData(birthplaceRows);
	birthplaceQuestion.add(catchBirthplace);
	birthplaceQuestion.add(birthplaceTable);
	
	// tabGroupのopen
	var tab = Ti.UI.createTab({window:win});
	tabGroup.addTab(tab);
	tabGroup.open();
};
