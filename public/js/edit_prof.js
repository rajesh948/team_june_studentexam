async function saveuserdata() {

    // let id = document.getElementById("emp_id").value;

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

    console.log(phone)
    console.log(enroll)

    let qualification = document.getElementById("qualification").value;
    let city = document.getElementById("city").value;
    let college = document.getElementById("college").value;
    let dob = document.getElementById("dob").value;

    console.log(email)

    let newdata = {}
    newdata['fname'] = fname
    newdata['lname'] = lname
    newdata['gender'] = gen
    newdata['email'] = email
    newdata['phone'] = phone
    newdata['enroll'] = enroll
    newdata['qualification'] = qualification
    newdata['city'] = city
    newdata['college'] = college
    newdata['dob'] = dob

    console.log(newdata)




    const url = await fetch('/updatedata?newdata='+JSON.stringify(newdata)+'');


    alert('added successfully :)');
    location.reload();

}
