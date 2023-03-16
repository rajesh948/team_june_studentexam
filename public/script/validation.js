
// Validations for all ----------------------------------------------------------------

function validate(){
    if(pflag == 1 && n1flag == 1 && n2flag && cpflag == 1){
     return true
    }
    else{
     return false
    }
 }




//Name validation ---------------------------------------------------------------
let n1flag = 0;
function name1Val(){
    let number = /[0-9]/;
    let name1 = document.getElementById('n_id1').value;
    let name_span1 = document.getElementById('name-span1');
    if(name1 == ''){
        name_span1.innerHTML=' ';
        name_span1.innerHTML='Please enter name !!!'
        n1flag=0;
    }
    else if(name1.match(number)){
        name_span1.innerHTML=' ';
        name_span1.innerHTML='Number not allowed !!!'
        n1flag = 0;
    }
    else{
        name_span1.innerHTML=' ';
        n1flag=1;
    }
}

let n2flag = 0;
function name2Val(){
    let name2 = document.getElementById('n_id2').value;
    let name_span2 = document.getElementById('name-span2');
    let number = /[0-9]/;
    if(name2 == ''){
        name_span2.innerHTML=' ';
        name_span2.innerHTML='Please enter name !!!'
        n2flag=0;
    }
    else if(name2.match(number)){
        name_span2.innerHTML=' ';
        name_span2.innerHTML='Number not allowed !!!'
        n2flag = 0;
    }
    else{
        name_span2.innerHTML=' ';
        n2flag=1;
    }
}
//Contact Validation ----------------------------------------------------------------

let con_flag = 0;
function conVal(){
    let con = document.getElementById('con_id').value;
    let con_span = document.getElementById('con_span');

    if(con == ''){
        con_span.innerHTML=' ';
        con_span.innerHTML='Please enter contact number !!!'
        con_flag=0;
    }
    else if(isNaN(con)){
        con_span.innerHTML=' ';
        con_span.innerHTML='Only digit valid !!!'
        con_flag=0;
    }
    else{
        con_span.innerHTML=' ';
        con_flag=1;
    }
}
//Enrolment Validation ----------------------------------------------------------------

let enrol_flag = 0;
function enrolVal(){
    let enrol = document.getElementById('enrol_id').value;
    let enrol_span = document.getElementById('enrol_span');

    if(enrol == ''){
        enrol_span.innerHTML=' ';
        enrol_span.innerHTML='Please enter enrolment number !!!'
        enrol_flag=0;
    }
    else if(isNaN(enrol)){
        enrol_span.innerHTML=' ';
        enrol_span.innerHTML='Only digit valid !!!'
        enrol_flag=0;
    }
    else{
        enrol_span.innerHTML=' ';
        enrol_flag=1;
    }
}

//Qualification Validation ----------------------------------------------------------------

let qual_flag = 0;
function qualVal(){

    let qual = document.getElementById('qual_id').value;
    let qual_span = document.getElementById('qual_span');
    let number = /[0-9]/;

    if(qual == ''){
        qual_span.innerHTML=' ';
        qual_span.innerHTML='Please enter qualification!!!'
        qual_flag=0;
    }
    else if(qual.match(number)){
        qual_span.innerHTML=' ';
        qual_span.innerHTML='Number is not valid in qualification!!!'
        qual_flag=0;
    }
    else{
        qual_span.innerHTML=' ';
        qual_flag=1;
    }
}

//Password validations ----------------------------------------------------------------

    let pflag = 0;
        function passVal1(){

            let upperCase = /[A-Z]/;
            let lowerCase = /[a-z]/;
            let number = /[0-9]/;
            let pass1 = document.getElementById('pass-1').value;
            let pass2 = document.getElementById('pass-2').value;
            let alert1 = document.getElementById('a-pass1');


            if(pass1 == ''){
                console.log("psss");
                // alert1.innerHTML=' ';
                alert1.innerHTML='Empty password'
                pflag = 0;
            }
            else if(!pass1.match(upperCase)){
                alert1.innerHTML=' ';
                alert1.innerHTML='At least one uppercase alphabet!!!'
                pflag = 0;
            }
            else if(!pass1.match(lowerCase)){
                alert1.innerHTML=' ';
                alert1.innerHTML='At least one lowercase alphabet!!!'
                pflag = 0;
            }
            else if(!pass1.match(number)){
                alert1.innerHTML=' ';
                alert1.innerHTML='At least one number!!!'
                pflag = 0;
            }
            else if(pass1.length < 8){
                alert1.innerHTML=' ';
                alert1.innerHTML='At least 8 character  !!!'
                pflag = 0;
            }
            
            else{
                alert1.innerHTML=' ';
                pflag = 1;
            }
        }
// Confirm Password validation ------------------------------------------------
    let cpflag = 0;
        function passVal2(){
            let pass1 = document.getElementById('pass-1').value;
            let pass2 = document.getElementById('pass-2').value;
            let alert2 = document.getElementById('a-pass2');

            if(pass2 == ''){
                alert2.innerHTML=' ';
                alert2.innerHTML='Empty password'
                cpflag = 0;
            }

            else if(pass1 != pass2){
                alert2.innerHTML=' ';
                alert2.innerHTML='Password is not matched'
                cpflag = 0;
            }
            
            else{
                alert2.innerHTML=' ';
                cpflag = 1;
            }
        }