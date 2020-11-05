//indexedDB.deleteDatabase('flydreamairDB');
//localStorage.clear();
$(function () {

	let currentUser = "";

	if ("currentUser" in localStorage)
		currentUser = localStorage.getItem("currentUser");
	else
		localStorage.setItem("currentUser", currentUser);

	if (currentUser != "") {

		let req = indexedDB.open('flydreamairDB');
		req.onsuccess = () => {

			let database = req.result;
			let trans = database.transaction('Customers', 'readonly');

			let customers = trans.objectStore('Customers');
			let name = customers.openCursor()

			name.onsuccess = () => {

				let cursor = name.result;
				if (currentUser == cursor.key) {

					let thisCustomerName = cursor.value.fullName;
					$("#currentUser").text(thisCustomerName).attr("href", "account.html");
					$("#contactDetailsName").text(thisCustomerName);
					$("#contactDetailsEmail").text(cursor.key);

				} else
					cursor.continue();

			}

			database.close();

		}

	}

	function pad(n) {

		n = n + '';

		return n.length >= 2 ? n : new Array(2 - n.length + 1).join(0) + n;

	}


	function pythagorean(sideA, sideB) {
		return Math.trunc(Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2)));
	}

	let openRequest = indexedDB.open('flydreamairDB', 1);
	let db, trans, users, flights, to_index, from_index;

	openRequest.onupgradeneeded = function (e) {
		
		let db = openRequest.result;
		let users = db.createObjectStore("Customers", { keyPath: "email" }, { unique: true });
		let flights_t = db.createObjectStore("Flights", { keyPath: "flightID"});
		let to_index = flights_t.createIndex("To", "To", { unique: false });
		let from_index = flights_t.createIndex("From", "From", { unique: false });

		db.onerror = function (e) {

			console.log("Error" + e.target.errorCode);

		};

		db.close();

	};
	openRequest.onerror = function (e) {

		console.error("There was an error", openRequest.error);

	};
	openRequest.onsuccess = function (e) {

		db = openRequest.result;
		let trans = db.transaction(["Flights"], "readwrite");
		db.onerror = function (e) {

			console.log("Error" + e.target.errorCode);

		};

		let flights = trans.objectStore("Flights");
		
		let amn = flights.count();
		amn.onsuccess = () => {

			switch (amn.result) {

				case 0:

					let places = ["Hobart", "Melbourne", "Canberra", "Sydney", "Brisbane", "Darwin", "Perth", "Adelaide"];
					let latitude = [70, 65, 75, 80, 100, 40, 0, 45];
					let longitude = [0, 20, 25, 30, 55, 100, 30, 25];
					for (let i = 0; i < 151; i++) {

						let to_r = Math.floor(Math.random() * Math.floor(8));
						let from_r = Math.floor(Math.random() * Math.floor(8));

						while (to_r == from_r)
							from_r = Math.floor(Math.random() * Math.floor(8));

						let hours = pad(Math.floor(Math.random() * Math.floor(25)));
						let minutes = pad(Math.floor(Math.random() * Math.floor(60)));
						let time = hours + ":" + minutes;

						let dur = Math.round(pythagorean((latitude[from_r] - latitude[to_r]), (longitude[from_r] - longitude[to_r])));

						if (dur < 16) {
							dur = 16;
						}

						let attempt = flights.add({

							flightID: i, From: places[from_r], To: places[to_r],
							Departure_Time: time,
							Duration: Math.round(3.75 * dur),
							ECTicket: Math.round(5 * dur),
							BCTicket: Math.round(10 * dur)

						});

					}
					break;

				default:
					break;

			}

		}

		db.close();

	};


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
		} else if (state == "SA") {
			$("#state_covid_info").html(SA_covid_html);
		} else {
			$("#state_covid_info").html("Selection Error");
		}

	});



});

function changeDetails() {

	$("#inputChangingDetails span").remove();

	$("#inputChangingDetails input").each((index, value) => {

		let userInfo = [];
		let canContinue = true;

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

}

function logout() {

	localStorage.setItem("currentUser", "");

	window.open("index.html", "_parent");

}