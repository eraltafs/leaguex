let tbody = document.getElementById("statsData");
fetch("https://leaguex.onrender.com/viewstats")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data = data.result;
    tbody.innerHTML = "";
    data.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
  <td>${row.room}</td>
  <td><b>${row.players.player1}</b> <i>vs</i> ${row.players.player2}</td>
  <td>${row.player1Score}</td>
  <td>${row.player2Score}</td>
  <td>${row.winner}</td>
`;
      tbody.appendChild(tr);
    });
  })
  .catch((error) => console.error("Error:", error));