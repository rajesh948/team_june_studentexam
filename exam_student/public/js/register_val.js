function validateForm() {

    var a = document.getElementById("fname").value;
    console.log(a);
    var b = document.getElementById("lname").value;
    var c = document.getElementById("email").value;
    var d = document.getElementById("mobile").value;
    var e = document.getElementById("inlineRadio1").value;
    var f = document.getElementById("inlineRadio2").value;
    var g = document.getElementById("selec").value;
    var h = document.getElementById("enroll").value;
    var i = document.getElementById("qualification").value;
    var j = document.getElementById("city").value;
    var k = document.getElementById("password").value;
    var l = document.getElementById("confirm_pass").value;



    if ((a == null || a == "") && (b == null || b == "") && (c == null || c == "") && (d == null || d == "") && (e == null || e == "") && (f == null || f == "") && (g == null || g == "") && (h == null || h == "") && (i == null || i == "") && (j == null || j == "") && (k == null || k == "") && (l == null || l == "")) {
        alert("Please Fill In All Required Fields");
        return false;
    }
}


