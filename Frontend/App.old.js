import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import StockDetailScreen from './src/screens/StockDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Stocks" component={HomeScreen} />
                <Stack.Screen name="StockDetail" component={StockDetailScreen} options={{ title: 'Stock Details' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

registerRootComponent(App);