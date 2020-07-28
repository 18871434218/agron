function loadBackendState(message)//一点都没用到
{
	var xmlhttp;
	var idList = [];
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var n = 0;
			console.log("state:", xmlhttp.responseText);
			console.log("subMessage", message.payloadString);
			consoleMessage(message);
			var stateObj = JSON.parse(xmlhttp.responseText);
			for (var i = 0; i < stateObj.meta.count; i++)//get all connected car id
			{
				if (stateObj.data[i].topic == "SunnyCarMachineSub")
				{
					idList.length = n + 1;
					idList[n++] = stateObj.data[i].client_id;
					console.log(n - 1,":",idList[n - 1]);
					console.log("in topic");
				}
			}
			
			try//if message arrived update car state
			{
				var str = message.destinationName;
				if (str == "SunnyCarClientSub")
				{
					var obj = JSON.parse(message.payloadString);
					if (markerIdList.hasOwnProperty(obj.vehicleInfo[1]))// if marker is listed
					{
						for (var j = 0; j < markerList.length;j++) // if listed then update position and break
						{
							if (markerList[j]._amap_id == markerIdList[obj.vehicleInfo[1]]) 
							{
								markerList[j].setPosition([obj.vehicleInfo[3],obj.vehicleInfo[4]]); // update position on map
								textList[j].setPosition([obj.vehicleInfo[3],obj.vehicleInfo[4]]); // update label position
								markerMessageList[markerList[j]._amap_id] = message; // update marker to message list
								if (markerList[j] == currentMarker) // if is currentMarker then update angle
								{
									currentMarker.setAngle(-obj.vehicleInfo[5]);
								}
								break;
							}
						}
					}
					else //new added marker and update list
					{
						addMarker([obj.vehicleInfo[3],obj.vehicleInfo[4]]);//set pose
						markerList[markerList.length - 1].setTitle(obj.vehicleInfo[1]);//set title
						// markerList[markerList.length - 1].setLabel({    //set label
						// 	offset: new AMap.Pixel(0,-30),
						// 	content: obj.vehicleInfo[1].toString(),
						// 	direction: 'center'
						// });
						textList[markerList.length - 1].setText("<div class = 'amap-overlay-text-container'>" + "No."+obj.vehicleInfo[1].toString() + "</div>"); //set label
						markerIdList[obj.vehicleInfo[1]] = markerList[markerList.length - 1]._amap_id;// set id to marker list
						markerMessageList[markerList[markerList.length - 1]._amap_id] = message; // set marker to message list
					}
					console.log("sunnyajax:",markerIdList);
				}
			}
			catch(e)
			{
				console.log("message formatError:", e);
			}
			
		}
	}
	xmlhttp.open("GET","/api/v3/subscriptions",true,"3bcd9eb2f9f84","Mjg5NzczMDEyNDU5ODg4ODA3OTE2NTU3MDY3NDI4MTY3NjI");
	//xmlhttp.setRequestHeader("Authorization","Basic" + Base64.encode("3bcd9eb2f9f84:Mjg5NzczMDEyNDU5ODg4ODA3OTE2NTU3MDY3NDI4MTY3NjI"));//'3bcd9eb2f9f84:Mjg5NzczMDEyNDU5ODg4ODA3OTE2NTU3MDY3NDI4MTY3NjI');	
	//xmlhttp.setRequestHeader("Authorization","Basic "+window.btoa("3bcd9eb2f9f84:Mjg5NzczMDEyNDU5ODg4ODA3OTE2NTU3MDY3NDI4MTY3NjI"));
	xmlhttp.send();
}
/*
function loadBackendState(message)
{
	$.get("/api/v3/subscriptions",{ account:"3bcd9eb2f9f84", password:"Mjg5NzczMDEyNDU5ODg4ODA3OTE2NTU3MDY3NDI4MTY3NjI"}, function(data, status, xhr){
		alert("data:" + data + "\n status:" + status + "\n xhr:" + xhr);
	});
}
*/
function consoleMessage(message)
{
	try
	{
		var obj = JSON.parse(message.payloadString);
		$("#clientId").text(obj.vehicleInfo[1]);
		$("#choosenId").text("No."+obj.vehicleInfo[1]);
		// battery change
		
		var iconSrc;
		var battery = obj.baseState[1];
		var percent = battery / 100 * 74;
		if(battery > 80)
		{
			iconSrc = "img/icon/battery90.png";
		}
		else if(battery > 60)
		{
			iconSrc = "img/icon/battery70.png";
		}
		else if(battery > 40)
		{
			iconSrc = "img/icon/battery50.png";
		}
		else if(battery > 20)
		{
			iconSrc = "img/icon/battery30.png";
		}
		else if(battery > 10)
		{
			iconSrc = "img/icon/battery15.png";
		}
		else if(battery > 0)
		{
			iconSrc = "img/icon/battery5.png";
		}
		else
		{
			iconSrc = "img/icon/battery0.png";
			percent = 20;
		}
		
		document.getElementById("batteryIconInner").src = iconSrc;
		$("#batteryIconInner").animate({
			height:percent.toString()
		});
		$("#battery").text(obj.baseState[1] + "%");
		
		// connection state change
		
		var connectionState = obj.baseState[2];
		var connectionSrc;
		var str;
		if(connectionState > 0.7)
		{
			connectionSrc = "img/icon/connectionGood.png";
			str = "佳";
		}
		else if(connectionState > 0.4)
		{
			connectionSrc = "img/icon/connectionCommon.png";
			str = "中";
		}
		else if(connectionState > 0)
		{
			connectionSrc = "img/icon/connectionBad.png";
			str = "差";
		}
		else
		{ 
			connectionSrc = "img/icon/connectionLost.png";
			str = "无";
		}						
		document.getElementById("connectionIcon").src = connectionSrc;
		$("#connectionState").text(str);
		
		$("#speed").text(obj.vehicleInfo[6] + " km/h, " +
		 	obj.vehicleInfo[7] + " rad/s");

		var poseInfoText = coordinateToText(obj.vehicleInfo[3], obj.vehicleInfo[4]);
		console.log("posetext:", poseInfoText);
		$("#poseInfoLongitude").text(poseInfoText[0]);
		$("#poseInfoLatitude").text(poseInfoText[1]);
		$("#poseInfoPose").text("Pose " + obj.vehicleInfo[5] + "°");
		if (currentMarker != undefined) {
			currentMarker.setAngle(-obj.vehicleInfo[5]);
		}		

		//$("#warning").text(obj.errorInfo);
		$("#locationInfoImg").attr("src", alertInfoImg(obj.errorInfo[1]));
		$("#lidarInfoImg").attr("src", alertInfoImg(obj.errorInfo[2]));
		$("#MMWRInfoImg").attr("src", alertInfoImg(obj.errorInfo[3]));
		$("#ultrasonicRadarInfoImg").attr("src", alertInfoImg(obj.errorInfo[4]));
		$("#cameraInfoImg").attr("src", alertInfoImg(obj.errorInfo[5]));
		$("#missionInfoImg").attr("src", alertInfoImg(obj.errorInfo[6]));
		$("#controllerInfoImg").attr("src", alertInfoImg(obj.errorInfo[7]));
		
		console.log("test str :", alertInfoImg(obj.errorInfo[1]));
		console.log("baseState :", obj.baseState);
		console.log("vehicleInfo :", obj.vehicleInfo);
		console.log("gridMap :", obj.gridMap);
		console.log("errorInfo :", obj.errorInfo);
		console.log(percent.toString());
		//addMarker([obj.vehicleInfo[2],obj.vehicleInfo[3]]);
	}
	catch(err)
	{
		console.log("consoleMessage error", err );
	}
}

