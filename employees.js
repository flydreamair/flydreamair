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
				window.open("empAccount.html", "_parent");

			} else
				cursor.continue();

		}

		database.close();
	}

}

function registerMe() 
{
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

				givenNames: userInfo[0],
				email: userInfo[1],
				password: userInfo[2],
				flights: []

			});
			addAttempt.onerror = () => {

				console.log("This user already exists");

			}
			addAttempt.onsuccess = () => {

				thisUser = userInfo[4];
				localStorage.setItem("currentUser", thisUser);
				window.open("empLogin.html", "_parent");

			}

			databaseb.close();

		}
	}
}

$(function () {

    $("#registerButton").click(function () {

        window.open("empRegister.html", "_parent");

    });

});

function searchCust()
{
	let eml = document.getElementById("email").value;
	
	let req = indexedDB.open('flydreamairDB');
	req.onsuccess = () => {
	let database = req.result;
	let trans = database.transaction('Customers', 'readonly');

	let customers = trans.objectStore('Customers');
	let name = customers.openCursor();

	name.onsuccess = () => {

	let cursor = name.result;
	if (eml == cursor.key) {
let thisCust = cursor.value;
					let newHtmlOut = '<div class="account-flight-details-overview">';

					thisCust.flights.forEach((flightA) => {

						newHtmlOut += '<div class="account-flight-details"><div class="upcoming-col">';
						newHtmlOut += '<h3 id="from-to">' + flightA.From + " to " + flightA.To + "</h3><hr />";
						newHtmlOut += '<p class="departure-date-account"><b>Departure date: </b>' + flightA.departDate + '</p><hr />';
						newHtmlOut += '<p><b>Flight:</b> <span id="flight-number-account">' + flightA.fID + '</span></p><hr />';
						newHtmlOut += '<p><b>Departs:</b> <span id="departs-account">' + flightA.Departure_Time + '</span></p><hr />';
						newHtmlOut += '<p><b>Arrives:</b> <span id="arrives-account">' + flightA.arriveDate + '</span></p><hr />';
						newHtmlOut += '<p><b>Flight time:</b> <span id="flight-time-account">' + flightA.Duration + ' minutes</span></p>';
						

						newHtmlOut += '<div class="passenger-details-account"><h3> Passenger details</h3><hr />';
						newHtmlOut += '<p class="passenger-name-account">' + thisCust.title + ' ' + thisCust.givenNames + ' ' + thisCust.lastName + '</p><hr />';
						newHtmlOut += '<p><b>Seat:</b> <span id="seat-number-account">' + flightA.seat + '</span></p><hr />';
						

						newHtmlOut += '<div class="in-flight-selections"><h3> In - flight selections</h3 ><hr />';
						newHtmlOut += '<p class="main-meal">' + flightA.foodSubstantial + '</p><hr />';
						newHtmlOut += '<p class="light-meal">' + flightA.foodLight + '</p><hr />';
						newHtmlOut += '<p class="entertainment">' + flightA.entertainment + '</p><hr />';
						newHtmlOut += '<p class="drink">' + flightA.drink + '</p><hr />';
					

					});

					$("#finalPassengerView").html(newHtmlOut);
	} else
	cursor.continue();
  }

database.close();
}
}

function logout() {

	localStorage.setItem("currentUser", "");

	window.open("indexb.html", "_parent");

}
