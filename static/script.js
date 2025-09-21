document.addEventListener('DOMContentLoaded', () => {
    console.log("dom is loaded")
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const resultContainer = document.getElementById('resultContainer');
    const previewImage = document.getElementById('previewImage');
    const diagnosis = document.getElementById('diagnosis');
    const confidence = document.getElementById('confidence');
    const loading = document.getElementById('loading');

    // Handle file selection
    fileInput.addEventListener('change', handleFileSelect);
    
    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007bff';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFile(files[0]);
        }
    });

    // Click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }

    function cleanupFile(filename) {
        fetch('/cleanup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename: filename })
        }).catch(error => {
            console.error('Error cleaning up file:', error);
        });
    }

    function handleFile(file) {
        console.log('inside ')
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        // Create preview of the selected image
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.onerror = function() {
            console.error('Error reading file for preview');
            previewImage.style.display = 'none';
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        // Show loading spinner
        loading.style.display = 'block';
        resultContainer.style.display = 'none';

        // Upload and get prediction
        fetch('/predict', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log("response", response)
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'An error occurred while processing the image');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            // Display results
            diagnosis.textContent = data.result;
            confidence.textContent = data.confidence;

            // Update result box color based on diagnosis
            const resultBox = document.querySelector('.result-box');
            resultBox.style.backgroundColor = data.result === 'Pneumonia' ? '#fff3f3' : '#f0fff0';
            resultBox.style.border = `2px solid ${data.result === 'Pneumonia' ? '#ff6b6b' : '#51cf66'}`;

            // Show results
            resultContainer.style.display = 'flex';

            // Clean up the file after displaying the result
            //const filename = data.image_path.split('/').pop();
            //cleanupFile(filename);
            console.log('done processing')
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'An error occurred while processing the image');
        })
        .finally(() => {
            loading.style.display = 'none';
        });
    }
}); 