const { log } = require('util');
const con = require('../db');

//Set exam_id & exam_name ----------------------------------------------------------------

exam_term = async (req, res) => {
  let examid = req.query.exam_id;
  let examname = req.query.exam_name;
  req.session.exam_id = examid;
  req.session.exam_name = examname;

  if (req.session.user_id) {
    res.redirect("/exam-verification");
  } else {
    res.redirect("/login");
  }
}

// Render term_condition and acess_code verification page----------------------------------

exam_verification = async (req, res) => {
  if (req.session.user_id && req.session.exam_id) {
    let username = req.session.username;
    let examname = req.session.exam_name;
    res.render('term_condition', { examname, username, a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: '', lname: '', email: '', mobilenumber: '', dob: '', city: '', qualification: '', college: '', accesscode: '', enrollment: '' });

  } else {
    res.redirect("/login");
  }
}

// Verify term_condition and acess_code verification page----------------------------------

term_validation_api = async (req, res) => {

  let user_email = req.session.email;
  let exam_id = req.session.exam_id;
  let user_id = req.session.user_id;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let contact = req.body.mobilenumber;
  let dob = req.body.dob;
  let city = req.body.city;
  let college = req.body.college;
  let enrollment = req.body.enrollment;
  let qualification = req.body.qualification;
  let acess_code = req.body.accesscode;
  let username = req.session.username;
  let examname = req.session.exam_name;

  let q1 = (`SELECT exam_access_code FROM exam_master WHERE exam_id=${exam_id}`);
  let [a1] = await con.query(q1);

  let q2 = `SELECT * FROM student_master WHERE email='${user_email}'`
  let [a2] = await con.query(q2);

  if (a2[0].fname == fname && a2[0].lname == lname && a2[0].email == email && a2[0].mobile == contact && a2[0].city == city && a2[0].college == college && a2[0].qualification == qualification && a2[0].enrollment == enrollment && a2[0].birthdate == dob && acess_code == a1[0].exam_access_code) {
    res.redirect('/startexam');
  }
  else if (a2[0].fname != fname) {
    res.render('term_condition', {examname,username, a_fname: 'Enter valid fname !!!', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].lname != lname) {
    res.render('term_condition', {examname,username, a_lname: 'Enter valid lname !!!', a_fname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].email != email) {
    res.render('term_condition', {examname,username, a_email: 'Enter valid email!!!', a_fname: '', a_lname: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].mobile != contact) {
    res.render('term_condition', { examname,username,a_mobilenumber: 'Enter valid mobile number!!!', a_fname: '', a_lname: '', a_email: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].city != city) {
    res.render('term_condition', {examname,username, a_city: 'Enter valid city!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].college != college) {
    res.render('term_condition', {examname,username, a_college: 'Enter valid college!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].qualification != qualification) {
    res.render('term_condition', {examname,username, a_qualification: 'Enter valid qualification!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].enrollment != enrollment) {
    res.render('term_condition', {examname,username, a_enrollment: 'Enter valid enrollment!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a2[0].birthdate != dob) {
    res.render('term_condition', {examname,username, a_dob: 'Enter valid dob!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_city: '', a_qualification: '', a_college: '', a_accesscode: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }
  else if (a1[0].accesscode != acess_code) {
    res.render('term_condition', {examname,username, a_accesscode: 'Enter valid access code!!!', a_fname: '', a_lname: '', a_email: '', a_mobilenumber: '', a_dob: '', a_city: '', a_qualification: '', a_college: '', a_enrollment: '', fname: fname, lname: lname, email: email, mobilenumber: contact, dob: dob, city: city, qualification: qualification, college: college, accesscode: acess_code, enrollment: enrollment });
  }

}


module.exports = {exam_term,exam_verification,term_validation_api};