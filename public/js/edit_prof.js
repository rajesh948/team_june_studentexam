let error_count = 0;

// Regex :-----------------
var letters = /^[a-zA-Z\s]*$/;
var enroll_regex = /^[0-9]*$/;
var num_regex = /[0-9]+/;
var qual_regex = /^[a-zA-Z\s.]*$/;
var number_regex = /^\d{10}$/;
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

// First-Name & Last-Name validation :-------------------------------------------------------------------
function namevalidation(x, y) {
  if (y == "fname") {
    var firstname = x.value;

    var fname_err = document.getElementById("fname_err");

    if (firstname == "") {
      fname_err.innerText = "**First-name is empty!";
      fname_err.style.color = "red";
      error_count++;
    } else {
      if (firstname.match(num_regex)) {
        fname_err.innerText = "**First-name contains numbers!";
        fname_err.style.color = "red";
        error_count++;
      } else {
        if (firstname.match(letters)) {
          fname_err.innerText = "";
        } else {
          fname_err.innerText = "**First-name contains special characters!";
          fname_err.style.color = "red";
          error_count++;
        }
      }
    }
  }
  if (y == "lname") {
    var lastname = x.value;

    var lname_err = document.getElementById("lname_err");

    if (lastname == "") {
      lname_err.innerText = "**Last-name is empty!";
      lname_err.style.color = "red";
      error_count++;
    } else {
      if (lastname.match(num_regex)) {
        lname_err.innerText = "**Last-name contains numbers!";
        lname_err.style.color = "red";
        error_count++;
      } else {
        if (lastname.match(letters)) {
          lname_err.innerText = "";
        } else {
          lname_err.innerText = "**Last-name contains special characters!";
          lname_err.style.color = "red";
          error_count++;
        }
      }
    }
  }
  return false;
}

// Number validation :--------------------------------------------------------------------------------------
function numbervalidation(x) {
  var number = x.value;
  var number_err = document.getElementById("number_err");

  if (number == "") {
    number_err.style.color = "red";
    number_err.innerText = "**Contact number is empty..!";
    error_count++;
  } else if (!number.match(number_regex)) {
    number_err.style.color = "red";
    number_err.innerText = "**Please enter valid contact number";
    error_count++;
  } else {
    number_err.innerText = "";
  }
}

// Validate unique email :---------------------------------------------------------------------------------

async function emailexist(x, y, z) {
  var email = x.value;

  const golbalemail = z;

  if (y == "edit") {
    var email_err = document.getElementById("email_err");

    if (email == "") {
      email_err.style.color = "red";
      email_err.innerText = "**Email is empty..!";
      error_count++;
    } else if (!email.match(mailformat)) {
      email_err.style.color = "red";
      email_err.innerText = "**Please enter valid email";
      error_count++;
    } else {
      const ans = await fetch(`/verify`);
      const data = await ans.json();
      console.log(email);

      if (email == golbalemail) {
        email_err.innerText = "";
      } else {
        if (data.includes(email)) {
          email_err.innerText = "Email id already exists!!";
          email_err.style.color = "red";
        } else {
          email_err.innerText = "";
        }
      }
    }
  }
  return false;
}

// College validation :------------------------------------------------------------------------------------
function collegevalidate(x) {
  var college = x.value;

  var college_err = document.getElementById("college_err");

  if (college == "") {
    college_err.style.color = "red";
    college_err.innerText = "**Please enter college name";
    error_count++;
  } else {
    if (college.match(letters)) {
      college_err.innerText = "";
    } else if (college.match(num_regex)) {
      college_err.innerText = "**College name contains numbers!";
      college_err.style.color = "red";
      error_count++;
    } else {
      college_err.innerText = "*College name contains special characters!";
      college_err.style.color = "red";
      error_count++;
    }
  }
  return false;
}

// Birth-Date validation :---------------------------------------------------------------------------------
function datevalidate(x) {
  var birthdate = x.value;
  var date_err = document.getElementById("date_err");

  let currentDate = new Date().toJSON().slice(0, 10);

  if (currentDate <= birthdate || birthdate == "") {
    date_err.style.color = "red";
    date_err.innerText = "**Please enter valid date of birth";
    error_count++;
  } else {
    date_err.innerText = "";
  }
}

// Enrollment no. validation :------------------------------------------------------------------------------
function enrollvalidate(x) {
  var enrollment = x.value;
  var enrollment_err = document.getElementById("enrollment_err");

  if (enrollment == "") {
    enrollment_err.style.color = "red";
    enrollment_err.innerText = "**Please enter enrollment number";
    error_count++;
  } else {
    if (enrollment.match(enroll_regex)) {
      if (enrollment.length < 12) {
        enrollment_err.style.color = "red";
        enrollment_err.innerText = "**Please enter valid Enrollment Number";
        error_count++;
      } else {
        enrollment_err.innerText = "";
      }
    } else {
      enrollment_err.innerText =
        "*Enrollment number contains other characters!";
      enrollment_err.style.color = "red";
      error_count++;
    }
  }
}

// Qualification validation :-------------------------------------------------------------------------------
function qualivalidate(x) {
  var qualification = x.value;
  var qualification_err = document.getElementById("qualification_err");

  if (qualification == "") {
    qualification_err.style.color = "red";
    qualification_err.innerText = "**Please enter qualification";
    error_count++;
  } else {
    if (qualification.match(num_regex)) {
      qualification_err.innerText = "**Qualification contains numbers!";
      qualification_err.style.color = "red";
      error_count++;
    } else {
      if (qualification.match(qual_regex)) {
        qualification_err.innerText = "";
      } else {
        qualification_err.innerText =
          "*Qualification contains other characters!";
        qualification_err.style.color = "red";
        error_count++;
      }
    }
  }
}

