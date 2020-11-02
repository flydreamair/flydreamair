
$(function () {

	function pad(n) {

		n = n + '';

		return n.length >= 2 ? n : new Array(2 - n.length + 1).join(0) + n;

	}

	let openRequest = indexedDB.open('flydreamairDB', 1);
	let db, trans, users, flights, to_index, from_index;

	openRequest.onupgradeneeded = function (e) {
		
		if (e.target.result.oldVersion == 0)
			indexedDB.deleteDatabase('flydreamairDB');

		let db = openRequest.result;
		let users = db.createObjectStore("Customers", { keyPath: "uID" });
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
					for (let i = 0; i < 151; i++) {

						let to_r = Math.floor(Math.random() * Math.floor(8));
						let from_r = Math.floor(Math.random() * Math.floor(8));

						while (to_r == from_r)
							from_r = Math.floor(Math.random() * Math.floor(8));

						let hours = pad(Math.floor(Math.random() * Math.floor(25)));
						let minutes = pad(Math.floor(Math.random() * Math.floor(60)));
						let time = hours + ":" + minutes;

						let attempt = flights.add({

							flightID: i, From: places[from_r], To: places[to_r],
							Departure_Time: time

						});

					}
					break;

				default:
					let f_cursor = flights.openCursor(IDBKeyRange.upperBound(150));

					f_cursor.onerror = function () { console.log("error"); };

					f_cursor.onsuccess = function () {

						let cursor = f_cursor.result;
						if (cursor) {

							console.log(cursor.key + " " + cursor.value.From + " " + cursor.value.To + " " + cursor.value.Departure_Time);
							cursor.continue();

						}

					};
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
