let mockStore = {
    tags: ['Invoice', 'Contract', 'Report', 'ID Card', 'Certificate', 'License', 'Application', 'Letter'],
};

// Document API
export const documentAPI = {
    // Get all tags
    getTags: async () => {
        await delay(300);
        return {
            data: {
                tags: mockStore.tags,
            }
        };
    },

    // Get personal names
    getPersonalNames: async () => {
        await delay(300);
        return {
            data: {
                names: ['John', 'Tom', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Robert', 'Jennifer'],
            }
        };
    },

    // Get departments
    getDepartments: async () => {
        await delay(300);
        return {
            data: {
                departments: ['Accounts', 'HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales', 'Legal', 'Admin', 'Support'],
            }
        };
    },
}