function alertInfoImg(state)
{
	if(state == 0){
		return "img/mission/normal.png";
	}else if (state == 1){
		return "img/mission/unconnected.png";
	}else{
		return "img/mission/error.png";
	}

}

function coordinateToText(longitude, latitude){
	var str1;
	var str2;
	if (longitude > 0){
		str1 = "E " + longitude;
	}else {
		str1 = "W " + (-longitude);
	}

	if (latitude > 0){
		str2 = "N " + latitude;
	}else {
		str2 = "S " + (-latitude);
	}
	return [str1 + "°" , str2 + "°"];

}

function onClickMarker(mapEvent)
{
	var target = mapEvent.target;
	if (currentMarker != undefined){
		currentMarker.setIcon("img/icon/mapMarkerBlue.png"); // first rotate to zero and then change icon set pose 
		currentMarker.setAngle(0);
		currentMarker.setOffset(new AMap.Pixel(-29, -29));
	}
	hideMissionShown();
	currentMarker = target;
	target.setIcon("img/icon/mapMarkerOrange.png"); // first change icon set pose and then rotate
	target.setAngle(0);
	target.setOffset(new AMap.Pixel(-55, -55));
	updateMission();

	try
	{	
		var message = markerMessageList[target._amap_id];
		consoleMessage(message);
	}
	catch(err)
	{
		console.log("clickMessage error", err );
	}
}

