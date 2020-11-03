let thisUser;
function login() {

	let email = $("#loginEmail").val();
	let password = $("#loginPassword").val();
	let req = indexedDB.open('flydreamairDB');
	req.onsuccess = () => {
		let database = req.result;
		let trans = database.transaction('Customers', 'readonly');

		let customers = trans.objectStore('Customers');
		let name = customers.openCursor();

		name.onsuccess = () => {

			let cursor = name.result;
			if (email == cursor.key && password == cursor.value.password) {

				localStorage.setItem("currentUser", email);
				window.open("account.html", "_parent");

			} else
				cursor.continue();

		}

		database.close();
	}

}

function registerMe() {

	$("span").remove();

	let userInfo = [];

	let canContinue = true;

	$(".myInfo").each((index, value) => {

		let input = ($(value).val()).trim();

		if (input == '') {
			canContinue = false;
			let errorShowId = $(value).attr('id') + '-label';
			$('#' + errorShowId).append("<span> *This field is required </span>");
		}
		else {

			userInfo.push(input);

		}

	});

	if (canContinue) {

		let request = indexedDB.open('flydreamairDB');
		request.onsuccess = () => {

			let databaseb = request.result;
			let trans = databaseb.transaction('Customers', 'readwrite');
			let users = trans.objectStore('Customers');

			let addAttempt = users.add({

				fullName: userInfo[0],
				uID: userInfo[1],
				address: {

					streetAddress: userInfo[2],
					state: userInfo[3],
					city: userInfo[6],
					postcode: userInfo[7]

				},
				email: userInfo[4],
				password: userInfo[5],
				flights: []

			});

			addAttempt.onerror = () => {

				console.log("This user already exists");

			}
			addAttempt.onsuccess = () => {

				thisUser = userInfo[4];
				localStorage.setItem("currentUser", thisUser);
				window.open("index.html", "_parent");

			}

			databaseb.close();

		}

		
	}

	

}

$(function () {

    $("#registerButton").click(function () {

        window.open("register.html", "_parent");

    });

});
