import React, { useState, useEffect } from 'react';
import { Alert, Button, FlatList, Text, View, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { create } from './Create.js';

export function AllContacts() {
    const [senhas, setSenhas] = useState([]);
    const [generatedPasswords, setGeneratedPasswords] = useState([]);

    useEffect(() => {
        getAllSenhas();
    }, []);

    const getAllSenhas = async () => {
        try {
            const db = await create();
            let allRows = await db.getAllAsync('SELECT * from senhas;');
            setSenhas(allRows);
            console.log("[LOG] Data retrieved from table senhas");
        } catch (error) {
            console.log(error);
        }
    };

    const deleteSenha = async (id) => {
        try {
            const db = await create();
            let result = await db.runAsync(`DELETE FROM senhas WHERE id = ?;`, id);
            if (result.changes > 0) {
                Alert.alert(
                    'Sucesso',
                    'Senha deletada com sucesso',
                    [{ text: 'Ok', onPress: () => {
                        getAllSenhas(); // Atualiza a lista de senhas após exclusão
                        setGeneratedPasswords([]); // Limpa as senhas geradas exibidas
                    }}],
                    { cancelable: false }
                );
            } else {
                alert('Erro ao deletar senha');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const showGeneratedPasswords = async () => {
        try {
            const db = await create();
            let allRows = await db.getAllAsync('SELECT * from senhas;');
            let passwords = allRows.map(row => ({
                id: row.id,
                senha: row.senha
            }));
            setGeneratedPasswords(passwords);
        } catch (error) {
            console.log(error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.listItem}>
            <Text style={styles.textheader}>ID: {item.id}</Text>
            <Text style={styles.textbottom}>Senha: {item.senha}</Text>
            <Button title="Apagar Senha" onPress={() => deleteSenha(item.id)} color="#d32f2f" />
        </View>
    );

    const keyExtractor = (item, index) => item.id.toString() + index.toString();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button title="Mostrar Senhas Geradas" onPress={showGeneratedPasswords} />
            </View>
            <FlatList
                style={styles.listContainer}
                data={senhas.concat(generatedPasswords)}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListEmptyComponent={<Text>Nenhuma senha salva</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Alterado para centralizar os itens horizontalmente
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
        width: '100%',
    },
    listItem: {
        backgroundColor: '#ffffff',
        marginTop: 10,
        padding: 20,
        borderRadius: 10,
        elevation: 2,
    },
    textheader: {
        color: '#d32f2f',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textbottom: {
        fontSize: 14,
    },
});
