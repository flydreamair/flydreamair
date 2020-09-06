var users = [];


if (JSON.parse(localStorage.getItem("users")) != null){
	
	users = JSON.parse(localStorage.getItem("users"));

}

function register_user(){


	console.log(JSON.parse(localStorage.getItem(users)));

   let uname = document.getElementById("uname").value.trim();
   let pword = document.getElementById("pword").value.trim();

   if (!user_check_r(uname)){
   
     users.push({username:uname, password:pword});
	 document.getElementById("uname").value = "";
	 document.getElementById("pword").value = "";
	 document.getElementById("register_out").innerHTML = "Register successful";
	localStorage.setItem("users", JSON.stringify(users));


   }else if (user_check(uname, pword)){
   
		document.getElementById("register_out").innerHTML = "User already exists!";

   }

	console.log(users);

}

function user_check_r(uname){

	for (let i = 0; i < users.length; i++){

		if (uname == users[i].username)
			return true;

	}

	return false

}

function user_check(uname, pword){

	for (let i = 0; i < users.length; i++){

		if (uname == users[i].username && pword == users[i].password)
			return true;

	}

	return false;

}

function login(){

	let uname = document.getElementById("uname_login").value.trim();
	let pword = document.getElementById("pword_login").value.trim();

	if (user_check(uname, pword)){

		document.getElementById("out").innerHTML = "Login succeded!";
		document.getElementById("uname_login").value = "";
		document.getElementById("pword_login").value = "";

	} else {
		
		document.getElementById("out").innerHTML = "Login failed :(";

	}

}