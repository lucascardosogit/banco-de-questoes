const URL_BASE_QUESTIONS = "https://localhost:5001/api/questoes";
const URL_BASE_TESTS = "https://localhost:5001/api/provas";

export async function getQuestions() {
    try {
        const response = await fetch(URL_BASE_QUESTIONS);

        if (!response.ok) {
            throw new Error(`Error on response of GET Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process GET Request: ${error}`);
        throw error;
    }
}

export async function getQuestionById(id) {
    try {
        const response = await fetch(`${URL_BASE_QUESTIONS}/${id}`);

        if (!response.ok) {
            throw new Error(`Error on response of GET Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process GET Request: ${error}`);
        throw error;
    }
}

export async function postQuestion(questionData) {
    try {
        const response = await fetch(URL_BASE_QUESTIONS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        });

        if (!response.ok) {
            throw new Error(`Error on response of POST Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process POST Request: ${error}`);
        throw error;
    }
}

export async function putQuestion(id, questionData) {
    try {
        const response = await fetch(`${URL_BASE_QUESTIONS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        });

        if (!response.ok) {
            throw new Error(`Error on response of PUT Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process PUT Request: ${error}`);
        throw error;
    }
}

export async function deleteQuestion(id) {
    try {
        const response = await fetch(`${URL_BASE_QUESTIONS}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error on response of DELETE Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process PUT Request: ${error}`);
        throw error;
    }
}

