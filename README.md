

### 1. A brief description of what you created, and a link to the project itself (two paragraphs of text)

The main gameplay loop consists of two features:
#### Combat:
  - 1-4 randomly generated enemies (stats, type, etc.), with difficulty scaling based on how many encounters the player has completed. 
  - choose which enemy to attack, and is then attacked by all the remaining enemies. 
  - Upon defeating enemies the player is rewarded with gold which can be spent to upgrade their stats.

#### Shop: 
  - choice of 3 items
    - a max health upgrade
    - damage upgrade
    - a healing upgrade
  - stats and cost of these items are randomly generated, scaling based on how many encounters the player has completed.

All player stats are stored in the database, so users can leave mid-run and return without losing progress.

  As a group we decided to make a website with a text rpg coded into it. With the text RPG we looked at some test rpgs to see look at what makes it and how to create ours based off them. After brainstorming we figured out the basics of what we wanted and what we hoped to get finished if we had time. We decided we wanted a game that had enemies that would be spawned randomly and would give gold for the player to upgrade stats in the shop.
  After the time was up we created most of what we wanted when we were brainstorming. We left out the bosses we wanted to add and non combat choices that would either help you or kill you. But because of that we were able to finish our game with what really mattered with a functioning game with random enmies that scale and a player thats stats increase by buying items from the store. We also have the game tied to accounts to make it easy on people with the ability to choose what character they want to use(it only affects visual not gameplay) with buttons that let the player choose.

### 2. Any additional instructions that might be needed to fully use your project (login information etc.)

Sample email to login:
email: joemama@gmail.com 
password : 123

(Can type in random email and password, and it will create an account)

### 3. An outline of the technologies you used and how you used them.

- MongoDB - storing user login and player stats
- Bcrypt - encrypting passwords
- Body-parser - parsing json
- cookie parser - parsing cookies
- dotenv - storing environment variables
- express - backend server
- express session - managing/storing sessions
- mongoose - creating MongoDB schemas

### 4. What challenges you faced in completing the project.

- Writing asynchronous requests and having the UI update correctly based on responses from the backend server
- Using closures to dynamically generate buttons to create a turn-based game that relies on user-input. 
- Storing user session via cookies and player stats in the database

### 5. What each group member was responsible for designing / developing.
Brainstorming - all

- Caleb - setup database, backend routes, combat and shop front-end logic, procedural enemy generation back-end logic
- Joe - worked on the basics of the shop function with get item, and gave helping tips to others on their parts, recodrding and brief description
- Kaley - front end html and css (game screen)
- Kate - front end html and css (login and character select)

### 6. A link to your project video.

