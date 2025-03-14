document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Nenhum usuário logado.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('placa').value = user.placa;
    document.getElementById('cor').value = user.cor;
    document.getElementById('modelo').value = user.modelo;

    document.getElementById('editarForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const placa = document.getElementById('placa').value;
        const cor = document.getElementById('cor').value;
        const modelo = document.getElementById('modelo').value;

        fetch(`http://localhost:3030/editar/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, placa, cor, modelo })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'vagas.html';
            } else {
                alert(data.message);
            }
        });
    });
});
