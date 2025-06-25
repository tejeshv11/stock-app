import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getStockDetails, getStockHistory } from '../services/api';

export default function StockDetailScreen({ route }) {
    const { symbol } = route.params;
    const [details, setDetails] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const d = await getStockDetails(symbol);
            console.log(d);
            const h = await getStockHistory(symbol);
            setDetails(d);
            setHistory(h);
        };
        fetchData();
    }, [symbol]);

    if (!details) return <Text>Loading...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{symbol}</Text>
            <Text>Price: ${details["05. price"]}</Text>
            <Text>Change: {details["10. change percent"]}</Text>
            {history.length > 0 && (
                <LineChart
                    data={{
                        labels: history.map(h => h.date),
                        datasets: [{ data: history.map(h => h.price) }]
                    }}
                    width={Dimensions.get('window').width - 32}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    bezier
                    style={{ marginTop: 16 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
});