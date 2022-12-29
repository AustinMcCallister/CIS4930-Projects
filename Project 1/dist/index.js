"use strict";
const displayController = (() => {
    // DOM Cache
    const _header = document.querySelector('.image-header-container');
    const _ratingStarsContainer = document.querySelector('.rating-stars-container');
    const init = () => {
        drawScore();
        reviewForm.bindStars();
        reviewForm.bindSubmit();
    };
    const drawScore = () => {
        const scoreBoard = document.createElement('div');
        scoreBoard.classList.add('product-stars');
        const docFrag = document.createDocumentFragment();
        let numStars = 0;
        for (let i = 0; i < scoreController.getUserScore(); i++) {
            // Handle scores between integers
            if ((Math.round((scoreController.getUserScore() - i) * 10) / 10) < 1) {
                if ((Math.round((scoreController.getUserScore() - i) * 10) / 10) >= 0.5) {
                    docFrag.appendChild(addStar('half'));
                }
                else {
                    docFrag.appendChild(addStar('empty'));
                }
            }
            else {
                docFrag.appendChild(addStar('full'));
            }
            numStars++;
        }
        // Ensure there are always 5 stars
        if (numStars < 5) {
            for (let i = numStars; i < 5; i++) {
                docFrag.appendChild(addStar('empty'));
            }
        }
        const score = document.createElement('div');
        score.classList.add('product-score');
        score.textContent = `${scoreController.getUserScore().toFixed(1)} / 5`;
        docFrag.appendChild(score);
        scoreBoard.appendChild(docFrag);
        _header.appendChild(scoreBoard);
    };
    const addStar = (state) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.setAttribute('viewBox', '0 0 24 24');
        path.setAttribute('fill', 'currentColor');
        switch (state) {
            case 'full':
                path.setAttribute('d', 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z');
                break;
            case 'half':
                path.setAttribute('d', 'M12,15.4V6.1L13.71,10.13L18.09,10.5L14.77,13.39L15.76,17.67M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z');
                break;
            case 'empty':
                path.setAttribute('d', 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z');
                break;
        }
        svg.appendChild(path);
        return svg;
    };
    const drawRatingStars = (count) => {
        const ratingStars = document.createElement('div');
        ratingStars.classList.add('rating-stars');
        let numStars = 0;
        for (let i = 1; i <= count; i++) {
            const star = document.createElement('div');
            star.id = `${i}`;
            star.classList.add('star');
            star.appendChild(addStar('full'));
            ratingStars.appendChild(star);
            numStars++;
        }
        if (numStars < 5) {
            for (let i = numStars; i < 5; i++) {
                const star = document.createElement('div');
                star.id = `${i + 1}`;
                star.classList.add('star');
                star.appendChild(addStar('empty'));
                ratingStars.appendChild(star);
            }
        }
        _ratingStarsContainer.appendChild(ratingStars);
    };
    const deleteScore = () => {
        const _scoreBoard = document.querySelector('.product-stars');
        if (_scoreBoard) {
            _scoreBoard.remove();
        }
    };
    const deleteRating = () => {
        const _ratingStars = document.querySelector('.rating-stars');
        if (_ratingStars) {
            _ratingStars.remove();
        }
    };
    return {
        init,
        drawScore,
        addStar,
        drawRatingStars,
        deleteScore,
        deleteRating,
    };
})();
const scoreController = (() => {
    let _userScore = 0;
    const getUserScore = () => {
        return _userScore;
    };
    const setUserScore = (score) => {
        _userScore = score;
    };
    return {
        getUserScore,
        setUserScore,
    };
})();
const reviewForm = (() => {
    // DOM Cache
    const _submitButton = document.querySelector('.submit-review');
    let _rating = 1;
    const bindStars = () => {
        const _stars = document.querySelectorAll('.star');
        _stars.forEach((star) => {
            star.addEventListener('click', (event) => {
                switch (event.currentTarget.getAttribute('id')) {
                    case '1':
                        _rating = 1;
                        break;
                    case '2':
                        _rating = 2;
                        break;
                    case '3':
                        _rating = 3;
                        break;
                    case '4':
                        _rating = 4;
                        break;
                    case '5':
                        _rating = 5;
                        break;
                }
                displayController.deleteRating();
                displayController.drawRatingStars(_rating);
                bindStars();
            });
        });
    };
    const bindSubmit = () => {
        _submitButton.addEventListener('click', () => {
            const nameBlock = document.getElementById('name');
            const commentBlock = document.getElementById('comment');
            if (nameBlock.value) {
                reviewController.addReview(nameBlock.value, commentBlock.value, _rating);
                scoreController.setUserScore(reviewController.getReviewScore());
                nameBlock.value = '';
                commentBlock.value = '';
                displayController.deleteScore();
                displayController.drawScore();
            }
            else {
                nameBlock.setCustomValidity('This field is required');
                nameBlock.reportValidity();
            }
        });
    };
    const getRating = () => {
        return _rating;
    };
    const setRating = (rating) => {
        _rating = rating;
    };
    return {
        bindStars,
        bindSubmit,
        getRating,
        setRating,
    };
})();
const reviewController = (() => {
    //DOM cache
    const _reviewSection = document.querySelector('.customer-reviews');
    let _reviewScores = [];
    const addReview = (name, comment, rating) => {
        const date = new Date();
        document.createDocumentFragment();
        const review = document.createElement('div');
        review.classList.add('review');
        const header = document.createElement('div');
        header.classList.add('review-name');
        header.textContent = name;
        const stars = document.createElement('div');
        stars.classList.add('review-score');
        for (let i = 0; i < rating; i++) {
            stars.appendChild(displayController.addStar('full'));
        }
        const reviewDate = document.createElement('div');
        reviewDate.classList.add('review-date');
        reviewDate.textContent = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
        const text = document.createElement('div');
        text.classList.add('review-comment');
        text.textContent = comment;
        review.appendChild(header);
        review.appendChild(stars);
        review.appendChild(reviewDate);
        review.appendChild(text);
        _reviewSection.appendChild(review);
        _reviewScores.push(rating);
        reviewForm.setRating(1);
        displayController.deleteRating();
        displayController.drawRatingStars(reviewForm.getRating());
        reviewForm.bindStars();
    };
    const getReviewScore = () => {
        let total = 0;
        _reviewScores.forEach((score) => {
            total += score;
        });
        return (total / _reviewScores.length);
    };
    return {
        addReview,
        getReviewScore,
    };
})();
displayController.init();
//# sourceMappingURL=index.js.map