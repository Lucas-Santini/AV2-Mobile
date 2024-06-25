import React, { useState } from 'react';
import { Alert, Button, View, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { create } from './Create.js';

export function Insert({ onSenhaGerada }) {
    const [generatedPassword, setGeneratedPassword] = useState('');

    const gerarSenhaAleatoria = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let senha = '';
        for (let i = 0; i < 8; i++) {
            const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
            senha += caracteres.charAt(indiceAleatorio);
        }
        setGeneratedPassword(senha);
    };

    const insertSenha = async () => {
        try {
            const db = await create();
            let senha = generatedPassword || gerarSenhaAleatoria();
            let result = await db.runAsync(`INSERT INTO senhas (senha) VALUES (?);`, senha);
            if (result.changes > 0) {
                Alert.alert(
                    'Sucesso',
                    `A senha criada é: ${senha}`,
                    [{ text: 'Ok' }],
                    { cancelable: false }
                );
                onSenhaGerada(senha); // Atualiza o estado no componente AllContacts
            } else {
                alert('Erro registrando senha');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const clearGeneratedPassword = () => {
        setGeneratedPassword('');
    };

    return (
        <View style={styles.container}>
            <Button title="Gerar Senha Aleatória" onPress={gerarSenhaAleatoria} color="#d32f2f" />
            <Button title="Salvar Senha Gerada" onPress={insertSenha} color="#1976d2" disabled={!generatedPassword} />
            {generatedPassword ? (
                <View style={styles.generatedPasswordContainer}>
                    <Text style={styles.generatedPasswordText}>Senha Gerada: {generatedPassword}</Text>
                    <Button title="Limpar Senha" onPress={clearGeneratedPassword} color="#757575" />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        marginTop: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    generatedPasswordContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    generatedPasswordText: {
        fontSize: 16,
        marginBottom: 10,
    },
});
