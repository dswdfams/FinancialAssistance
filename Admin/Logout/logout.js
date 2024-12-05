document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  const logoutModal = document.getElementById("logoutModal");
  const confirmLogoutButton = document.getElementById("confirmLogout");
  const cancelLogoutButton = document.getElementById("cancelLogout");

  // Show the logout modal when logout button is clicked
  logoutButton.onclick = () => {
    logoutModal.style.display = "flex";
  };

  // Close the modal without logging out
  cancelLogoutButton.onclick = () => {
    logoutModal.style.display = "none";
  };

  // Confirm logout
  confirmLogoutButton.onclick = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userRef = firebase.database().ref("2-Users/" + user.uid);

      // Update last login timestamp
      await userRef.update({
        lastLogin: new Date().toISOString(),
        online: false
      });

      // Sign out the user
      firebase.auth().signOut()
        .then(() => {
          alert("You have been logged out successfully.");
          window.location.href = "/index.html"; // Redirect to login page
        })
        .catch((error) => {
          console.error("Error logging out:", error);
          alert("An error occurred during logout. Please try again.");
        });
    } else {
      alert("No active user found.");
    }
  };
});
