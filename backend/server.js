// server.js
const express = require('express');
const cors = require('cors');
const connection = require('./db_config'); // Assumindo que db_config.js configura a conexão MySQL
const app = express();

app.use(cors());
app.use(express.json());

const port = 3030;

// Cadastro de usuário
app.post('/cadastro', (req, res) => {
    const { username, password, email, placa, cor, modelo } = req.body;
    const query = 'INSERT INTO users (username, password, email, placa, cor, modelo) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, password, email, placa, cor, modelo], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.' });
        }
        res.json({ success: true, message: 'Usuário cadastrado com sucesso!', id: result.insertId });
    });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor.' });
        }
        if (results.length > 0) {
            res.json({ success: true, message: 'Login bem-sucedido!', user: results[0] }); // Envia os dados do user
        } else {
            res.json({ success: false, message: 'Usuário ou senha incorretos!' });
        }
    });
});

// server.js

// Listar vagas
app.get('/vagas', (req, res) => {
    //1 se preferencial for verdadeiro e 0 caso contrário.
    const query = 'SELECT *, IF(preferencial = TRUE, 1, 0) AS preferencial_int FROM vagas';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao buscar vagas.' });
        }
        res.json({ success: true, vagas: results });
    });
});

// Ocupar vaga
app.post('/vagas/:vagaId/ocupar', (req, res) => {
    const { vagaId } = req.params;
    const { userId } = req.body;
    const queryOcupar = 'INSERT INTO vagas_ocupadas (vaga_id, user_id, data_entrada) VALUES (?, ?, NOW())';
    const queryAtualizarVaga = 'UPDATE vagas SET disponivel = FALSE WHERE id = ?';

    connection.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao iniciar transação.' });
        }

        connection.query(queryOcupar, [vagaId, userId], (err, result) => {
            if (err) {
                return connection.rollback(() => {
                    res.status(500).json({ success: false, message: 'Erro ao ocupar vaga.' });
                });
            }

            connection.query(queryAtualizarVaga, [vagaId], (err) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({ success: false, message: 'Erro ao atualizar vaga.' });
                    });
                }

                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.status(500).json({ success: false, message: 'Erro ao finalizar transação.' });
                        });
                    }
                    res.json({ success: true, message: 'Vaga ocupada com sucesso!' });
                });
            });
        });
    });
});

// Desocupar vaga
app.delete('/vagas/:vagaId/desocupar', (req, res) => {
    const { vagaId } = req.params;
    const queryDesocupar = 'DELETE FROM vagas_ocupadas WHERE vaga_id = ?';
    const queryAtualizarVaga = 'UPDATE vagas SET disponivel = TRUE WHERE id = ?';

    connection.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao iniciar transação.' });
        }

        connection.query(queryDesocupar, [vagaId], (err) => {
            if (err) {
                return connection.rollback(() => {
                    res.status(500).json({ success: false, message: 'Erro ao desocupar vaga.' });
                });
            }

            connection.query(queryAtualizarVaga, [vagaId], (err) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({ success: false, message: 'Erro ao atualizar vaga.' });
                    });
                }

                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.status(500).json({ success: false, message: 'Erro ao finalizar transação.' });
                        });
                    }
                    res.json({ success: true, message: 'Vaga desocupada com sucesso!' });
                });
            });
        });
    });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));