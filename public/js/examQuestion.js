document.oncontextmenu = function() {
    return false;
 }

 document.onkeydown=function(){
    return false;
 }

 document.onkeyup = function(){
    return false;
 }

 document.onkeydown = function (evt) {
    if (evt.key === "Tab" && evt.ctrlKey === true) {
      return false;
    }
  };
 
var que_no = 0;
var index=0;
var saffron = [1];
var green = [];
var saveQuestion = [];
var user_que = [];
var user_ans = [];
var allquestion = [];
var category_ids = [];
var total_num = document.getElementById("timerCount").innerHTML;
document.getElementById(`btn1`).style.backgroundColor = "rgb(230, 171, 33)";

getResult();

async function getResult() {

    const data = await fetch("/getResult");
    const question_paper = await data.json();

    for (let i = 0; i < question_paper.user_que.length; i++) {
        user_que[question_paper.user_que[i] - 1] = question_paper.user_que[i];

        user_ans[question_paper.user_que[i] - 1] = question_paper.user_ans[i];
    }

    if (user_que.length) {
        green = user_que;
        colors();
        document.getElementById(`btn1`).style.backgroundColor = "rgb(230, 171, 33)";
    }



}


///////////////////////////////timer////////////

var minute;
var second;

gettimer();

function gettimer() {
    minute = getCookie("minutes");
    second = getCookie("seconds");
    document.getElementById("timerCount").innerHTML = `Remaining Time: ${minute}:${second}`;

    if (!minute || !second) {
        minute = total_num - 1;
        second = 60;
    }

};


var rajeshInterval = setInterval(() => {

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

    if (minute < 5) {
        document.getElementById("timerCount").style.backgroundColor = "red";
    }
}, 1000);


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}


displayQue();

async function displayQue(num, text) {

    if (text == "inc") {
        que_no += 1;
    }
    if (text == "dec") {
        que_no -= 1;
    }

    if (num >= 0) {
        que_no = num;
    }

    const data = await fetch("/getQuestion");
    const question_paper = await data.json();

    const cate_data = await fetch(`/getCategoryId?que_no=${que_no + 1}`);
    const get_categoryId = await cate_data.json();

    let catego_id = get_categoryId[0].category_id;

    // console.log("quo_no", que_no);
    // console.log("catego_id", catego_id);
    // console.log("saffron :", saffron);
    // console.log("green", green);

    category_ids.push(catego_id);

    category_ids.forEach(id => {
        document.getElementById(`${id}`).style.backgroundColor = "#87CEEB";
    })

    document.getElementById(`${catego_id}`).style.backgroundColor = "#547dbb";


    if (allquestion.length == 0) {
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

    var Quequery = ` <div class="que_body" oncopy="return false">
                        <p class="question">
                        ${que_no + 1}) ${allquestion[que_no].question}
                        </p>
                     <div class="option">`;

    for (let i = 0; i < user_que.length; i++) {
        if (user_que[i]) {

            if (allquestion[que_no].question_id == user_que[i]) {
                index = i;
                break;
            }
        }
    }

    for (let j = 0; j < allquestion[que_no].option.length; j++) {

        if (`"${allquestion[que_no].option[j]}"` == user_ans[index]) {

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


function next() {

    var getSelectedValue = document.querySelector('input[name="que1"]:checked');

    if (getSelectedValue) {

        user_que[que_no] = (que_no + 1);
        user_ans[que_no] = `"${getSelectedValue.value}"`;
        saveQuestion[que_no] = {
            question_id: que_no + 1,
            user_answer: `${getSelectedValue.value}`
        };

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
    }

    saffron.push((que_no + 2));
    colors();
    document.getElementById(`btn${que_no + 2}`).style.backgroundColor = "rgb(230, 171, 33)";
    displayQue(-1, "inc");

}


function prev() {

    var getSelectedValue = document.querySelector('input[name="que1"]:checked');

    if (getSelectedValue) {

        user_que[que_no] = (que_no + 1);
        user_ans[que_no] = `"${getSelectedValue.value}"`;

        saveQuestion[que_no] = {
            question_id: que_no + 1,
            user_answer: `${getSelectedValue.value}`
        };

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
            });

        green.push(que_no + 1);

    }

    saffron.push(que_no);
    colors();
    document.getElementById(`btn${que_no}`).style.backgroundColor = "rgb(230, 171, 33)";
    displayQue(-1, "dec");
}

function showQue(num) {
    saffron.push(parseInt(num));
    colors();
    document.getElementById(`btn${num}`).style.backgroundColor = "rgb(230, 171, 33)";
    displayQue(num - 1, "abc");
}


async function getcategoryQue(id) {

    const data = await fetch(`/getCategory?cat_id=${id}`);
    const category = await data.json();
    saffron.push(parseInt(category.category_no));
    colors();
    document.getElementById(`btn${category.category_no}`).style.backgroundColor = "rgb(230, 171, 33)";
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