// City validation :----------------------------------------------------------------------------------------
function cityvalidate(x) {
  var city = x.value;
  var city_err = document.getElementById("city_err");

  if (city == "") {
    city_err.style.color = "red";
    city_err.innerText = "**Please enter city name";
    error_count++;
  } else {
    if (city.match(letters)) {
      city_err.innerText = "";
    } else if (city.match(num_regex)) {
      city_err.innerText = "**City name contains numbers!";
      city_err.style.color = "red";
      error_count++;
    } else {
      city_err.innerText = "*City name contains special characters!";
      city_err.style.color = "red";
      error_count++;
    }
  }
}

// Gender validation :--------------------------------------------------------------------------------------
function checkgen() {
  var gender_err = document.getElementById("gender_err");

  if (document.querySelector('input[name="gender"]:checked') == null) {
    gender_err.style.color = "red";
    gender_err.innerText = "**Gender is empty..!";
  } else {
    gender_err.innerText = "";
  }
}

// Password validation :------------------------------------------------------------------------------------
function passvalidate(x) {
  var pass_err = document.getElementById("pass_err");

  var password = x.value;
  if (!password.match(paswd)) {
    pass_err.style.color = "red";
    pass_err.innerText = "**Please enter valid password";
    error_count++;
  } else {
    pass_err.innerText = "";
  }
}

function cpassvalidate(x) {
  var password = document.getElementById("password").value;
  var confirmpass_err = document.getElementById("confirmPass_err");

  var confirmpassword = x.value;
  if (confirmpassword != password || confirmpassword == "") {
    confirmpass_err.style.color = "red";
    confirmpass_err.innerText = "Password and confirm password didn't match!";
    error_count++;
  } else {
    confirmpass_err.innerText = "";
  }
}

// Updating user data :----------------------------------------------------------------------------------------

async function validateForm() {
  let fname = document.getElementById("fname").value;
  let lname = document.getElementById("lname").value;
  let gen;

  if (document.getElementById("inlineRadio1").checked == true) {
    gen = document.getElementById("inlineRadio1").value;
  }
  if (document.getElementById("inlineRadio2").checked == true) {
    gen = document.getElementById("inlineRadio2").value;
  }

  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let enroll = document.getElementById("enroll").value;

  let qualification = document.getElementById("qualification").value;
  let city = document.getElementById("city").value;
  let college = document.getElementById("college").value;
  let dob = document.getElementById("dob").value;

  var fname_err = document.getElementById("fname_err");
  var lname_err = document.getElementById("lname_err");
  var email_err = document.getElementById("email_err");
  var number_err = document.getElementById("number_err");
  var date_err = document.getElementById("date_err");
  var city_err = document.getElementById("city_err");
  var qualification_err = document.getElementById("qualification_err");
  var college_err = document.getElementById("college_err");
  var enrollment_err = document.getElementById("enrollment_err");
  var gender_err = document.getElementById("gender_err");

  if (
    gen != "" &&
    fname != "" &&
    lname != "" &&
    email != "" &&
    dob != "" &&
    city != "" &&
    phone != "" &&
    college != "" &&
    qualification != "" &&
    enroll != ""
  ) {
    if (
      fname_err.innerText == "" &&
      lname_err.innerText == "" &&
      email_err.innerText == "" &&
      date_err.innerText == "" &&
      city_err.innerText == "" &&
      number_err.innerText == "" &&
      college_err.innerText == "" &&
      qualification_err.innerText == "" &&
      enrollment_err.innerText == "" &&
      gender_err.innerText == ""
    ) {
      let newdata = {};
      newdata["fname"] = fname;
      newdata["lname"] = lname;
      newdata["gender"] = gen;
      newdata["email"] = email;
      newdata["phone"] = phone;
      newdata["enroll"] = enroll;
      newdata["qualification"] = qualification;
      newdata["city"] = city;
      newdata["college"] = college;
      newdata["dob"] = dob;

      console.log(newdata);

      const url = await fetch(
        "/updatedata?newdata=" + JSON.stringify(newdata) + ""
      );

      alert("added successfully :)");
      location.reload();

      return true;
    } else {
      return false;
    }
  } else {
    if (fname == "") {
      fname_err.innerText = "**First-name is empty!";
      fname_err.style.color = "red";
    }
    if (lname == "") {
      lname_err.innerText = "**Last-name is empty!";
      lname_err.style.color = "red";
    }
    if (phone == "") {
      number_err.style.color = "red";
      number_err.innerText = "**Contact number is empty..!";
    }
    if (email == "") {
      email_err.style.color = "red";
      email_err.innerText = "**Email is empty..!";
    }
    if (college == "") {
      college_err.style.color = "red";
      college_err.innerText = "**College name is empty..!";
    }
    if (dob == "") {
      date_err.style.color = "red";
      date_err.innerText = "**Date of birth is empty..!";
    }
    if (enroll == "") {
      enrollment_err.style.color = "red";
      enrollment_err.innerText = "**Enrollment number is empty..!";
    }
    if (qualification == "") {
      qualification_err.style.color = "red";
      qualification_err.innerText = "**Qualification is empty..!";
    }
    if (city == "") {
      city_err.style.color = "red";
      city_err.innerText = "**City name is empty..!";
    }
    if (gen == "") {
      gender_err.style.color = "red";
      gender_err.innerText = "**Gender is empty..!";
    }
    return false;
  }
}
