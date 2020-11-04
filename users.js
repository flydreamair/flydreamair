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

			console.log("hi");

			let addAttempt = users.add({

				title: userInfo[0],
				givenNames: userInfo[1],
				lastName: userInfo[2],
				address: {

					street: userInfo[3],
					city: userInfo[4],
					state: userInfo[5],
					postCode: userInfo[6]

				},
				email: userInfo[7],
				password: userInfo[8],
				flights: []

			});

			addAttempt.onerror = () => {

				console.log("This user already exists");

			}
			addAttempt.onsuccess = () => {

				thisUser = userInfo[7];
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

function submitMyFood() {

	let extraStuffs = [];

	$(".inflight-dropdown").each((i, v) => {

		extraStuffs.push($(v).val());

	});

	console.log(extraStuffs);

	let or = indexedDB.open('flydreamairDB');

	or.onsuccess = () => {

		let db = or.result;

		let trans = db.transaction("Customers", "readwrite");
		let customers = trans.objectStore("Customers");

		let zzz = customers.openCursor();

		zzz.onsuccess = () => {

			let cursor = zzz.result;

			if (cursor) {

				if (cursor.key == localStorage.getItem("currentUser")) {

					cursor.value.flights[cursor.value.flights.length - 1].foodSubstantial = extraStuffs[0];
					cursor.value.flights[cursor.value.flights.length - 1].foodLight = extraStuffs[1];
					cursor.value.flights[cursor.value.flights.length - 1].drink = extraStuffs[2];
					cursor.value.flights[cursor.value.flights.length - 1].entertainment = extraStuffs[3];

					let aaa = cursor.update(cursor.value);

					aaa.onsuccess = () => {

						window.open("passengers.html", "_parent");

					}



				} else
					cursor.continue();

			}

		}

	}


}

$(() => {

	$(".inflight-dropdown").change(function () {

		let state = $(this).val();
		let currentTotal = parseFloat($("#myTotalInFlight").text());

		switch (state) {

			case '50 First Dates':
			case 'Finding Nemo':
			case 'The Notebook':
				currentTotal += 10.50;
				break;
			case 'Sprite':
			case 'Diet Coke':
			case 'Fanta':
				currentTotal += 3;
				break;
			case 'Crumbly Cake':
			case 'Delicious Wrap':
			case 'Fruit Salad':
				currentTotal += 7.95;
				break;
			case 'Pesto Pasta':
			case 'Beef Lasagna':
			case 'Baked Salmon':
				currentTotal += 18.95;
				break;

		}

		$("#myTotalInFlight").text(currentTotal);
		localStorage.setItem('currentCost', currentTotal);

	});

});