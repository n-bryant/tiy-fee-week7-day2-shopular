app.service('UserManagementService', ManagementService);

function ManagementService() {
  function logIn(username) {
    let user = {
      name: username,
      loggedIn: true,
      loggedInDate: new Date()
    }
    console.log(user);
    return user;
  }

  function getInUser(user) {
    if (user.loggedIn) {
      return user;
    } else {
      return null;
    }
  }

  return {
    logIn: logIn,
    getInUser: getInUser
  };
}
