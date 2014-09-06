////////////////////////////////////////////////
//
//	this code contributed to the
//	Teachout/Wu 2014 New York Gubernatorial Campaign
//	by David F. Nevin http://dnevin.com
//
////////////////////////////////////////////////

window.onkeydown=function() {
  var key;
  if (window.event) key=event.keyCode;
  else if (event.which) key=event.which;
  //if (key==0x0d) document.getElementById("btnYes").click();
};
/*
function handleClientLoad() {
  window.setTimeout(checkAuth, 1);
}
*/
function search() {
  checkAuth();
}
function checkAuth() {
  gapi.client.setApiKey("AIzaSyCXqONRudUMRGM2mE-eP3R73qJhmRUwcuk");
  var Request=gapi.client.request({
    "path": "/civicinfo/v1/voterinfo/4047/lookup",
    "method": "POST",
    "body": {"address": document.getElementById("inputaddress").value}
  });
  Request.execute(GetResponse);
}
function GetResponse(resp,rawResp) {
  // clear any old fields
  document.getElementById("PollingPlace").style.display="none";
  document.getElementById("ppName").innerText="";
  document.getElementById("ppLine1").innerText="";
  document.getElementById("ppLine2").innerText="";
  var q2=document.getElementById("not-yet");
  var em=document.getElementById("errorMessage");
  em.innerHTML="";
  if (!resp || resp.error) {
    var em = q2.appendChild(document.createElement("tt"));
    em.innerHTML="<br>An error occurred while trying to fetch the polling place information<br>" + JSON.stringify(resp);
    return;
  }

  console.log( JSON.stringify(resp));

  if (resp.normalizedInput) {
    with (resp.normalizedInput) {
      document.getElementById("inputaddress").value=line1 + ", " + city + ", " + state + ", " + zip;
    }
  }

  if (resp.status!="success") {
    em.style.display="block";
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

  document.getElementById("errorMessage").style.display="none";


  var pp=document.getElementById("PollingPlace");
  pp.style.display="inline";

  //var ins = pp.appendChild(document.createElement("tt"),"");
  //ins.style.fontSize="10pt";
  //ins.innerText=JSON.stringify(resp);

  var addr=resp.pollingLocations[0].address;
  document.getElementById("ppName").innerText=addr.locationName;
  document.getElementById("ppLine1").innerText=addr.line1;
  document.getElementById("ppLine2").innerText=addr.city + ", " + addr.zip;


}
function handleAuthResult(authResult) {
  console.log( "handleAuthResult begins" );
  /*
  var ElectionID=4047;
  var Address=document.getElementById("inputaddress").innerText;
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
  if (key==0x0d) document.getElementById("btnSearch").click();
}
function q1Yes() {
  document.location="http://teachoutwu.amicushq.com/landing/1";
}
function q1NotYet() {
  document.getElementById("buttons").style.display="none";
  document.getElementById("not-yet").style.display="block";
  document.getElementById("inputaddress").focus();
}
function SetToolAlignment() {
  console.log("SetToolAlignment");
  if (document.getElementsByTagName("iframe").length>0) {
    document.getElementsByTagName("iframe")[0].style.position="relative";
    console.log("alignment set.")
  }
  else {
    console.log( getElementsByTagName("iframe").length );
    window.setTimeout(SetToolAlignment,1000);
  }
}
