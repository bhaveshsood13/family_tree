const API_BASE_URL = '/api';

export const fetchTree = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/tree`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tree data:', error);
        throw error;
    }
};

export const saveTree = async (treeData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tree`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(treeData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error saving tree data:', error);
        throw error;
    }
};
