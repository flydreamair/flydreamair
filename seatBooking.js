$(function () {

	let htmlOut = ""

	for (let i = 1; i < 29; i++) {

		htmlOut += "<option value=" + i + "A>" + i + "A</option>";
		htmlOut += "<option value=" + i + "B>" + i + "B</option>";
		htmlOut += "<option value=" + i + "C>" + i + "C</option>";
		htmlOut += "<option value=" + i + "D>" + i + "D</option>";
		htmlOut += "<option value=" + i + "E>" + i + "E</option>";
		htmlOut += "<option value=" + i + "F>" + i + "F</option>";

	}

	$("#seat-selection").append(htmlOut);

});

function confirmSeat() {

	let newSeat = $("#seat-selection").val();

	let rq = indexedDB.open('flydreamairDB');
	rq.onsuccess = () => {

		let db = rq.result;

		let trans = db.transaction(["Customers"], "readwrite");
		let customers = trans.objectStore("Customers");
		let c = customers.openCursor();

		c.onsuccess = () => {

			let cursor = c.result;

			if (cursor) {

				if (cursor.key == localStorage.getItem('currentUser')) {

					let thisFlight = cursor.value.flights.pop();
					thisFlight.seat = newSeat;
					cursor.value.flights.push(thisFlight);
					let rq2 = cursor.update(cursor.value);
					rq2.onsuccess = () => {

						window.open("in-flight.html", "_parent");

					}
				} else
					cursor.continue();

			}

		}

	}

}

function editFlight() {

	window.open("search.html", "_parent");

}