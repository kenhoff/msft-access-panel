$(document).ready(function addRow() {
    var headerRow = "<tr><th>Threat</th><th>Location</th><th>Time Accessed</th><th>IP Address</th></tr>";
    $("#report tr:first").after(headerRow);
    
    $.each(signIns, function(index, login){
        var myRow = "<tr><td>1</td><td>lat: " + (login.latitude).toFixed(4) + " <br>long: ";
        myRow += (login.longitude).toFixed(4) + "</td><td>" + (Date(login.datetime)).toString() +  "</td><td>" + login.ipAddress + "</td></tr>";
        var myHiddenRow = '<tr><td colspan="4">Device Info: ' + login.userAgent + '<br>Application: ';
        myHiddenRow += login.application.displayName + '</td>';
        $("#report tr:last").after(myRow);
        $("#report tr:last").after(myHiddenRow);
    });
});

$(document).ready(function(){
    $("#report tr:odd").addClass("odd");
    $("#report tr:not(.odd)").hide();
    $("#report tr:first-child").show();
    
    $("#report tr.odd").click(function(){
        $(this).next("tr").toggle();
    });
});

