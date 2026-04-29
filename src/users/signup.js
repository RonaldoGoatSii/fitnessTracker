const usersAPI = "https://69de915cd6de26e1192812a2.mockapi.io/user";

document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const age = document.getElementById("signupAge").value;

    const newUser = {
        name: name,
        email: email,
        password: password,
        age: age,
        role: "user" 
    };

    Swal.fire({
        title: 'Creating account...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    fetch(usersAPI)
        .then(res => res.json())
        .then(users => {
            const exists = users.find(u => u.email === email);
            
            if (exists) {
                Swal.fire('Error', 'This email is already registered!', 'error');
                return;
            }

            // If email is unique, post to API
            return fetch(usersAPI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
        })
        .then(response => {
            if (response && response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: 'You can now log in to your dashboard.',
                    confirmButtonColor: "#ff0033"
                }).then(() => {
                    window.location.href = "login.html";
                });
            }
        })
        .catch(err => {
            Swal.fire('Error', 'Could not connect to server.', 'error');
            console.error(err);
        });
});