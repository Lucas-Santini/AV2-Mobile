import { StyleSheet, View } from 'react-native';
import { Insert } from './banco/Insert';
import { AllContacts } from './banco/AllContacts';

export default function App() {
  return (
    <View style={styles.container}>
      <Insert />
      <AllContacts />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco
    padding: 2, // Padding para dar espaço ao redor
    alignItems: 'center',
    justifyContent: 'center'
  },
});
