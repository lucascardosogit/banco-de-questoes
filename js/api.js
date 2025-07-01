export function redirect(page, params = {}) {
    const url = new URL(page, window.location.origin);
    
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '') {
            if(Array.isArray(value)) {
                value.forEach(data => {
                    if(data && data.trim() !== ''){
                        url.searchParams.append(key, data);
                    }
                });
            } else {
                url.searchParams.set(key, value);
            }
        }
    });
    
    window.location.href = url.toString();
}

const URL_BASE_QUESTIONS = "https://localhost:5001/api/questoes";

export async function getQuestions() {
    try {
        const response = await fetch(URL_BASE_QUESTIONS);

        if (!response.ok) {
            throw new Error(`Error on response of Questions GET Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Questions GET Request: ${error}`);
        throw error;
    }
}

export async function getQuestionById(id) {
    try {
        const response = await fetch(`${URL_BASE_QUESTIONS}/${id}`);

        if (!response.ok) {
            throw new Error(`Error on response of Questions GET ID Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Questions GET ID Request: ${error}`);
        throw error;
    }
}

export async function getQuestionByParams(disciplina, assuntos = []) {
    try {
        const params = { disciplina };

        if(assuntos.length > 0) {
            params.assunto = assuntos;
        }

        const url = new URL(URL_BASE_QUESTIONS);

        Object.keys(params).forEach(prop => {
            const value = params[prop];
            if(Array.isArray(value)) {
                value.forEach(item => url.searchParams.append(prop, item));
            } else {
                url.searchParams.set(prop, value);
            }
        });

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Error on response of Questions GET PARAMS Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Questions GET PARAMS Request: ${error}`);
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
            throw new Error(`Error on response of Questions POST Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Questions POST Request: ${error}`);
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
            throw new Error(`Error on response of Questions PUT Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Questions PUT Request: ${error}`);
        throw error;
    }
}

export async function deleteQuestion(id) {
    try {
        const response = await fetch(`${URL_BASE_QUESTIONS}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error on response of Questions DELETE Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Questions DELETE Request: ${error}`);
        throw error;
    }
}

const URL_BASE_TESTS = "https://localhost:5001/api/provas";

export async function getTests() {
    try {
        const response = await fetch(URL_BASE_TESTS);

        if (!response.ok) {
            throw new Error(`Error on response of Tests GET Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Tests GET Request: ${error}`);
        throw error;
    }
}

export async function getTestById(id) {
    try {
        const response = await fetch(`${URL_BASE_TESTS}/${id}`);

        if (!response.ok) {
            throw new Error(`Error on response of Tests GET ID Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Tests GET ID Request: ${error}`);
        throw error;
    }
}

export async function postTest(testData) {
    try {
        const response = await fetch(URL_BASE_TESTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        if (!response.ok) {
            throw new Error(`Error on response of Tests POST Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Tests POST Request: ${error}`);
        throw error;
    }
}

export async function putTest(id, testData) {
    try {
        const response = await fetch(`${URL_BASE_TESTS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        if (!response.ok) {
            throw new Error(`Error on response of Tests PUT Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Tests PUT Request: ${error}`);
        throw error;
    }
}

export async function deleteTest(id) {
    try {
        const response = await fetch(`${URL_BASE_TESTS}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error on response of Tests DELETE Request: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error(`Error on process Tests DELETE Request: ${error}`);
        throw error;
    }
}