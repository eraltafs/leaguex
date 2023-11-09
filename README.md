# leaguex - Quiz Application

link:- https://leaguex.onrender.com/

leaguex is a real-time quiz application that allows users to engage in a fun and competitive quiz game. This repository contains the source code for leaguex, and it's built using a combination of HTML, CSS, Bootstrap, jQuery, Node.js, Express, and Socket.io.


## Getting Started

To get started with leaguex, follow these instructions:

### Prerequisites

- Node.js and npm installed on your system.

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/erltafs/leaguex.git
   ```

2. Navigate to the project directory:

   ```bash
   cd leaguex
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   node index.js
   ```

5. Open your web browser and visit [http://localhost:8000](http://localhost:8000) to access leaguex.

## Usage

leaguex is a real-time quiz application where users can join a room and participate in a quiz game. Here's how it works:

1. **User Registration**: Upon visiting the application, the user is prompted to enter their username.

2. **Waiting for Other Player**: If another player has already joined the room, both players can see the rules of the game. Otherwise, one player will have to wait for the other player to join.

3. **Gameplay**: Once two players are in the same room, they will receive quiz questions in real-time. Each user has a 10-second window to respond with their answers. Correct answers are awarded 10 points.

4. **Game Conclusion**: The game concludes after collecting responses for 5 questions or after 50 seconds, whichever comes first. The result is broadcast to both users. Once the game concludes, the respective room is closed and deleted.

## Technologies Used

leaguex is built using the following technologies:

- HTML
- CSS
- Bootstrap
- jQuery
- Node.js
- Express
- Socket.io
