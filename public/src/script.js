const saveBtn = document.querySelector("#saveStats");
const redirectBtn = document.querySelector("#redirect");
saveBtn.addEventListener("click", async () => {
  const obj = {
    p1: myscore,
    p2: otherscore,
    win: finalresults,
  };
  saveBtn.innerText = "Saving...";
  await fetch("https://leaguex.onrender.com/save", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
  saveBtn.innerText = "Saved";
});

redirectBtn.addEventListener("click", () => {
  console.log("first");
  window.location = "./viewStats.html";
});
var socket = io.connect("https://leaguex.onrender.com/");
var i,
  username,
  j = 0,
  myscore = 0,
  otherscore = 0,
  finalresults,
  ti,
  user_id;

let gameStats = {};

socket.on("updatechat", function (username, data, id) {
  $("#conversation")
    .append("<br>" + data + "<br>")
    .css({
      padding: "10px",
      textAlign: "center",
    });
  user_id = id;
});

socket.on("game", function (data) {
  $("#realtime").append("<b>" + data + "<br>");
});

function doFunction() {
  $(".rules").fadeIn();
  var counter = 10;
  var reverseCounter = setInterval(function () {
    $(".startsin").text("The game will start in " + counter + " seconds....");
    counter--;

    if (counter < 0) {
      clearInterval(reverseCounter);
    }
  }, 1000);
}

socket.on("sendQuestions", function (data) {
  $(".intermediate").fadeOut("slow");

  doFunction();

  i = 0;

  ti = setInterval(function () {
    $(".rules").fadeOut();
    $(".started").fadeIn("slow");
    $(".loading-page").fadeIn("slow");
    $("#realresults").fadeIn("slow");

    if (i < 5) {
      j = 0;
      j++;
      $("#qst").text(data.questions[i].question);
      $("#btn1").attr("value", 0).text(data.questions[i].choices[0]);
      $("#btn2").attr("value", 1).text(data.questions[i].choices[1]);
      $("#btn3").attr("value", 2).text(data.questions[i].choices[2]);
      $("#btn4").attr("value", 3).text(data.questions[i].choices[3]);

      //timer
      $(document).ready(function () {
        var counter = 0;
        var c = 1;
        var r = 9;
        var k = setInterval(function () {
          $(".loading-page .counter h3").html(r + " Sec Remaining...");
          $(".loading-page .counter hr").css("width", c * 10 + "%");

          counter++;
          c++;
          r--;

          if (counter == 10) {
            clearInterval(k);
          }
        }, 1000);
      });

      //timer

      $("#realtime button").removeClass("btn disabled");
      $("#realtime button").prop("disabled", false);
      $("#realtime button").click(function () {
        $("#realtime button").addClass("btn disabled");
        $("#realtime button").prop("disabled", true);
        var givenAns = this.value;
        var correctAns = data.questions[i - 1].correctAnswer;
        var response = givenAns == correctAns;
        if (response) {
          if (j == 1) {
            socket.emit("result", username, user_id);
            $(".currect_ans").fadeIn().delay(800).fadeOut();
            j++;
          }
        } else {
          if (j == 1) {
            $(".wrong_ans").fadeIn().delay(800).fadeOut();
            j++;
          }
        }
      });
    }
    i++;

    if (i == 6) {
      clearInterval(ti);
      $(".started").fadeOut("slow");
      $(".loading-page").fadeOut();
      $("#finalresult_show").fadeIn("slow");
    }
  }, 10000);
});

socket.on("viewresult", function (usr) {
  console.log("usr:", usr);
  console.log("username:", username);
  if (usr == username) {
    myscore += 10;
    $("#myresult").text(myscore);
  } else {
    otherscore += 10;
    $("#otherresult").text(otherscore);
  }

  if (myscore > otherscore) {
    $("#finalresult").text("🎉 You Win!");
    finalresults = "Player1";
  } else if (myscore < otherscore) {
    $("#finalresult").text("😔 You Lose!");
    finalresults = "Player2";
  } else {
    $("#finalresult").text("🤝 Tie!");
    finalresults = "Tie";
  }
});
$(document).ready(function () {
  $("#btnJoin").click(function () {
    $(".lets_start").fadeOut();
    username = $("#input_user").val();
    if (username != "") {
      socket.emit("addClient", username);
    } else {
      alert("USERNAME PLEASE!");
      window.location = "https://leaguex.onrender.com/";
    }
  });
});
