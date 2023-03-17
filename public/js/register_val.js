function validateForm(){
let error_count = 0;
var firstname = document.getElementById("fname").value;
var lastname = document.getElementById("lname").value;
var email = document.getElementById("email").value;
var number = document.getElementById("number").value;
var birthdate = document.getElementById("dob").value;
var city = document.getElementById("city").value;
var college = document.getElementById("college").value;
var qualification = document.getElementById("qualification").value;
// var gender = document.getElementById("gender").value;
// console.log(gender);
var password = document.getElementById('password').value;
var confirmpassword = document.getElementById('confirmPassword').value;
var enrollment = document.getElementById("enrollment").value;


var name_regex = /[0-9]/;
var number_regex = /^\d{10}$/;
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var paswd=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

var fname_err = document.getElementById("fname_err");
var lname_err = document.getElementById("lname_err");
var email_err = document.getElementById("email_err");
var number_err = document.getElementById("number_err");
var date_err = document.getElementById("date_err");
var city_err = document.getElementById("city_err");
var qualification_err = document.getElementById("qualification_err");
var college_err = document.getElementById("college_err");
var pass_err = document.getElementById("pass_err");
var confirmpass_err = document.getElementById("confirmPass_err");
var enrollment_err = document.getElementById("enrollment_err");
var gender_err = document.getElementById('gender_err');

// validate firstname

if (name_regex.test(firstname) == true || firstname == "") {
fname_err.innerText = "**Please enter valid first name!";
fname_err.style.color = "red";
error_count++;
} else {
fname_err.innerText = "";
}

// validate lastname

if (lastname == "" || name_regex.test(lastname) == true) {
lname_err.innerText = "**Please enter valid last name!";
lname_err.style.color = "red";
error_count++;
} else {
lname_err.innerText = "";
}

// validate email

if (!email.match(mailformat)) {
email_err.style.color = "red";
email_err.innerText = "**Please enter valid email";
error_count++;
} else {
email_err.innerText = "";
}

// validate number

if (!number.match(number_regex)) {
number_err.style.color = "red";
number_err.innerText = "**Please enter valid contact number";
error_count++;
} else {
number_err.innerText = "";
}

// validate birthdate

let currentDate = new Date().toJSON().slice(0, 10);

if (currentDate < birthdate || birthdate == "") {
date_err.style.color = "red";
date_err.innerText = "**Please enter valid date of birth";
error_count++;
} else {
date_err.innerText = "";
}

// validate city

if (city == "") {
city_err.style.color = "red";
city_err.innerText = "**Please enter city name";
error_count++;
} else {
city_err.innerText = "";
}

// validate qualification

if (qualification == "") {
qualification_err.style.color = "red";
qualification_err.innerText = "**Please enter valid qualification";
error_count++;
} else {
qualification_err.innerText = "";
}

// validate college

if (college == "") {
college_err.style.color = "red";
college_err.innerText = "**Please enter valid College Name";
error_count++;
} else {
college_err.innerText = "";
}

//validate password 
if(!password.match(paswd)){
    pass_err.style.color = "red";
    pass_err.innerText="**Please enter valid password";
    error_count++;
    // return false;
}

else{
    pass_err.innerText = "";
    // return true;
}

// validate Confirm Password
console.log(confirmpassword);
console.log(password);
if(confirmpassword != password || confirmpassword=="")
{
    confirmpass_err.style.color="red";
    confirmpass_err.innerText="Password and confirm password didn't match!"
    error_count++;
}
else
{
    confirmpass_err.innerText="";
}

if(document.querySelector('input[name="gender"]:checked')==null){
    gender_err.style.color="red";
    gender_err.innerText="**Please select your gender";
    error_count++;
}
else{
    gender_err.innerText="";
}
// validate enrollment number

if (enrollment.length != 12) {
enrollment_err.style.color = "red";
enrollment_err.innerText = "**Please enter valid Enrollment Number";
error_count++;
} else {
enrollment_err.innerText = "";
}
console.log(error_count);
if (error_count == 0) {
return true;
} else {
return false;
}
}

// validate unique email

function validateEmail(){
    var email = document.getElementById("email");
    var submit = document.getElementById("submit");
    var email_err = document.getElementById("email_err");

    email.addEventListener("change",async function(){
        const ans = await fetch(`http://localhost:8081/verify`);
        const data = await ans.json();
        console.log(email.value);

        if(data.includes(email.value)){
            email_err.innerText="Email id already exists!!";
            email_err.style.color="red";
        }
        else{
            email_err.innerText="";
            submit.disabled = false;
        }


    })
}
