var error_count;

document.oncontextmenu = function() {
    return false;
 }

var name_regex = /[0-9]/;

// validate firstname
function validatefname(){
    var firstname = document.getElementById("fname").value;
 
    var symbol = /[!@#$%^&*()<>?/,.:;+-`~=[{}'"]/;
    var fname_err = document.getElementById("fname_err");
    if (firstname == "") {
        fname_err.innerText = "**First name should not be empty!";
        fname_err.style.color = "red";
        error_count++;
    } 
    else if(name_regex.test(firstname) == true){
        fname_err.innerText = "**First name should not contain number!";
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
    var symbol = /[!@#$%^&*()<>?,.:;+-`~=]/;
    var lname_err = document.getElementById("lname_err");

    if (lastname == "") {
        lname_err.innerText = "**Last name should not be empty!";
        lname_err.style.color = "red";
        error_count++;
    } 
    else if(name_regex.test(lastname) == true){
        lname_err.innerText = "**Last name should not contain number!";
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
    if(email==""){
        email_err.style.color = "red";
        email_err.innerText = "**Email should not be empty!";
        error_count++;
    }
    else if (!email.match(mailformat)) {
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

    if(number==""){
        number_err.style.color = "red";
        number_err.innerText = "**Contact number should not be empty";
        error_count++;
    }

else if (!number.match(number_regex)) {
    number_err.style.color = "red";
    number_err.innerText = "**Contact number should be of 10 digits only!";
    error_count++;
}
else {
    number_err.innerText = "";
}
}


function validatebirthdate(){

    var birthdate = document.getElementById("dob").value;
    var dob = new Date(birthdate);  
    var month_diff = Date.now() - dob.getTime();  
  
    var age_dt = new Date(month_diff);  
  
    var year = age_dt.getUTCFullYear(); 
   
    var age = Math.abs(year - 1970);  
  
    var date_err = document.getElementById("date_err");
    // let currentDate = new Date().toJSON().slice(0, 10);
   
    if (age<15) {
    date_err.style.color = "red";
    date_err.innerText = "**Age should be greater than 15 years!";
    error_count++;
    } 
    else if(birthdate == ""){
        date_err.style.color = "red";
        date_err.innerText = "**Birthdate should not be empty!";
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
        city_err.innerText = "**City name should not be empty!";
        error_count++;
    }
    else if (name_regex.test(city) == true){
        city_err.style.color = "red";
        city_err.innerText = "**City name should not contain number!";
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
        college_err.innerText = "**College name should not be empty";
        error_count++;
    } 
    else if (name_regex.test(college) == true){
        college_err.style.color = "red";
        college_err.innerText = "**College name should not contain number!";
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
        qualification_err.innerText = "**Qualification field should not be empty!";
        error_count++;
    }
    else if (name_regex.test(qualification) == true){
        qualification_err.style.color = "red";
        qualification_err.innerText = "**Qualification should not contain number!";
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
    if(password==""){
        pass_err.style.color = "red";
        pass_err.innerText="**Password should not be empty";
        error_count++;
    }
    
    else if(!password.match(paswd)){
        pass_err.style.color = "red";
        pass_err.innerText="**Password should contain atleast 1 Uppercase , 1 Lowercase , 1 digit , 1 special character and should be of minimun 8 length!";
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
    if(confirmpassword=="")
    {
        confirmpass_err.style.color="red";
        confirmpass_err.innerText="**Confirm password should not be empty!"
        error_count++;
    }
    else if(confirmpassword != password){
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
    if (enrollment== "") {
        enrollment_err.style.color = "red";
        enrollment_err.innerText = "**Enrollment Number should not be empty!";
        error_count++;
    } 
    else if (enrollment.length!=12){
        
        enrollment_err.style.color = "red";
        enrollment_err.innerText = "**Enrollment Number should be of 12 digits!";
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
    if(access_code==""){
        accesscode_err.style.color = "red";
        accesscode_err.innerText = "**Access Code should not be empty!";
        error_count++;
    }
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

    // console.log(error_count);
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
        const ans = await fetch(`/verify`);
        const data = await ans.json();
        console.log(email.value);

        if(data.includes(email.value)){
            email_err.innerText="Email id already exists!!";
            email_err.style.color="red";
        }
        else{
            email_err.innerText="";
        }


    })
}


// validate email at login page

function validateforgotemail(){
    var email = document.getElementById("email");
    var submit = document.getElementById("submit");
    var email_err = document.getElementById("email_err");

    email.addEventListener("change",async function(){
        const ans = await fetch(`/verify`);
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

