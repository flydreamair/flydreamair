$(() => {

	let or = indexedDB.open("flydreamairDB");

	or.onsuccess = () => {

		let db = or.result;

		let trans = db.transaction("Customers", "readwrite");
		let customers = trans.objectStore("Customers");

		let xxp = customers.openCursor();

		xxp.onsuccess = () => {

			let cursor = xxp.result;

			if (cursor) {

				if (cursor.key == localStorage.getItem("currentUser")) {

					let thisCust = cursor.value;
					let newHtmlOut = '<div class="account-flight-details-overview">';

					let flightA = cursor.value.flights[cursor.value.flights.length - 1];

					newHtmlOut += '<div class="account-flight-details"><div class="upcoming-col">';
					newHtmlOut += '<h3 id="from-to">' + flightA.From + " to " + flightA.To + "</h3><hr />";
					newHtmlOut += '<p class="departure-date-account"><b>Departure date: </b>' + flightA.departDate + '</p><hr />';
					newHtmlOut += '<p><b>Flight:</b> <span id="flight-number-account">' + flightA.fID + '</span></p><hr />';
					newHtmlOut += '<p><b>Departs:</b> <span id="departs-account">' + flightA.Departure_Time + '</span></p><hr />';
					newHtmlOut += '<p><b>Arrives:</b> <span id="arrives-account">' + flightA.arriveDate + '</span></p><hr />';
					newHtmlOut += '<p><b>Flight time:</b> <span id="flight-time-account">' + flightA.Duration + ' minutes</span></p>';
					newHtmlOut += '<br /><br />';

					newHtmlOut += '<div class="passenger-details-account"><h3> Passenger details</h3><hr />';
					newHtmlOut += '<p class="passenger-name-account">' + thisCust.title + ' ' + thisCust.givenNames + ' ' + thisCust.lastName + '</p><hr />';
					newHtmlOut += '<p><b>Seat:</b> <span id="seat-number-account">' + flightA.seat + '</span></p><hr />';
					newHtmlOut += '</div><br />';

					newHtmlOut += '<div class="in-flight-selections"><h3> In - flight selections</h3 ><hr />';
					newHtmlOut += '<p class="main-meal">' + flightA.foodSubstantial + '</p><hr />';
					newHtmlOut += '<p class="light-meal">' + flightA.foodLight + '</p><hr />';
					newHtmlOut += '<p class="entertainment">' + flightA.entertainment + '</p><hr />';
					newHtmlOut += '<p class="drink">' + flightA.drink + '</p><hr />';
					newHtmlOut += '<a href = "in-flight.html" onclick="editFoodDetails()"> Edit in-flight selections</a ></div >';



					newHtmlOut += "</div></div>";

					$("#finalPassengerView").html(newHtmlOut);

				} else
					cursor.continue();

			}

		}

		db.close();
	}
});

function confirmFlightFinal() {

	window.open("account.html", "_parent");

}