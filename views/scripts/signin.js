document.querySelector(".createNew").onclick = () => {
    console.log("2")

  window.location.href = "/user/signup";
};

document.getElementById("signinForm").onsubmit = (event) => {
  event.preventDefault();
  const data = {
    email: event.target.email.value,
    password: event.target.password.value,
  };

  let loginbuttontag = document.querySelector(".loginbutton");
  let messageTag = document.createElement("p");

  axios
    .post("http://13.61.32.225:3002/user/submitLogin", data)
    .then((result) => {
      console.log(result);
      if (result.data?.error) {
        messageTag.textContent = result.data?.error;
        messageTag.id = "failed";
        loginbuttontag.parentElement.appendChild(messageTag);

        let time = setTimeout(() => {
          messageTag.remove();
        }, 3000);
      } else {
        localStorage.setItem("token", result.data.token);
        window.location.href = "http://13.61.32.225:3002/expense";
      }
    })
    .catch((err) => {
      console.log("err ", err);

      messageTag.textContent = err.response.data.message;
      messageTag.id = "failed";
      loginbuttontag.parentElement.appendChild(messageTag);

      let time = setTimeout(() => {
        messageTag.remove();
      }, 3000);
    });
};
