

// document.oncontextmenu = function() {
//     return false;
//  }

//  document.onkeydown=function(){+
//     return false;
//  }

//  document.onkeyup = function(){
//     return false;
//  }
var que_no = 0;


var saffron = [1];
var green = [];
var saveQuestion = [];
var user_que = [];
var user_ans = [];
var allquestion = [];
var total_num = document.getElementById("timerCount").innerHTML;
document.getElementById(`btn1`).style.backgroundColor = "rgb(230, 171, 33)";

getResult();

async function getResult() {

    const data = await fetch("/getResult");
    const question_paper = await data.json();
    // console.log("getResult", question_paper);

    for (let i = 0; i < question_paper.user_que.length; i++) {
        user_que[question_paper.user_que[i] - 1] = question_paper.user_que[i];

        user_ans[question_paper.user_que[i] - 1] = question_paper.user_ans[i];
    }


    //     console.log("green getresult",green);

    // console.log("user_que getresult",user_que);

    // console.log("user_que getresult",user_ans);

    if (user_que.length) {
        green = user_que;
        colors();
        document.getElementById(`btn1`).style.backgroundColor = "rgb(230, 171, 33)";
    }

    // console.log("green getresult",green);

}


///////////////////////////////timer////////////

var minute;

var second;
gettimer();
function gettimer() {    
minute = getCookie("minutes");
 second = getCookie("seconds");
 document.getElementById("timerCount").innerHTML = `Remaining Time: ${minute}:${second}`;
    // console.log("M",minute);
    // console.log("S",second);
    var timer_amount = (60*10); //default
     if (!minute || !second){
        minute = total_num -1;
        // console.log("M"+minute);
        second = 60;  
                  //no cookie found use default
     }
     
 };


var rajeshInterval = setInterval(() => {
    // console.log(minute);    
    document.getElementById("timerCount").innerHTML = `Remaining Time: ${minute}:${second}`;
    setCookie("minutes", minute.toString(), 1);
    setCookie("seconds", second.toString(), 1);
    if (second == 0) {
        minute--;
        second = 60;
    }
    second--;
    if (minute == -1) {

        clearInterval(rajeshInterval);
        submit();
    }

    if(minute<5){
        document.getElementById("timerCount").style.backgroundColor = "red";
    }
}, 1000);


