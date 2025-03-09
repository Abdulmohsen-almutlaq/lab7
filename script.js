// Update this with your own valid Unsplash API key
const UNSPLASH_ACCESS_KEY = 'ukacQIhvRYFT5h1w-gDxK6XN-AzPL6LQlqjXq3LWzE0';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// Common display function
function displayResults(data) {
    const resultsContainer = document.getElementById('results-container');
    const statusMessage = document.getElementById('status-message');
    const title = document.getElementById('title');
    const profileImage = document.getElementById('profileImage');
    const sampleOutput = document.getElementById('sampleOutput');
    
    resultsContainer.innerHTML = '';
    
    if (!data.results || data.results.length === 0) {
        statusMessage.textContent = 'No results found';
        title.textContent = 'No Results';
        profileImage.src = '';
        sampleOutput.textContent = '';
        return;
    }
    
    // Display search term in the title
    const searchTerm = document.getElementById('inputBox').value;
    title.textContent = `Results for "${searchTerm}"`;
    
    // Display the first image in the featured spot
    const firstImage = data.results[0];
    profileImage.src = firstImage.urls.regular;
    profileImage.alt = firstImage.alt_description || 'Featured image';
    
    // Display JSON data in the sampleOutput
    sampleOutput.textContent = `Total results: ${data.total}
    First image by: ${firstImage.user.name}
    Likes: ${firstImage.likes}`;
    
    // Display status message
    statusMessage.textContent = `Found ${data.results.length} results`;
    
    // Display all images
    data.results.forEach(image => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';
        
        const img = document.createElement('img');
        img.src = image.urls.small;
        img.alt = image.alt_description || 'Unsplash image';
        
        const imageInfo = document.createElement('div');
        imageInfo.className = 'image-info';
        
        const photographer = document.createElement('h3');
        photographer.textContent = image.user.name;
        
        const likes = document.createElement('p');
        likes.textContent = `${image.likes} likes`;
        
        imageInfo.appendChild(photographer);
        imageInfo.appendChild(likes);
        
        imageCard.appendChild(img);
        imageCard.appendChild(imageInfo);
        
        // Mouse event handling for the image card
        imageCard.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        imageCard.addEventListener('click', function() {
            window.open(image.links.html, '_blank');
        });
        
        resultsContainer.appendChild(imageCard);
    });
}

// XMLHttpRequest implementation
function searchUsingXHR() {
    const searchTerm = document.getElementById('inputBox').value.trim();
    const statusMessage = document.getElementById('status-message');
    
    if (!searchTerm) {
        statusMessage.textContent = 'Please enter a search term';
        return;
    }
    
    statusMessage.textContent = 'Loading with XMLHttpRequest...';
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${UNSPLASH_API_URL}?query=${encodeURIComponent(searchTerm)}&per_page=30`);
    // Make sure the format is exactly as required by Unsplash
    xhr.setRequestHeader('Authorization', `Client-ID ${UNSPLASH_ACCESS_KEY}`);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayResults(data);
        } else {
            statusMessage.textContent = `Error: ${xhr.status} - ${xhr.statusText}`;
            console.error('XHR Error:', xhr.status, xhr.statusText);
        }
    };
    
    xhr.onerror = function() {
        statusMessage.textContent = 'Network error occurred';
        console.error('Network error');
    };
    
    xhr.send();
}

// Fetch with Promises implementation
function searchUsingFetch() {
    const searchTerm = document.getElementById('inputBox').value.trim();
    const statusMessage = document.getElementById('status-message');
    
    if (!searchTerm) {
        statusMessage.textContent = 'Please enter a search term';
        return;
    }
    
    statusMessage.textContent = 'Loading with Fetch...';
    
    fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(searchTerm)}&per_page=30`, {
        headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayResults(data);
    })
    .catch(error => {
        statusMessage.textContent = `Error: ${error.message}`;
        console.error('Fetch error:', error);
    });
}

// Fetch with Async/Await implementation
async function searchUsingFetchAwaitAsync() {
    const searchTerm = document.getElementById('inputBox').value.trim();
    const statusMessage = document.getElementById('status-message');
    
    if (!searchTerm) {
        statusMessage.textContent = 'Please enter a search term';
        return;
    }
    
    statusMessage.textContent = 'Loading with Fetch Async/Await...';
    
    try {
        const response = await fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(searchTerm)}&per_page=30`, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        statusMessage.textContent = `Error: ${error.message}`;
        console.error('Async/Await error:', error);
    }
}

// Initialize with a default search when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Optional: Uncomment to auto-search on page load
    // searchUsingFetch();
});
