const usersAPI = "https://69de915cd6de26e1192812a2.mockapi.io/user";


document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    Swal.fire({
        title: 'Authenticating...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    fetch(usersAPI)
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(users => {
            const authenticatedUser = users.find(u => u.email === email && u.password === password);

            if (authenticatedUser) {
                localStorage.setItem("sessionUser", JSON.stringify(authenticatedUser));

                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: `Welcome, ${authenticatedUser.name}!`,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "../index.html";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'Invalid email or password.'
                });
            }
        })
        .catch(err => {
            Swal.fire('Error', 'Connection failed.', 'error');
            console.error(err);
        });
});