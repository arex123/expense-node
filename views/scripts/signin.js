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
    .post("http://13.60.215.235/user/submitLogin", data)
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
        window.location.href = "http://13.60.215.235/expense";
      }
    })
    .catch((err) => {
      console.log("err ", err);

      messageTag.textContent = err?.response?.data?.message;
      if(!messageTag.textContent){
        messageTag.textContent = "something went wrong";
      }

      messageTag.id = "failed";
      loginbuttontag.parentElement.appendChild(messageTag);

      let time = setTimeout(() => {
        messageTag.remove();
      }, 3000);
    });
};
