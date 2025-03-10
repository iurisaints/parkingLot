const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
window.location.href = 'login.html';
}

const vagasA = document.getElementById('vagas-a');
const vagasB = document.getElementById('vagas-b');

fetch('http://localhost:3030/vagas')
.then(response => response.json())
.then(data => {
    if (data.success) {
        data.vagas.forEach(vaga => {
            const vagaDiv = document.createElement('div');
            vagaDiv.classList.add('vaga');
            vagaDiv.textContent = `Vaga ${vaga.numero}`;
            if (!vaga.disponivel) {
                vagaDiv.classList.add('ocupada');
            }
            if (vaga.preferencial_int === 1) { // Verifica se a vaga é preferencial (1 ou 0)
                vagaDiv.classList.add('vaga-preferencial');
            } else {
                vagaDiv.classList.add('vaga-comum')
            }
            console.log(vaga);
            
            vagaDiv.addEventListener('click', function() {
                if (vaga.disponivel) {
                    fetch(`http://localhost:3030/vagas/${vaga.id}/ocupar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userId: user.id })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            vagaDiv.classList.add('ocupada');
                            vaga.disponivel = false;
                            alert(data.message);
                        } else {
                            alert(data.message);
                        }
                    });
                } else {
                    fetch(`http://localhost:3030/vagas/${vaga.id}/desocupar`, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            vagaDiv.classList.remove('ocupada');
                            vaga.disponivel = true;
                            alert(data.message);
                        } else {
                            alert(data.message);
                        }
                    });
                }
            });
            if (vaga.bloco === 'A') {
                vagasA.appendChild(vagaDiv);
            } else if (vaga.bloco === 'B') {
                vagasB.appendChild(vagaDiv);
            }
        });
    } else {
        alert(data.message);
    }
});