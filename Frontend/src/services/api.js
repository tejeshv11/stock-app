const API_URL = 'http://localhost:9000';

export const searchStocks = async (query) => {
    try {
        const res = await fetch(`${API_URL}/stocks/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }
        const responseText = await res.text();
        if (!responseText) {
            return [];
        }

        const result = JSON.parse(responseText);

        return result;
    } catch (error) {
        console.error('Search error:', error);
        // If there's a parse error, it might be an empty response. Return empty array.
        if (error instanceof SyntaxError) {
            console.log('JSON parse error on search, returning empty array.');
            return [];
        }
        throw error;
    }
};

export const getStockDetails = async (symbol) => {
    try {
        const res = await fetch(`${API_URL}/stocks/${encodeURIComponent(symbol)}`);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }
        return res.json();
    } catch (error) {
        console.error('Get stock details error:', error);
        throw error;
    }
};

export const getStockHistory = async (symbol) => {
    try {
        const res = await fetch(`${API_URL}/stocks/${encodeURIComponent(symbol)}/history`);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }
        return res.json();
    } catch (error) {
        console.error('Get stock history error:', error);
        throw error;
    }
};

export const getWatchlist = async () => {
    try {
        const res = await fetch(`${API_URL}/watchlist`);

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error('Get watchlist error:', error);
        throw error;
    }
};

export const addToWatchlist = async (stock) => {
    try {
        const res = await fetch(`${API_URL}/watchlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(stock),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error('Add to watchlist error:', error);
        throw error;
    }
};

export const removeFromWatchlist = async (symbol) => {
    try {
        const res = await fetch(`${API_URL}/watchlist/${encodeURIComponent(symbol)}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`);
        }

        // Check if response has content before trying to parse JSON
        const responseText = await res.text();

        if (responseText.trim() === '') {
            // Empty response is fine for DELETE operations
            return { success: true };
        }

        // Try to parse JSON if there's content
        try {
            const result = JSON.parse(responseText);
            return result;
        } catch (parseError) {
            return { success: true, message: responseText };
        }
    } catch (error) {
        console.error('Remove from watchlist error:', error);
        throw error;
    }
};
