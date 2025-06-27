const URL_BASE_QUESTIONS = ""

export function getQuestions() {

    try {
        fetch(URL_BASE_QUESTIONS)
        .then()
    } catch (error) {
        console.error("An error has occurred on process the api: " + error);
    }
}