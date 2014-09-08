////////////////////////////////////////////////
//
//	this code contributed to the
//	Teachout/Wu 2014 New York Gubernatorial Campaign
//	by David F. Nevin http://dnevin.com
//
////////////////////////////////////////////////

/*
window.onkeydown=function() {
	var key;
	if (window.event) key=event.keyCode;
	else if (event.which) key=event.which;
	//if (key==0x0d) document.getElementById("btnYes").click();
};
*/
function activateSearch() {
	checkAuth();
}
function checkAuth() {
	gapi.client.setApiKey("AIzaSyCXqONRudUMRGM2mE-eP3R73qJhmRUwcuk");
	var Request=gapi.client.request({
		"path": "/civicinfo/v1/voterinfo/4047/lookup",
		"method": "POST",
		"body": {"address": document.getElementById("address").value}
	});
	Request.execute(GetResponse);
}
function GetResponse(resp,rawResp) {
	// clear any old fields
	document.getElementById("name").innerText="";
	document.getElementById("line1").innerText="";
	document.getElementById("line2").innerText="";
	var q2=document.getElementById("content");
	var em=document.getElementById("errorMessage");
	//em.style.display="inline";
	em.innerHTML="";
	if (!resp || resp.error) {
		var em = q2.appendChild(document.createElement("tt"));
		em.innerHTML='<br>Sorry, something went wrong. Try this <a href="http://www.elections.ny.gov/CountyBoards.html">link</a>.<br>';
		return;
	}

	//console.log( JSON.stringify(resp));

	if (resp.normalizedInput) {
		with (resp.normalizedInput) {
			document.getElementById("address").value=line1 + ", " + city + ", " + state + ", " + zip;
		}
	}

	if (resp.status!="success") {
		//em.style.display="block";
		switch (resp.status) {
			case "noAddressParameter":
				em.innerHTML="<br/>no address was entered";
				break;
			case "noStreetSegmentFound":
				em.innerHTML="<br/>no voter is registered at that address";
				break;
			case "addressUnparseable":
				em.innerHTML="<br/>could not understand this address - please try again";
				break;
			default:
				em.innerHTML="<br/>An error occurred while trying to fetch the polling place information<br/>" + JSON.stringify(resp);
		};
		return;
	};

	if (!resp.pollingLocations) {
		console.log( JSON.stringify(resp.state));
		em.innerHTML="<br/>Your address is valid, but the system cannot determine your polling location." ;
		if (resp.state) {
			if (resp.state.length>0) {
				em.innerHTML+=("<br/>The following information may help:");
				// api doc indicates a maximum of one element for all US locations
				var eab=resp.state[0].electionAdministrationBody;
				em.innerHTML+=("<br/>Administrative Body: " + eab.name);
				if (eab.votingLocationFinderUrl) em.innerHTML+=("<br/>link to <a href='" + eab.votingLocationFinderUrl + "' target='blank'>Voting Location Finder</a>");
				if (eab.electionRegistrationConfirmationUrl) em.innerHTML+=("<br/>link to <a href='" + eab.electionRegistrationConfirmationUrl + "' target='blank'>Election Registration Confirmation</a>");
				if (eab.electionInfoUrl) em.innerHTML+=("<br/>link to <a href='" + eab.electionInfoUrl + "' target='blank'>Election Information</a>");
				if (eab.electionRegistrationUrl) em.innerHTML+=("<br/>link to <a href='" + eab.electionRegistrationUrl + "' target='blank'>Election Registration Information</a>");
				if (eab.hoursOfOperation) em.innerHTML+=("<br/>link to <a href='" + eab.hoursOfOperation + "' target='blank'>Hours of operation</a>");
				if (eab.electionOfficials) {
					if (eab.electionOfficials.length>0) {
						em.innerHTML+=("<br/>Election Officials:");
						for (var ieo=0; ieo<eab.electionOfficials.length; ieo++) {
							var eo=eab.electionOfficials[ieo];
							em.innerHTML+=("<br/>Name:" + eo.name);
							em.innerHTML+=("<br/>Title:" + eo.title);
							em.innerHTML+=("<br/>Phone:" + eo.officePhoneNumber);
							em.innerHTML+=("<br/>Fax:" + eo.faxNumber);
							em.innerHTML+=("<br/>eMail:" + eo.emailAddress);
						}
					}
				}
				if (resp.state[0].local_jurisdiction) {
					if (resp.state[0].local_jurisdiction.electionAdministrationBody) {
						if (resp.state[0].local_jurisdiction.electionAdministrationBody.electionOfficials) {
							em.innerHTML+=("<br/>Election Officials:");
							var eoArray=resp.state[0].local_jurisdiction.electionAdministrationBody.electionOfficials;
							for (ieo=0; ieo<eoArray.length; ieo++) {
								var eo=eoArray[ieo];
								if (eo.name) em.innerHTML+=("<br/>Name: " + eo.name);
								if (eo.title) em.innerHTML+=("<br/>Title: " + eo.title);
								if (eo.officePhoneNumber) em.innerHTML+=("<br/>Phone: " + eo.officePhoneNumber);
								if (eo.emailAddress) em.innerHTML+=("<br/>eMail: " + eo.emailAddress);
								if (eo.faxNumber) em.innerHTML+=("<br/>Fax: " + eo.faxNumber);

							}
						}
					}
				}
			}
		}
		return;
	}

	var pp=document.getElementById("PollingPlace");
	// pp.style.display="inline";

	//var ins = pp.appendChild(document.createElement("tt"),"");
	//ins.style.fontSize="10pt";
	//ins.innerText=JSON.stringify(resp);

	var addr=resp.pollingLocations[0].address;
	document.getElementById("name").innerText=addr.locationName;
	document.getElementById("line1").innerText=addr.line1;
	document.getElementById("line2").innerText=addr.city + ", " + addr.zip;


}
function handleAuthResult(authResult) {
	console.log( "handleAuthResult begins" );
	/*
	var ElectionID=4047;
	var Address=document.getElementById("address").innerText;
	var Request=gapi.client.request({
		"path":"/civicinfo/v1/voterinfo/" + ElectionID + "/lookup",
		"method":"POST",
		"body":{"address": Address }
	});
	//Request.execute(callback);
	Request.execute();
	*/
	document.getElementById("PollingPlace1").innerText=JSON.stringify(authResult);
    console.log( "authResult: " + JSON.stringify(authResult) );
	console.log( "handleAuthResult ends" );
}
function enterkey() {
	var key;
	if (window.event) key=event.keyCode;
	else if (event.which) key=event.which;
	//console.log( String.fromCharCode(key));
	if (key==0x0d) document.getElementById("searchBtn").click();
}
function q1Yes() {
	document.location="http://teachoutwu.amicushq.com/landing/1";
}
function q1NotYet() {
	document.location="locator.html";
}
/*
function SetToolAlignment() {
	console.log("SetToolAlignment");
	if (document.getElementsByTagName("iframe").length>0) {
		document.getElementsByTagName("iframe")[0].style.position="relative";
		console.log("alignment set.");
	}
	else {
		console.log( getElementsByTagName("iframe").length );
		window.setTimeout(SetToolAlignment,1000);
	}
}
*/
