var butn = document.querySelector(".btn");
var selectedCategory = 27;
var selectedDifficulty ="easy";
var question = document.querySelector(".question");


$(document).ready(function(){
    populateQuestion();
})

$(butn).click(populateQuestion);

function fillCategory(){
    var category = document.getElementById("categories");
    axios.get("https://opentdb.com/api_category.php")
    .then(function(response){
        var data =(response.data.trivia_categories);
        data.forEach(function(items){
            if(items.id === 27){
                $(category).append(`<option value ="${items.id}" selected>${items.name}</option>`);
            } else{
                $(category).append(`<option value ="${items.id}">${items.name}</option>`);
            }
        })
    })
    .catch(function(e){
        console.log("ERROR!!");
    })

    $(category).on("change",function(){
        selectedCategory = $(this).val();
    })

    $(difficulty).on("change",function(){
        selectedDifficulty = $(this).val();
    })
}

function populateQuestion(){
    axios.get("https://opentdb.com/api.php",{
        params:{
            amount:1,
            category:selectedCategory,
            difficulty:selectedDifficulty
        }
    })
    .then(function(res){
        updateUI(res);
    })
    .catch(function(e){
        if(e.response){
            console.log('Response error, Check api usage');
        }else if(e.request){
            console.log('Request error, Check server status');
        }
    })

}


function updateUI(res){
    var result = res.data.results[0];
    var questionText = result.question;
    $(question).html(questionText);
    var correctAnswer = result.correct_answer;
    var incorrectAnswer = result.incorrect_answers;
    
    
    incorrectAnswer.push(correctAnswer);
    var options = shuffle(incorrectAnswer);
    $(".choice").remove();
    options.forEach(function(answer){
        $(".options").append(`<p class ="choice">${answer}</p>`);
    })

    $(".choice").on("click",function(){
        let decision = checkAnswer(this,correctAnswer);
        if(decision){
            //$(this).css("background-color", "green");
            $(this).css({
                "box-shadow": "inset 0 0 0 2.5em green",
                "border": "1px solid lime"
            });
            let countP = parseInt($("#correct").html()) + 1;
            $("#correct").html(countP);
            setTimeout(populateQuestion, 1000);
        } else{
            $(this).css({
                "box-shadow": "inset 0 0 0 2.5em red",
                "border": "1px solid crimson"
            });
            //console.log($(".choice"));
            $("p").each(function(element){
                if($(this).html() === correctAnswer){
                    $(this).css({
                        "background-color":"green",
                        "opacity":"0.7"
                    });
                }
                console.log($(this).html());
            })
            let countW = parseInt($("#wrong").html()) + 1;
            $("#wrong").html(countW);
            setTimeout(populateQuestion, 1000);
        }
    });
}

function shuffle(array){
    let currentIndex = array.length;
    let randomIndex;

    while(currentIndex != 0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex],array[currentIndex]];
    }
    return array;
}

function checkAnswer(choice,correctAnswer){
    if(choice.innerHTML === correctAnswer){
        return true;
    }
    return false;
}

fillCategory();
