
const githubForm = document.getElementById("github-form");
const usernameInput = document.getElementById("username-input");
const repoList = document.getElementById("repo-list");
const resultsContainer = document.getElementById("results-container");
const submitButton = githubForm.querySelector('button[type="submit"]');

githubForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = usernameInput.value.trim();

  repoList.innerHTML = "";
  const existingError = resultsContainer.querySelector(".error-message");
  // if (existingError) {
  //   existingError.remove();
  // }

  if (!username) {
    displayError("Please enter a GitHub username.");
    return;
  }

  showLoading(true);

  fetch(`https://api.github.com/users/${username}/repos`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `User not found or API limit reached. Status: ${response.status}`
        );
      }
      return response.json();
    })
    .then((data) => {
      showLoading(false);
      displayRepos(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      showLoading(false);
      displayError(
        "Could not fetch repositories. Please check the username and try again."
      );
    });
});

function displayRepos(repos) {
  if (repos.length === 0) {
    displayError("This user doesn't have any public repositories.");
    return;
  }

  // repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

  repos.forEach((repo, index) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const repoInfo = document.createElement("div");

    link.href = repo.html_url;
    link.target = "_blank";
    link.textContent = repo.name;

    repoInfo.innerHTML = `
      <div style="margin-top: 8px; font-size: 14px; color: #6c757d;">
        ${repo.description || "No description available"}
      </div>
      <div style="margin-top: 8px; display: flex; gap: 15px; font-size: 12px; color: #6c757d;">
        ${repo.language ? `<span> ${repo.language}</span>` : ""}
        <span> ${repo.stargazers_count}</span>
        <span> ${repo.forks_count}</span>
        <span> ${new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    `;

    listItem.appendChild(link);
    listItem.appendChild(repoInfo);
    listItem.classList.add("fade-in");
    setTimeout(() => {
      repoList.appendChild(listItem);
    }, index * 50);
  });
}

function showLoading(isLoading) {
  if (isLoading) {
    submitButton.innerHTML = '<span class="loading"></span>Loading...';
    submitButton.disabled = true;
    
  } else {
    submitButton.innerHTML = "Get Repos";
    submitButton.disabled = false;
  }
}

function displayError(message) {
  const errorMessage = document.createElement("p");
  errorMessage.className = "error-message fade-in";
  errorMessage.textContent = message;
  resultsContainer.appendChild(errorMessage);
}
