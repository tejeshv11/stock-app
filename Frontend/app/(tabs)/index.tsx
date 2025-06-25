import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addToWatchlist, getWatchlist, removeFromWatchlist, searchStocks } from '../../src/services/api';

interface StockSearchResult {
    '1. symbol': string;
    '2. name': string;
}

interface WatchlistItem {
    symbol: string;
    companyName?: string;
}

export default function HomeScreen() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        try {
            setSearchLoading(true);
            const results = await searchStocks(query);
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert(
                'Connection Error',
                'Unable to connect to the stock data service. Please check if your backend server is running on localhost:9000',
                [{ text: 'OK' }]
            );
        } finally {
            setSearchLoading(false);
        }
    };

    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const data = await getWatchlist();
            setWatchlist(data);
        } catch (error) {
            console.error('Fetch watchlist error:', error);
            Alert.alert(
                'Connection Error',
                'Unable to load your watchlist. Please check if your backend server is running on localhost:9000',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (item: WatchlistItem) => {
        try {
            await addToWatchlist(item);
            fetchWatchlist();
            Alert.alert('Success', `${item.symbol} added to watchlist!`);
        } catch (error) {
            console.error('Add to watchlist error:', error);
            
            // Check if it's already in watchlist
            if (error instanceof Error && error.message && error.message.includes('Already in watchlist')) {
                Alert.alert(
                    'Already Added',
                    `${item.symbol} is already in your watchlist!`,
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'Error',
                    'Failed to add stock to watchlist. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    const handleRemove = async (symbol: string) => {
        try {
            await removeFromWatchlist(symbol);
            fetchWatchlist();
            Alert.alert('Success', `${symbol} removed from watchlist!`);
        } catch (error) {
            console.error('Remove from watchlist error:', error);
            Alert.alert(
                'Error',
                'Failed to remove stock from watchlist. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const navigateToStockDetail = (symbol: string) => {
        router.push(`/stock/${symbol}` as any);
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stock Tracker</Text>
            
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search stock (e.g. AAPL)"
                    value={query}
                    onChangeText={setQuery}
                    style={styles.input}
                    onSubmitEditing={handleSearch}
                    editable={!searchLoading}
                />
                <Button 
                    title={searchLoading ? "Searching..." : "Search"} 
                    onPress={handleSearch}
                    disabled={searchLoading}
                />
            </View>

            {searchResults.length > 0 && (
                <>
                    <Text style={styles.header}>Search Results</Text>
                    <FlatList
                        data={searchResults}
                        keyExtractor={item => item['1. symbol']}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <View style={styles.stockInfo}>
                                    <Text style={styles.symbol}>{item['1. symbol']}</Text>
                                    <Text style={styles.companyName}>{item['2. name']}</Text>
                                </View>
                                <Button 
                                    title="Add" 
                                    onPress={() => handleAdd({ 
                                        symbol: item['1. symbol']
                                    })} 
                                />
                            </View>
                        )}
                        style={styles.list}
                    />
                </>
            )}

            <Text style={styles.header}>
                Watchlist {loading && "(Loading...)"}
            </Text>
            <FlatList
                data={watchlist}
                keyExtractor={item => item.symbol}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigateToStockDetail(item.symbol)}
                        style={styles.watchlistItem}
                    >
                        <View style={styles.item}>
                            <View style={styles.stockInfo}>
                                <Text style={styles.symbol}>{item.symbol}</Text>
                                {item.companyName && (
                                    <Text style={styles.companyName}>{item.companyName}</Text>
                                )}
                            </View>
                            <Button 
                                title="Remove" 
                                onPress={() => handleRemove(item.symbol)}
                                color="#ff4444"
                            />
                        </View>
                    </TouchableOpacity>
                )}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333'
    },
    searchContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20
    },
    input: { 
        flex: 1,
        borderWidth: 1, 
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: 'white'
    },
    header: { 
        fontWeight: 'bold', 
        fontSize: 18, 
        marginTop: 20,
        marginBottom: 10,
        color: '#333'
    },
    list: {
        maxHeight: 300
    },
    item: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    watchlistItem: {
        marginBottom: 8
    },
    stockInfo: {
        flex: 1
    },
    symbol: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    companyName: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    }
});
