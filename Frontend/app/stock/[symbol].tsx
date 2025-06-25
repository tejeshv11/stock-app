import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getStockDetails, getStockHistory } from '../../src/services/api';

interface StockDetails {
    price: number;
    changePercent: string;
    [key: string]: any;
}

interface StockHistory {
    date: string;
    price: number;
}

export default function StockDetailScreen() {
    const { symbol } = useLocalSearchParams<{ symbol: string }>();
    const [details, setDetails] = useState<StockDetails | null>(null);
    const [history, setHistory] = useState<StockHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isBSE = typeof symbol === 'string' && symbol.endsWith('.BSE');
    const currencySymbol = isBSE ? '₹' : '$';

    useEffect(() => {
        const fetchData = async () => {
            if (!symbol) return;
            
            try {
                setLoading(true);
                setError(null);
                const [stockDetails, stockHistory] = await Promise.all([
                    getStockDetails(symbol),
                    getStockHistory(symbol)
                ]);
                setDetails(stockDetails);
                setHistory(stockHistory.sort((a: StockHistory, b: StockHistory) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            } catch (error) {
                console.error('Error fetching stock data:', error);
                setError('Unable to load stock data. Please check if your backend server is running on localhost:9000');
                Alert.alert(
                    'Connection Error',
                    'Unable to load stock data. Please check if your backend server is running on localhost:9000',
                    [{ text: 'OK' }]
                );
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [symbol]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading stock data...</Text>
            </View>
        );
    }

    if (error || !details) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error || 'Failed to load stock data'}
                </Text>
                <Text style={styles.errorSubtext}>
                    Make sure your backend server is running on localhost:9000
                </Text>
            </View>
        );
    }

    const price = details.price;
    const change = details.pnl;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{symbol}</Text>
            
            <View style={styles.priceContainer}>
                <Text style={styles.price}>{currencySymbol}{price?.toFixed(2) || 'N/A'}</Text>
                <Text style={[
                    styles.change, 
                    { color: (change || '').toString().startsWith('-') ? '#ff4444' : '#4CAF50' }
                ]}>
                    {change || 'N/A'}
                </Text>
            </View>

            {history.length > 0 ? (
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Price History</Text>
                    <LineChart
                        data={{
                            labels: history.map(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).slice(-7),
                            datasets: [{
                                data: history.map(h => h.price)
                            }]
                        }}
                        width={Dimensions.get('window').width - 64}
                        height={250}
                        yAxisLabel={currencySymbol}
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#f8f9fa',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '4',
                                strokeWidth: '2',
                                stroke: '#007AFF'
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                </View>
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No historical data available</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666'
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20
    },
    errorText: {
        fontSize: 18,
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: 10
    },
    errorSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    },
    title: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        marginBottom: 16,
        textAlign: 'center',
        color: '#333'
    },
    priceContainer: {
        alignItems: 'center',
        marginBottom: 24
    },
    price: { 
        fontSize: 48, 
        fontWeight: 'bold',
        color: '#333'
    },
    change: { 
        fontSize: 18,
        marginTop: 8,
        fontWeight: '600'
    },
    chartContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    chartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333'
    },
    chartPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8
    },
    chartText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8
    },
    chartSubtext: {
        fontSize: 14,
        color: '#999'
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    noDataText: {
        fontSize: 16,
        color: '#666'
    }
}); 