import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabelaMaisVendidos from '../home_admin/TabelaMaisVendidos';

const EstoqueLivros = ({ navigation }) => {
    const renderContent = () => <TabelaMaisVendidos navigation={navigation} from={"estoque"} />;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[{}]}
                renderItem={renderContent}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeAreaView>
    );
};

export default EstoqueLivros;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
