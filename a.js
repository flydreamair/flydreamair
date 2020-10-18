
$(function(){

	var users = [];

	if (JSON.parse(localStorage.getItem("users")) != null)
		users = JSON.parse(localStorage.getItem("users"));

	$("#login").on('click', function(){
	
		let uname = $("#uname_login").val().trim();
		let pword = $("#pword_login").val().trim();

		let user_check = false;

		for (let i = 0; i < users.length; i++)
			if (uname == users[i].username && pword == users[i].password)
				user_check =  true;


		if (user_check){

			$("#out").text("Login succeded!");
			$("#uname_login").val("");
			$("#pword_login").val("");
			sessionStorage.setItem("active_user", uname);
			location.replace("indexb.html");

		} else
			$("#out").text("Login failed :(");
		
	});

	$("#register_user").on('click', function(){

		let uname = $("#uname").val().trim();
		let pword = $("#pword").val().trim();

		let user_check_r = false;

		for (let i = 0; i < users.length; i++)
			if (uname == users[i].username)
				user_check_r =  true;

		if (!user_check_r){
	
		users.push({

			username:uname, 
			password:pword

		});

		$("#uname").val("");
		$("#pword").val("");
		$("#register_out").text("Register successful");
		localStorage.setItem("users", JSON.stringify(users));

		} else
			$("#register_out").text("User already exists!");
		
	});

	$("#state-select").change(function() {

		var state = $(this).val();

		if (state == "") {
			$("#state_covid_info").html(noselect_covid_html);
		} else if (state == "ACT") {
			$("#state_covid_info").html(ACT_covid_html);
		} else if (state == "NSW") {
			$("#state_covid_info").html(NSW_covid_html);
		} else if (state == "NT") {
			$("#state_covid_info").html(NT_covid_html);
		} else if (state == "QLD") {
			$("#state_covid_info").html(QLD_covid_html);
		} else if (state == "TAS") {
			$("#state_covid_info").html(TAS_covid_html);
		} else if (state == "VIC") {
			$("#state_covid_info").html(VIC_covid_html);
		} else if (state == "WA") {
			$("#state_covid_info").html(WA_covid_html);
		} else {
			$("#state_covid_info").html("Selection Error");
		}


	});

});