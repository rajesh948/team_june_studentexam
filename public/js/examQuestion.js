

var que_no = 0;

var saffron = [1];
var green = [];
var saveQuestion = [];
var user_que = [];
var user_ans = [];
var allquestion = [];
var total_num = document.getElementById("timerCount").innerHTML;

getResult();

async function getResult(){
    const data = await fetch("/getResult");
    const question_paper = await data.json();
    console.log("getResult",question_paper);
    user_que= question_paper.user_que;
  
    user_ans= question_paper.user_ans;
    if(user_que[0] != 0){
        green = user_que;
        colors();
        document.getElementById(`btn1`).style.backgroundColor = "rgb(230, 171, 33)";
    }
    console.log("user_que getresult",user_que);

    console.log("user_que getresult",user_ans);
}

displayQue();

async function displayQue(num, text) {
    if (num >= 0) {
        que_no = num;
    }

    const data = await fetch("/getQuestion");
    const question_paper = await data.json();

    console.log(question_paper);
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

    var Quequery = ` <div class="que_body">
<p class="question">
${que_no + 1}) ${allquestion[que_no].question}
</p>
<div class="option">`;



    var index = 0;

    for (let i = 0; i < user_que.length; i++) {
        if (user_que[i]) {

            if (allquestion[que_no].question_id == user_que[i]) {
                index = i;
            }
        }


    }

    // console.log("index", index, "que_no", que_no);

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

    saffron.push(que_no + 2);
    // console.log("next que_no :",que_no+2)
    // console.log("next saffron nooo:",saffron);
    displayQue(-1, "inc");
    colors();
    document.getElementById(`btn${que_no + 2}`).style.backgroundColor = "rgb(230, 171, 33)";
}


function prev() {
    saffron.push(que_no);
    // console.log("prev saffron no",saffron);
    // console.log("prev que_no :",que_no)
    displayQue(-1, "dec");
    colors();
    document.getElementById(`btn${que_no}`).style.backgroundColor = "rgb(230, 171, 33)";
}


function showQue(num) {
    // console.log("num2::::::::::::::::", saffron);
    saffron.push(parseInt(num));
    colors();
    document.getElementById(`btn${num}`).style.backgroundColor = "rgb(230, 171, 33)";
    console.log("ShowQue ::::::",num);
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




function savedata() {

    var getSelectedValue = document.querySelector('input[name="que1"]:checked');


    if (getSelectedValue) {
        user_que[que_no] = que_no + 1;
        user_ans[que_no] = `"${getSelectedValue.value}"`;
        saveQuestion[que_no] = {
            question_id: que_no + 1,
            user_answer: `${getSelectedValue.value}`
        };

console.log("savedata user_que",user_que);
console.log("savedata user_ans",user_ans);

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
        console.log(saveQuestion)
    }
}



function colors() {
    saffron.forEach(id => {
        document.getElementById(`btn${id}`).style.backgroundColor = "white";
    })

    green.forEach(id => {
        document.getElementById(`btn${id}`).style.backgroundColor = "rgb(56, 233, 56)";
    })
}


var minit = total_num-1;
var second = 60;
var rajeshInterval = setInterval(() => {
    document.getElementById("timerCount").innerHTML = `${minit}:${second}`;

    if (second == 0) {
        minit--;
        second = 60;
    }
    second--;
    if (minit == -1) {
     
        clearInterval(rajeshInterval);
        submit();
    }
}, 1000);


function submit() {
    // fetch("/saveUserResult", {
    //     method: "POST",
    //     body: JSON.stringify({
          
    //         user_que: user_que,
    //         user_ans: user_ans
    //     }),

    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8"
    //     }
    // })
    //     .then(response => response.json())
    //     .then(json => {
    //         console.log(json);
    //         console.log("inserted");
    //     });

    window.location.replace("/result");
}