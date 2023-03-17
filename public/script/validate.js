function validateForm() {
  let error_count = 0;
  var firstname = document.getElementById("fname").value;
  var lastname = document.getElementById("lname").value;
  var email = document.getElementById("email").value;
  var number = document.getElementById("number").value;
  var birthdate = document.getElementById("dob").value;
  var city = document.getElementById("city").value;
  var college = document.getElementById("college").value;
  var qualification = document.getElementById("qualification").value;
  var access_code = document.getElementById("Accesscode").value;
  var enrollment = document.getElementById("enrollment").value;

  var name_regex = /[0-9]/;
  var number_regex = /^\d{10}$/;
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  var fname_err = document.getElementById("fname_err");
  var lname_err = document.getElementById("lname_err");
  var email_err = document.getElementById("email_err");
  var number_err = document.getElementById("number_err");
  var date_err = document.getElementById("date_err");
  var city_err = document.getElementById("city_err");
  var qualification_err = document.getElementById("qualification_err");
  var college_err = document.getElementById("college_err");
  var accesscode_err = document.getElementById("accesscode_err");
  var enrollment_err = document.getElementById("enrollment_err");

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

  // validate Access Code

  if (access_code.length != 6) {
    accesscode_err.style.color = "red";
    accesscode_err.innerText = "**Please enter valid Access Code";
    error_count++;
  } else {
    accesscode_err.innerText = "";
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
