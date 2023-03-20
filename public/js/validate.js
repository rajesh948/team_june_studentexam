var error_count;

// validate firstname
function validatefname(){
    var firstname = document.getElementById("fname").value;
    var name_regex = /[0-9]/;
    var fname_err = document.getElementById("fname_err");
    if (name_regex.test(firstname) == true || firstname == "") {
        fname_err.innerText = "**Please enter valid first name!";
        fname_err.style.color = "red";
        error_count++;
    } 
    else {
        fname_err.innerText = "";
    }
}

// validate lastname
function validatelname(){
    var lastname = document.getElementById("lname").value;
    var name_regex = /[0-9]/;
    var lname_err = document.getElementById("lname_err");

    if (lastname == "" || name_regex.test(lastname) == true) {
        lname_err.innerText = "**Please enter valid last name!";
        lname_err.style.color = "red";
        error_count++;
    } 
    else {
        lname_err.innerText = "";
    }
}


// validate client side email
function validateEmailuser(){

    var email = document.getElementById("email").value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var email_err = document.getElementById("email_err");
    if (!email.match(mailformat)) {
        email_err.style.color = "red";
        email_err.innerText = "**Please enter valid email";
        error_count++;
    } 
    else {
        email_err.innerText = "";
    }
        
}


// validate mobile number
function validatenumber(){
    var number = document.getElementById("number").value;
    var number_regex = /^\d{10}$/;
    var number_err = document.getElementById("number_err");


if (!number.match(number_regex)) {
    number_err.style.color = "red";
    number_err.innerText = "**Please enter valid contact number";
    error_count++;
}
else {
    number_err.innerText = "";
}
}


function validatebirthdate(){

    var birthdate = document.getElementById("dob").value;
    var date_err = document.getElementById("date_err");
    let currentDate = new Date().toJSON().slice(0, 10);

    if (currentDate < birthdate || birthdate == "") {
    date_err.style.color = "red";
    date_err.innerText = "**Please enter valid date of birth";
    error_count++;
    } 
    else {
    date_err.innerText = "";
    }

}


// validate city
function validatecity(){

    var city = document.getElementById("city").value;
    var city_err = document.getElementById("city_err");
    if (city == "") {
        city_err.style.color = "red";
        city_err.innerText = "**Please enter city name";
        error_count++;
    }
    else {
        city_err.innerText = "";
    }
}


// validate college
function validatecollege(){
    var college = document.getElementById("college").value;
    var college_err = document.getElementById("college_err");
    if (college == "") {
        college_err.style.color = "red";
        college_err.innerText = "**Please enter valid College Name";
        error_count++;
    } 
    else {
        college_err.innerText = "";
    }
        
}

// validate qualification
function validatequalification(){
    var qualification = document.getElementById("qualification").value;
    var qualification_err = document.getElementById("qualification_err");
    if (qualification == "") {
        qualification_err.style.color = "red";
        qualification_err.innerText = "**Please enter valid qualification";
        error_count++;
    }
    else {
        qualification_err.innerText = "";
    }
        
}

// validate gender
function validategender(){

    var gender_err = document.getElementById('gender_err');
    if(document.querySelector('input[name="gender"]:checked')==null){
        gender_err.style.color="red";
        gender_err.innerText="**Please select your gender";
        error_count++;
    }
    else{
        gender_err.innerText="";
    }
}


// validate password
function validatepassword(){
    var password = document.getElementById('password').value;
    var paswd=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    var pass_err = document.getElementById("pass_err");

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
    
}

// validate confirm password
function validateconfirmpassword(){
    var password = document.getElementById('password').value;
    var confirmpassword = document.getElementById('confirmPassword').value;
    var confirmpass_err = document.getElementById("confirmPass_err");
    if(confirmpassword != password || confirmpassword=="")
    {
        confirmpass_err.style.color="red";
        confirmpass_err.innerText="**Password and confirm password didn't match!"
        error_count++;
    }
    else
    {
        confirmpass_err.innerText="";
    }
}


// validate enrollment

function validateenrollment(){
    var enrollment = document.getElementById("enrollment").value;
    var enrollment_err = document.getElementById("enrollment_err");
    if (enrollment.length != 12) {
        enrollment_err.style.color = "red";
        enrollment_err.innerText = "**Please enter valid Enrollment Number";
        error_count++;
    } 
    else 
    {
        enrollment_err.innerText = "";
    }
}


// validate accesscode
function validateaccesscode(){
    var access_code = document.getElementById("Accesscode").value;
    var accesscode_err = document.getElementById("accesscode_err");
    if (access_code.length != 6) {
        accesscode_err.style.color = "red";
        accesscode_err.innerText = "**Please enter valid Access Code";
        error_count++;
    }
    else {
        accesscode_err.innerText = "";
    }
}

function validateForm(){

    error_count = 0;

    validatefname();
    validateEmailuser();
    validatelname();
    validatenumber();
    validatecollege();
    validategender();
    validatebirthdate();
    validateenrollment();
    validatequalification();
    validatecity();
    validatepassword();
    validateconfirmpassword();

    console.log(error_count);
    if (error_count == 0) 
        {
            return true;
        } 
        else 
        {
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


// validate email at login page

function validateLoginEmail(){
    var email = document.getElementById("email");
    var submit = document.getElementById("submit");
    var email_err = document.getElementById("email_err");

    email.addEventListener("change",async function(){
        const ans = await fetch(`http://localhost:8081/verify`);
        const data = await ans.json();
        console.log(email.value);

        if(!data.includes(email.value)){
            email_err.innerText="Email id doesn't exists!!";
            email_err.style.color="red";
        }
        else{
            email_err.innerText="";
            submit.disabled = false;
        }


    })
}


function validateforgotpass(){
    error_count = 0;
    validatepassword();
    validateEmailuser();
    validateconfirmpassword();
    if (error_count == 0) 
    {
        return true;
    } 
    else 
    {
        return false;
    }
}


// validate accesscode form

function validateAccessCodeForm(){

    error_count = 0;
    validatefname();
    validatelname();
    validateEmailuser();
    validatenumber();
    validatebirthdate();
    validatecity();
    validatequalification();
    validatecollege();
    validateaccesscode();
    validateenrollment();

    if (error_count == 0) 
    {
        return true;
    } 
    else 
    {
        return false;
    }
}