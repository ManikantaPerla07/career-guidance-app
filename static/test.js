const careerForm = document.getElementById('careerForm');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const resultsList = document.getElementById('resultsList');
const submitBtn = document.querySelector('.submit-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

careerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(careerForm);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = parseFloat(value);
    }
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayResults(result.recommendations);
            errorSection.style.display = 'none';
        } else {
            displayError(result.error || 'An error occurred');
        }
    } catch (error) {
        displayError('Server error: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

function displayResults(recommendations) {
    resultsList.innerHTML = '';
    
    recommendations.forEach((rec) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        resultItem.innerHTML = `
            <div class="result-rank">#${rec.rank}</div>
            <div class="result-info">
                <h3>${rec.career}</h3>
            </div>
            <div class="result-confidence">
                <span class="confidence-percentage">${rec.confidence}%</span>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        resultsList.appendChild(resultItem);
        
        setTimeout(() => {
            const progressFill = resultItem.querySelector('.confidence-fill');
            progressFill.style.width = rec.confidence + '%';
        }, 50);
    });
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function displayError(message) {
    document.getElementById('errorMessage').textContent = message;
    errorSection.style.display = 'block';
    resultsSection.style.display = 'none';
}