function onAddMission(mapEvent){
	var target = mapEvent.lnglat;
	if (currentMarker == undefined){
		console.error("No marker select!");
	}else {
		if (markerMissionList[currentMarker._amap_id] == undefined){
			markerMissionList[currentMarker._amap_id] = [];	
			markerMissionList[currentMarker._amap_id + "marker"] = [];
		}
		markerMissionList[currentMarker._amap_id].push(target);
		addMissionMarker([target.getLng(), target.getLat()]);
		console.log("lnglat:\n"+markerMissionList[currentMarker._amap_id][markerMissionList[currentMarker._amap_id].length - 1]);
		updateMission();
	}
	
}

function clearMission(){
	if (currentMarker != undefined){
		// clear markerId to missionPosition list
		markerMissionList[currentMarker._amap_id] = [];

		// clear missionMarker on map
		for (var i = 0; i < markerMissionList[currentMarker._amap_id + "marker"].length; i++){
			markerMissionList[currentMarker._amap_id + "marker"][i].setMap(null);
		}

		// clear markerId to missionMarker list
		markerMissionList[currentMarker._amap_id + "marker"] = [];	
	}
	// update mission shown page
	updateMission();
}

function sendMission(){
	if (currentMarker != undefined && markerMissionList[currentMarker._amap_id + "marker"] != undefined)
	{
		var message = markerMessageList[currentMarker._amap_id];
		var objMessage = JSON.parse(message.payloadString);
		var missiondata = [];
		for (var i = 0; i < markerMissionList[currentMarker._amap_id + "marker"].length; i++){
			missiondata.push(markerMissionList[currentMarker._amap_id + "marker"][i].getPosition().getLng());
			missiondata.push(markerMissionList[currentMarker._amap_id + "marker"][i].getPosition().getLat());
		}
		var objSend = {
			"missionInfo":
			{
				"missionState":[1,objMessage.vehicleInfo[1],0,roadWidth,markerMissionList[currentMarker._amap_id].length],
				"missionData":missiondata
			}
		};
		mqttX.sendMessage("SunnyCarMachineSub/" + objMessage.vehicleInfo[1], objSend);
		$("#missionPositions").text("您向 "+objMessage.vehicleInfo[1]+" 号车发布的最新任务发送成功！");
	}
	else
	{
		console.error("nothing to publish");
	}
	
}

function updateMission(){
	if (currentMarker != undefined && markerMissionList[currentMarker._amap_id] != undefined){
		var str = "";
		str = "您共选择了："+ markerMissionList[currentMarker._amap_id].length + "个任务点";
		$("#missionPositions").text(str);
	
		// set missionMarker on map
		for (var i = 0; i < markerMissionList[currentMarker._amap_id + "marker"].length; i++){
			markerMissionList[currentMarker._amap_id + "marker"][i].setMap(mapMission);
		}
	
		// update missionLines
		polylineMission.setPath([currentMarker.getPosition()].concat(markerMissionList[currentMarker._amap_id]));
		// mapMission.setFitView([ polylineMission ]);
	}
}

function hideMissionShown(){
	if (currentMarker != undefined && markerMissionList[currentMarker._amap_id + "marker"] != undefined){
		// clear missionMarker on map
		for (var i = 0; i < markerMissionList[currentMarker._amap_id + "marker"].length; i++){
			markerMissionList[currentMarker._amap_id + "marker"][i].setMap(null);
		}
		// clear mission lines
		polylineMission.setPath([]);
	}
}

function onClickSidebar(obj){
	if (currentPage == obj){
		console.log("currentPage:", obj);
		console.log("currentPageId:", obj.id);
	}else
	{
		$(currentPage).hide();
		$(obj).show();
		//console.log("objId:", obj);
		currentPage = obj;

		// change map to show markers
		if (currentPage.id == "monitor")
		{
			mapCurrent = map;
			changeMarkerOnMap(mapCurrent);
		}
		else if (currentPage.id == "mission")
		{
			mapCurrent = mapMission;
			changeMarkerOnMap(mapCurrent);
		}
		else 
		{

		}
	}
}

function changeMarkerOnMap(){
	for (var i = 0; i < markerList.length; i++){
		markerList[i].setMap(mapCurrent);
		textList[i].setMap(mapCurrent);
	}
	if(markerList.length > 0){
		// mapCurrent.setZoomAndCenter(16, markerList[markerList.length - 1].getPosition());
		mapCurrent.setFitView();
		console.log("position:", markerList[markerList.length - 1].getPosition());
	}
}
function sidebarIni(obj){
	for (var i = 1; i < obj.length; i++){
		$(obj[i]).hide();
	}
}

function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }
    return "";
}
