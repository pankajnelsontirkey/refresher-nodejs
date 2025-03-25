const greeting = `<html>
    <head>
      <title>Welcome</title>
    </head>
    <body>
    <h1>Welcome to this nodejs server!</h1>
    <a href="/users">View Users</a>
    </body>
  </html>`;

const userListHtml = `<html>
    <head>
      <title>Users</title>
    </head>
    <body>
      <a href='/create-user'>Create User</a> | 
      <a href='/'>Home</a>
      <ul>
        <li>Alisson Becker</li>
        <li>Andy Robertson</li>
        <li>Ibrahima Konate</li>
        <li>Virgil Van Dijk</li>
        <li>Connor Bradley</li>
        <li>Ryan Gravenberch</li>
        <li>Alexis Macallister</li>
        <li>Dominik Szoboszlai</li>
        <li>Cody Gakpo</li>
        <li>Darwin Nunez</li>
        <li>Mohamed Salah</li>
      </ul>
    </body>
  </html>`;

const createUserForm = `<html>
    <head>
      <title>Users</title>
    </head>
    <body>
      <a href='/'>Home</a>
      <a href='/users'>View Users</a> |
      <br>
      <form action='/create-user' method='POST'>
      <label for="username">Enter Username</label>
      <br>
      <input type="text" name="username" />
      <button type="submit">Create User</button>
      </form>
    </body>
  </html>`;

module.exports = {
  greeting,
  users: userListHtml,
  form: createUserForm
};
