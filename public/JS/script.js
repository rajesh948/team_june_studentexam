
displayQue();
var que_no = 0;
async function displayQue(num, text) {
    if (num >= 0) {

        que_no = num;
        console.log(que_no);
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


    var allquestion = [];
    for (let i = 0; i < question_paper.length; i++) {

        allquestion = allquestion.concat(question_paper[i].allquestion);
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

    console.log(allquestion);
    var Quequery = ` <div class="que_body">
<p class="question">
${que_no + 1}) ${allquestion[que_no].question}
</p>
<div class="option">`;

    for (let j = 0; j < allquestion[que_no].option.length; j++) {
        console.log("rgertefttergtfr:::::::::",allquestion[que_no].option[j]);
        Quequery += ` <div><input value="${allquestion[que_no].option[j]}" type="radio"  name="que1">
    <p>${allquestion[que_no].option[j]}</p>
</div>`;
    }


    Quequery += `</div></div>`;

    document.getElementById("questionQue").innerHTML = Quequery;

}

function next() {
    displayQue(-1, "inc");
}
function prev() {
    displayQue(-1, "dec");
}

var num2 = [];
function showQue(num) {
    num2.push(num);
    num2.forEach(id => {
        document.getElementById(`btn${id}`).style.backgroundColor = "white";
    })
    document.getElementById(`btn${num}`).style.backgroundColor = "rgb(230, 171, 33)";
    console.log(num);
    displayQue(num - 1, "abc");

}


async function getcategoryQue(id) {

    const data = await fetch(`/getCategory?cat_id=${id}&exam_id=1`);
    const category = await data.json();
    displayQue(category.category_no - 1, "abc");
}



function savedata(){

console.log(que_no+1);

var getSelectedValue = document.querySelector( 'input[name="que1"]:checked');   
if(getSelectedValue){

        document.getElementById(`btn${que_no+1}`).style.backgroundColor = " rgb(56, 233, 56)";

    console.log(getSelectedValue.value)
}
}