function setCookie(cname, cvalue, exdays) {
   
    var d = new Date();
    d.setTime(d.getTime() + (60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
   } 


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
       var c = ca[i];
       while (c.charAt(0)==' ') c = c.substring(1);
       if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
   } 

   //////////timer//////////////////

displayQue();

async function displayQue(num, text) {

    if (num >= 0) {
        que_no = num;
    }

    const data = await fetch("/getQuestion");
    const question_paper = await data.json();

    // console.log(question_paper);
    // console.log(question_paper.length);
    // var question_no = question_paper.length;
    // var category_nums=[];

    if (text == "inc") {
        que_no += 1;
    }
    if (text == "dec") {
        que_no -= 1;
    }

    if (allquestion = []) {
        for (let i = 0; i < question_paper.length; i++) {
            allquestion = allquestion.concat(question_paper[i].allquestion);
        }
    }

    if (que_no >= allquestion.length - 1) {
        document.getElementById("nextbtn").style.display = "none";
    } else {
        document.getElementById("nextbtn").style.display = "block";
    }
    if (que_no <= 0) {
        document.getElementById("prevbtn").style.display = "none";
    } else {
        document.getElementById("prevbtn").style.display = "block";
    }

    // console.log(allquestion);

    var Quequery = ` <div class="que_body" oncopy="return false">
<p class="question">
${que_no + 1}) ${allquestion[que_no].question}
</p>
<div class="option">`;



    var index = 0;

    for (let i = 0; i < user_que.length; i++) {
        if (user_que[i]) {

            if (allquestion[que_no].question_id == user_que[i]) {
                index = i;
                break;
            }
        }


    }
    // console.log("****************************");
    // console.log("index", index, "que_no", que_no);
    // console.log("allquestion", allquestion);
    // console.log("user_que:", user_que);
    // console.log("user_ans:", user_ans);
    // console.log("****************************");

    for (let j = 0; j < allquestion[que_no].option.length; j++) {


        if (`"${allquestion[que_no].option[j]}"` == user_ans[index]) {


            // console.log("${allquestion[que_no].option[j]}",allquestion[que_no].option[j]);
            // console.log("user_ans[index])",user_ans[index]);

            Quequery += ` <div><input value="${allquestion[que_no].option[j]}" type="radio"  name="que1" checked >

            <p>${allquestion[que_no].option[j]}</p>
        </div>`;
        } else {

            Quequery += ` <div><input value="${allquestion[que_no].option[j]}" type="radio"  name="que1" >

            <p>${allquestion[que_no].option[j]}</p>
        </div>`;
        }


    }

    Quequery += `</div></div>`;

    document.getElementById("questionQue").innerHTML = Quequery;

}



function prev() {
    var getSelectedValue = document.querySelector('input[name="que1"]:checked');


    if (getSelectedValue) {

        user_que[que_no] = (que_no + 1);

// console.log("user_que[que_no]",user_que.length);

        user_ans[que_no] = `"${getSelectedValue.value}"`;
        saveQuestion[que_no] = {
            question_id: que_no + 1,
            user_answer: `${getSelectedValue.value}`
        };
        // console.log("#############################3");
        // console.log("que_no", que_no);
        // console.log("savedatauser_que:", user_que);
        // console.log("savedatauser_ans:", user_ans);
        // console.log("#############################3");
        fetch("/saveUserResult", {
            method: "POST",
            body: JSON.stringify({

                user_que: user_que,
                user_ans: user_ans
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                // console.log("inserted");
            });

        green.push(que_no + 1);
        colors();

        // console.log(saveQuestion)
    }
    saffron.push(que_no);
    // console.log("prev saffron no",saffron);
    // console.log("prev que_no :",que_no)
    displayQue(-1, "dec");
    colors();
    document.getElementById(`btn${que_no}`).style.backgroundColor = "rgb(230, 171, 33)";
}


function next() {

    var getSelectedValue = document.querySelector('input[name="que1"]:checked');


    if (getSelectedValue) {

        user_que[que_no] = (que_no + 1);

// console.log("user_que[que_no]",user_que.length);

        user_ans[que_no] = `"${getSelectedValue.value}"`;
        saveQuestion[que_no] = {
            question_id: que_no + 1,
            user_answer: `${getSelectedValue.value}`
        };
        // console.log("#############################3");
        // console.log("que_no", que_no);
        // console.log("savedatauser_que:", user_que);
        // console.log("savedatauser_ans:", user_ans);
        // console.log("#############################3");
        fetch("/saveUserResult", {
            method: "POST",
            body: JSON.stringify({

                user_que: user_que,
                user_ans: user_ans
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                console.log("inserted");
            });

        green.push(que_no + 1);
        colors();

        // console.log(saveQuestion)
    }
    saffron.push(que_no + 2);
    // console.log("next que_no :",que_no+2)
    // console.log("next saffron nooo:",saffron);
    displayQue(-1, "inc");
    colors();
    document.getElementById(`btn${que_no + 2}`).style.backgroundColor = "rgb(230, 171, 33)";
}

function showQue(num) {
    // console.log("num2::::::::::::::::", saffron);
    saffron.push(parseInt(num));
    colors();
    document.getElementById(`btn${num}`).style.backgroundColor = "rgb(230, 171, 33)";
    // console.log("ShowQue ::::::",num);
    displayQue(num - 1, "abc");

}


async function getcategoryQue(id) {


    const data = await fetch(`/getCategory?cat_id=${id}`);
    const category = await data.json();
    saffron.push(parseInt(category.category_no));
    colors();
    
    document.getElementById(`btn${category.category_no}`).style.backgroundColor = "rgb(230, 171, 33)";
    
    // document.getElementById(`${id}`).style.backgroundColor="blue";
    displayQue(category.category_no - 1, "abc");
}






function colors() {
    saffron.forEach(id => {
        document.getElementById(`btn${id}`).style.backgroundColor = "white";
    })

    green.forEach(id => {
        document.getElementById(`btn${id}`).style.backgroundColor = "rgb(56, 233, 56)";
    })
}




function submit() {

    window.location.replace("/result");
}