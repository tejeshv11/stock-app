import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addToWatchlist, getWatchlist, removeFromWatchlist, searchStocks } from '../services/api';

export default function HomeScreen({ navigation }) {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [watchlist, setWatchlist] = useState([]);

    const handleSearch = async () => {
        const results = await searchStocks(query);
        setSearchResults(results);
    };

    const fetchWatchlist = async () => {
        const data = await getWatchlist();
        setWatchlist(data);
    };

    const handleAdd = async (item) => {
        await addToWatchlist(item);
        fetchWatchlist();
    };

    const handleRemove = async (symbol) => {
        await removeFromWatchlist(symbol);
        fetchWatchlist();
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search stock (e.g. AAPL)"
                value={query}
                onChangeText={setQuery}
                style={styles.input}
            />
            <Button title="Search" onPress={handleSearch} />

            <Text style={styles.header}>Search Results</Text>
            <FlatList
                data={searchResults}
                keyExtractor={item => item['1. symbol']}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item['1. symbol']} - {item['2. name']}</Text>
                        <Button title="Add" onPress={() => handleAdd({ symbol: item['1. symbol'], companyName: item['2. name'] })} />
                    </View>
                )}
            />

            <Text style={styles.header}>Watchlist</Text>
            <FlatList
                data={watchlist}
                keyExtractor={item => item.symbol}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('StockDetail', { symbol: item.symbol })}
                    >
                        <View style={styles.item}>
                            <Text>{item.symbol} - {item.companyName}</Text>
                            <Button title="Remove" onPress={() => handleRemove(item.symbol)} />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    input: { borderWidth: 1, padding: 8, marginBottom: 8 },
    header: { fontWeight: 'bold', fontSize: 16, marginTop: 16 },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
});