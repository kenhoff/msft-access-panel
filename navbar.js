function navtoggle(){
    $("this").toggle();
}


$(document).ready(function(){
    $("#notifications").click(function(){
        $("#sidebar-wrapper").toggle();
    });
});