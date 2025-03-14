document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const placa = document.getElementById('placa').value;
    const cor = document.getElementById('cor').value;
    const modelo = document.getElementById('modelo').value;

    fetch('http://localhost:3030/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email, placa, cor, modelo })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    });
}); 